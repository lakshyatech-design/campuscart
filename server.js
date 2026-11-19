/**
 * CampusCart - Backend Server
 * "One Platform. Every Campus."
 * 
 * Powered by Node.js built-in runtime
 * Supports both standalone Node.js server and serverless cloud deployment.
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const EventEmitter = require('node:events');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Safe SQLite loader (falls back gracefully if not in Node 22.5+)
let db = null;
let DatabaseSync = null;
try {
  DatabaseSync = require('node:sqlite').DatabaseSync;
  const dbDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'campuscart.db');
  db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');
} catch (e) {
  console.log('Using in-memory/serverless storage mode');
}

// Global Event Bus for Real-Time SSE Updates
const realtimeBus = new EventEmitter();
realtimeBus.setMaxListeners(200);

// Initialize Database if SQLite is active
if (db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS colleges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      domain TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 0,
      student_count INTEGER DEFAULT 0,
      badge TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT,
      college_id TEXT NOT NULL,
      roll_number TEXT,
      is_roll_private INTEGER DEFAULT 1,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT DEFAULT 'student',
      is_admin INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 1,
      is_suspended INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (college_id) REFERENCES colleges(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT NOT NULL,
      condition TEXT NOT NULL,
      college_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      campus_location TEXT NOT NULL,
      contact_preference TEXT DEFAULT 'chat',
      images TEXT NOT NULL,
      dynamic_attributes TEXT,
      status TEXT DEFAULT 'active',
      views_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (college_id) REFERENCES colleges(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      last_message TEXT,
      last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS college_requests (
      id TEXT PRIMARY KEY,
      college_name TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      requester_name TEXT NOT NULL,
      requester_email TEXT NOT NULL,
      student_id TEXT,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM colleges').get().count;
  if (count === 0) {
    seedInitialData();
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'campuscart_salt_2026').digest('hex');
}

function seedInitialData() {
  if (!db) return;
  const colleges = [
    { id: 'gsv-vadodara', name: 'Gati Shakti Vishwavidyalaya (GSV)', short_name: 'GSV Vadodara', city: 'Vadodara', state: 'Gujarat', domain: 'gsv.ac.in', is_active: 1, student_count: 2450, badge: 'Exclusive Campus' }
  ];

  const insertCollege = db.prepare('INSERT INTO colleges VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
  for (const c of colleges) {
    insertCollege.run(c.id, c.name, c.short_name, c.city, c.state, c.domain, c.is_active, c.student_count, c.badge);
  }

  const users = [
    { id: 'user-admin', full_name: 'GSV Operations Admin', email: 'admin@gsv.ac.in', mobile: '+91 99000 11223', college_id: 'gsv-vadodara', roll_number: 'STAFF-ADM-01', is_roll_private: 0, password_hash: hashPassword('admin123'), avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80', role: 'admin', is_admin: 1 },
    { id: 'user-d953e9be', full_name: 'Prashant Gupta', email: 'prashant.gupta_btech25@gsv.ac.in', mobile: '+91 9988776655', college_id: 'gsv-vadodara', roll_number: '2025-BTECH-099', is_roll_private: 1, password_hash: hashPassword('student123'), avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120', role: 'student', is_admin: 0 }
  ];

  const insertUser = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, CURRENT_TIMESTAMP)');
  for (const u of users) {
    insertUser.run(u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.password_hash, u.avatar_url, u.role, u.is_admin);
  }
}

// Request dispatcher
const apiHandler = require('./api/index.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Route /api/* to the serverless api handler
  if (pathname.startsWith('/api')) {
    return apiHandler(req, res);
  }

  // Static file serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback to index.html for SPA
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Start listening if standalone
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CampusCart running at http://localhost:${PORT}`);
  });
}

module.exports = server;
