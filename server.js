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
    { id: 'gsv-vadodara', name: 'Gati Shakti Vishwavidyalaya (GSV)', short_name: 'GSV Vadodara', city: 'Vadodara', state: 'Gujarat', domain: 'gsv.ac.in', is_active: 1, student_count: 2450, badge: 'Launch Campus' },
    { id: 'iit-bombay', name: 'Indian Institute of Technology Bombay (IITB)', short_name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', domain: 'iitb.ac.in', is_active: 1, student_count: 11200, badge: 'Active Hub' },
    { id: 'bits-pilani', name: 'Birla Institute of Technology and Science (BITS)', short_name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', domain: 'pilani.bits-pilani.ac.in', is_active: 1, student_count: 5800, badge: 'Active Hub' },
    { id: 'nit-trichy', name: 'National Institute of Technology Tiruchirappalli (NITT)', short_name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', domain: 'nitt.edu', is_active: 1, student_count: 6700, badge: 'Active Hub' },
    { id: 'delhi-university', name: 'University of Delhi (DU)', short_name: 'Delhi University', city: 'New Delhi', state: 'Delhi', domain: 'du.ac.in', is_active: 0, student_count: 25000, badge: 'Coming Soon' },
    { id: 'iim-ahmedabad', name: 'Indian Institute of Management Ahmedabad (IIMA)', short_name: 'IIM Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', domain: 'iima.ac.in', is_active: 0, student_count: 1400, badge: 'Coming Soon' }
  ];

  const insertCollege = db.prepare('INSERT INTO colleges VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
  for (const c of colleges) {
    insertCollege.run(c.id, c.name, c.short_name, c.city, c.state, c.domain, c.is_active, c.student_count, c.badge);
  }

  const users = [
    { id: 'user-aarav', full_name: 'Aarav Sharma', email: 'aarav.sharma@gsv.ac.in', mobile: '+91 98765 43210', college_id: 'gsv-vadodara', roll_number: 'GSV2023BTECH042', is_roll_private: 0, password_hash: hashPassword('student123'), avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', role: 'student', is_admin: 0 },
    { id: 'user-priya', full_name: 'Priya Patel', email: 'priya.patel@gsv.ac.in', mobile: '+91 98251 23456', college_id: 'gsv-vadodara', roll_number: 'GSV2024MBA018', is_roll_private: 1, password_hash: hashPassword('student123'), avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', role: 'student', is_admin: 0 },
    { id: 'user-rohan', full_name: 'Rohan Mehta', email: 'rohan.mehta@gsv.ac.in', mobile: '+91 98980 98765', college_id: 'gsv-vadodara', roll_number: 'GSV2022BTECH105', is_roll_private: 0, password_hash: hashPassword('student123'), avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', role: 'student', is_admin: 0 },
    { id: 'user-admin', full_name: 'CampusCart Admin (GSV Operations)', email: 'admin@campuscart.in', mobile: '+91 99000 11223', college_id: 'gsv-vadodara', roll_number: 'STAFF-ADM-01', is_roll_private: 0, password_hash: hashPassword('admin123'), avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80', role: 'admin', is_admin: 1 }
  ];

  const insertUser = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, CURRENT_TIMESTAMP)');
  for (const u of users) {
    insertUser.run(u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.password_hash, u.avatar_url, u.role, u.is_admin);
  }

  const products = [
    {
      id: 'prod-1',
      title: 'IRCTC Vadodara (BRC) to New Delhi (NDLS) 3AC Ticket',
      category: 'Railway Tickets',
      price: 1350,
      description: 'Confirmed 3AC berth for Vadodara to New Delhi. Strictly in accordance with Indian Railway passenger transfer guidelines.',
      condition: 'Like New',
      college_id: 'gsv-vadodara',
      seller_id: 'user-aarav',
      campus_location: 'Hostel Block B, Room 214',
      images: JSON.stringify(['https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800']),
      dynamic_attributes: JSON.stringify({ journey_date: '2026-11-28', from_station: 'Vadodara Jn (BRC)', to_station: 'New Delhi (NDLS)', train_name_number: '12951 / Rajdhani Express', ticket_type: '3AC' })
    },
    {
      id: 'prod-2',
      title: 'Rasasi Hawas for Him Eau de Parfum (85ml / 100ml)',
      category: 'Perfumes',
      price: 2400,
      description: 'Authentic Rasasi Hawas EDP bottle with original purple box and batch code. Fresh plum aquatic scent with 10+ hour longevity.',
      condition: 'Like New',
      college_id: 'gsv-vadodara',
      seller_id: 'user-rohan',
      campus_location: 'GSV Student Activity Centre',
      images: JSON.stringify(['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800']),
      dynamic_attributes: JSON.stringify({ brand: 'Rasasi', bottle_size: '100 ml', remaining_level: '85 ml (85%)', original_box: 'Yes' })
    },
    {
      id: 'prod-3',
      title: 'Hero Sprint Pro 26T 21-Speed Gear Bicycle + Lock',
      category: 'Cycles',
      price: 3600,
      description: 'Used for 1 year to commute across GSV campus. Shimano 21 gears, front suspension, includes cable lock.',
      condition: 'Good',
      college_id: 'gsv-vadodara',
      seller_id: 'user-aarav',
      campus_location: 'Hostel Cycle Parking, GSV',
      images: JSON.stringify(['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800']),
      dynamic_attributes: JSON.stringify({ brand: 'Hero Sprint', gears: '21 Shimano' })
    }
  ];

  const insertProd = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
  for (const p of products) {
    insertProd.run(p.id, p.title, p.category, p.price, p.description, p.condition, p.college_id, p.seller_id, p.campus_location, 'chat', p.images, p.dynamic_attributes, 'active', 100);
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
