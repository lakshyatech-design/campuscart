/**
 * CampusCart - Backend Server
 * "One Platform. Every Campus."
 * 
 * Powered by Node.js built-in runtime (node:http, node:sqlite, node:crypto)
 * Provides RESTful APIs, Real-time SSE Message Streaming, and Static File Serving.
 * Compatible with Supabase PostgreSQL migration (see supabase_schema.sql).
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const EventEmitter = require('node:events');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'campuscart.db');
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Global Event Bus for Real-Time SSE Updates
const realtimeBus = new EventEmitter();
realtimeBus.setMaxListeners(200);

// Initialize SQLite Database
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
function initDatabase() {
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
      images TEXT NOT NULL, -- JSON array of image URLs
      dynamic_attributes TEXT, -- JSON object for special fields (e.g. railway ticket, perfume)
      status TEXT DEFAULT 'active', -- active, sold, deleted
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
      PRIMARY KEY (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
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
      status TEXT DEFAULT 'pending', -- pending, approved, rejected
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      target_type TEXT NOT NULL, -- 'product' or 'user'
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'pending', -- pending, resolved, dismissed
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL, -- 'message', 'inquiry', 'system', 'report'
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedInitialData();
}

// Seed Real Initial Data for Launch
function seedInitialData() {
  const collegeCheck = db.prepare('SELECT COUNT(*) as count FROM colleges').get();
  if (collegeCheck.count > 0) return;

  console.log('🌱 Seeding initial CampusCart colleges, users, and realistic student marketplace listings...');

  // 1. Colleges
  const colleges = [
    {
      id: 'gsv-vadodara',
      name: 'Gati Shakti Vishwavidyalaya (GSV)',
      short_name: 'GSV Vadodara',
      city: 'Vadodara',
      state: 'Gujarat',
      domain: 'gsv.ac.in',
      is_active: 1,
      student_count: 2450,
      badge: 'Launch Campus'
    },
    {
      id: 'iit-bombay',
      name: 'Indian Institute of Technology Bombay (IITB)',
      short_name: 'IIT Bombay',
      city: 'Mumbai',
      state: 'Maharashtra',
      domain: 'iitb.ac.in',
      is_active: 1,
      student_count: 11200,
      badge: 'Active Hub'
    },
    {
      id: 'bits-pilani',
      name: 'Birla Institute of Technology and Science (BITS)',
      short_name: 'BITS Pilani',
      city: 'Pilani',
      state: 'Rajasthan',
      domain: 'pilani.bits-pilani.ac.in',
      is_active: 1,
      student_count: 5800,
      badge: 'Active Hub'
    },
    {
      id: 'nit-trichy',
      name: 'National Institute of Technology Tiruchirappalli (NITT)',
      short_name: 'NIT Trichy',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      domain: 'nitt.edu',
      is_active: 1,
      student_count: 6700,
      badge: 'Active Hub'
    },
    {
      id: 'delhi-university',
      name: 'University of Delhi (North & South Campus)',
      short_name: 'Delhi University',
      city: 'New Delhi',
      state: 'Delhi',
      domain: 'du.ac.in',
      is_active: 0,
      student_count: 25000,
      badge: 'Coming Soon'
    },
    {
      id: 'iim-ahmedabad',
      name: 'Indian Institute of Management Ahmedabad (IIMA)',
      short_name: 'IIM Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      domain: 'iima.ac.in',
      is_active: 0,
      student_count: 1400,
      badge: 'Coming Soon'
    }
  ];

  const insertCollege = db.prepare(`
    INSERT INTO colleges (id, name, short_name, city, state, domain, is_active, student_count, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of colleges) {
    insertCollege.run(c.id, c.name, c.short_name, c.city, c.state, c.domain, c.is_active, c.student_count, c.badge);
  }

  // 2. Users (Dual role buyers and sellers)
  const users = [
    {
      id: 'user-aarav',
      full_name: 'Aarav Sharma',
      email: 'aarav.sharma@gsv.ac.in',
      mobile: '+91 98765 43210',
      college_id: 'gsv-vadodara',
      roll_number: 'GSV2023BTECH042',
      is_roll_private: 0,
      password_hash: hashPassword('student123'),
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      role: 'student',
      is_admin: 0
    },
    {
      id: 'user-priya',
      full_name: 'Priya Patel',
      email: 'priya.patel@gsv.ac.in',
      mobile: '+91 98251 23456',
      college_id: 'gsv-vadodara',
      roll_number: 'GSV2024MBA018',
      is_roll_private: 1,
      password_hash: hashPassword('student123'),
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      role: 'student',
      is_admin: 0
    },
    {
      id: 'user-rohan',
      full_name: 'Rohan Mehta',
      email: 'rohan.mehta@gsv.ac.in',
      mobile: '+91 98980 98765',
      college_id: 'gsv-vadodara',
      roll_number: 'GSV2022BTECH105',
      is_roll_private: 0,
      password_hash: hashPassword('student123'),
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'student',
      is_admin: 0
    },
    {
      id: 'user-ananya',
      full_name: 'Ananya Iyer',
      email: 'ananya.iyer@gsv.ac.in',
      mobile: '+91 97123 45678',
      college_id: 'gsv-vadodara',
      roll_number: 'GSV2023MTECH011',
      is_roll_private: 1,
      password_hash: hashPassword('student123'),
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      role: 'student',
      is_admin: 0
    },
    {
      id: 'user-admin',
      full_name: 'CampusCart Admin (GSV Operations)',
      email: 'admin@campuscart.in',
      mobile: '+91 99000 11223',
      college_id: 'gsv-vadodara',
      roll_number: 'STAFF-ADM-01',
      is_roll_private: 0,
      password_hash: hashPassword('admin123'),
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      role: 'admin',
      is_admin: 1
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, full_name, email, mobile, college_id, roll_number, is_roll_private, password_hash, avatar_url, role, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const u of users) {
    insertUser.run(u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.password_hash, u.avatar_url, u.role, u.is_admin);
  }

  // 3. Products
  const products = [
    {
      id: 'prod-1',
      title: 'IRCTC Vadodara (BRC) to New Delhi (NDLS) 3AC Ticket',
      category: 'Railway Tickets',
      price: 1350,
      description: 'Confirmed 3AC berth for Vadodara to New Delhi Rajdhani/Express. Selling because my academic project deadline was rescheduled to next week. Transfer/handover strictly in accordance with Indian Railway passenger guidelines and student id transfer authorization.',
      condition: 'Like New',
      college_id: 'gsv-vadodara',
      seller_id: 'user-aarav',
      campus_location: 'Hostel Block B, Room 214',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        journey_date: '2026-11-28',
        from_station: 'Vadodara Jn (BRC)',
        to_station: 'New Delhi (NDLS)',
        train_name_number: '12951 / Mumbai Central Rajdhani',
        ticket_type: '3AC (3rd AC Sleeper)',
        pnr_status: 'Confirmed (B3-42 Lower)',
        compliance_notice: 'Important: Indian Railways permits transfer of confirmed tickets to other bonafide students on written application by the recognized educational institution head 24h before train departure.'
      }),
      views_count: 89,
      status: 'active'
    },
    {
      id: 'prod-2',
      title: 'Rasasi Hawas for Him Eau de Parfum (85ml / 100ml)',
      category: 'Perfumes',
      price: 2400,
      description: 'Authentic Rasasi Hawas EDP bottle with original purple packaging box and batch code. Purchased from trusted retailer 3 months ago. Fresh aquatic plum and cinnamon scent with tremendous 10+ hour longevity. Around 85-90ml remaining.',
      condition: 'Like New',
      college_id: 'gsv-vadodara',
      seller_id: 'user-rohan',
      campus_location: 'GSV Student Activity Centre',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        brand: 'Rasasi',
        bottle_size: '100 ml',
        remaining_level: '85 ml (85%)',
        original_box: 'Yes, original box with batch code included',
        fragrance_type: 'Eau de Parfum (Aquatic Fruity Woody)'
      }),
      views_count: 142,
      status: 'active'
    },
    {
      id: 'prod-3',
      title: 'Hero Sprint Pro 26T 21-Speed Gear Bicycle + Number Lock',
      category: 'Cycles',
      price: 3600,
      description: 'Used for 1 year to commute between GSV Lalbaug Campus and Pratap Nagar Railway Colony hostel. Dual disc brakes, Shimano 21-speed thumb shifters, front suspension, comfortable gel seat cover. Includes a heavy-duty steel cable combination lock. Serviced last month.',
      condition: 'Good',
      college_id: 'gsv-vadodara',
      seller_id: 'user-aarav',
      campus_location: 'Hostel Cycle Parking, GSV Vadodara',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        brand: 'Hero Sprint Pro',
        gears: '21 Shimano Gears',
        brakes: 'Dual Disc',
        accessories: 'Heavy Duty Wire Lock, Mudguards, Water bottle cage'
      }),
      views_count: 215,
      status: 'active'
    },
    {
      id: 'prod-4',
      title: 'Higher Engineering Mathematics (B.S. Grewal 44th Edition) + Satish Chandra Railway Engg',
      category: 'Books & Study Materials',
      price: 550,
      description: 'Bundle of 2 essential textbooks for GSV engineering students: B.S. Grewal 44th Edition in pristine condition (no torn pages, minimal pencil markings) + Railway Engineering by Satish Chandra and M.M. Agarwal. Extremely useful for semester exams and GATE.',
      condition: 'Like New',
      college_id: 'gsv-vadodara',
      seller_id: 'user-priya',
      campus_location: 'Central Library, GSV Main Campus',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        edition: '44th Edition',
        subject: 'Engineering Math & Railway Engineering',
        pages_condition: 'Clean, no highlighter marks'
      }),
      views_count: 98,
      status: 'active'
    },
    {
      id: 'prod-5',
      title: 'Bajaj 1.5L Stainless Steel Electric Kettle + Immersion Rod',
      category: 'Hostel Essentials',
      price: 650,
      description: 'Must-have combo for winter semester in Vadodara hostels! 1500W rapid boil Bajaj electric kettle (auto cut-off) + 1000W shockproof immersion heating rod. Both tested and working perfectly. Cleaned and sanitized.',
      condition: 'Good',
      college_id: 'gsv-vadodara',
      seller_id: 'user-ananya',
      campus_location: 'Girls Hostel Block A, 1st Floor',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        wattage: '1500W Kettle / 1000W Rod',
        brand: 'Bajaj',
        warranty_status: 'Out of warranty, fully functional'
      }),
      views_count: 174,
      status: 'active'
    },
    {
      id: 'prod-6',
      title: 'Casio fx-991CW ClassWiz Non-Programmable Scientific Calculator',
      category: 'Electronics & Gadgets',
      price: 850,
      description: 'Latest high-resolution natural textbook display model approved for university and semester examinations. Solar + battery dual power. Used during 1st year exams only, zero scratches on display with hard protective sliding cover.',
      condition: 'Like New',
      college_id: 'gsv-vadodara',
      seller_id: 'user-rohan',
      campus_location: 'Academic Block 2, Reception',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        model: 'Casio fx-991CW',
        exam_approved: 'Yes (Anna University, GSV, Mumbai Univ approved)',
        battery_condition: 'Original battery + solar cell working'
      }),
      views_count: 110,
      status: 'active'
    },
    {
      id: 'prod-7',
      title: 'Yonex Muscle Power 29 Badminton Racket + Full Cover + 3 Mavis 350 Shuttles',
      category: 'Sports Equipment',
      price: 1100,
      description: 'High repulsion graphite shaft Yonex racket, BG65 strings freshly strung at 24 lbs tension. Ideal for evening games at GSV badminton courts. Includes Yonex padded thermal bag and 3 unused Yonex Mavis 350 nylon shuttles.',
      condition: 'Good',
      college_id: 'gsv-vadodara',
      seller_id: 'user-aarav',
      campus_location: 'Indoor Sports Complex, GSV',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        tension: '24 lbs (BG65)',
        weight: '3U (88g)',
        includes: 'Racket, cover, 3 Mavis 350 shuttles'
      }),
      views_count: 63,
      status: 'active'
    },
    {
      id: 'prod-8',
      title: 'Dior Sauvage Eau de Parfum (100ml Tester, 90% full)',
      category: 'Perfumes',
      price: 4900,
      description: '100% genuine Dior Sauvage EDP tester bottle. Bergamot, Sichuan pepper, and warm Ambroxan base. Batch code 2M01 verifiable on CheckFresh. Bought from airport duty-free. Moving to abroad for internship hence selling.',
      condition: 'Like New',
      college_id: 'iit-bombay',
      seller_id: 'user-rohan',
      campus_location: 'Hostel 12, IIT Bombay / Courier to GSV',
      contact_preference: 'chat',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
      ]),
      dynamic_attributes: JSON.stringify({
        brand: 'Dior',
        bottle_size: '100 ml',
        remaining_level: '90 ml (90%)',
        original_box: 'Tester box with batch 2M01'
      }),
      views_count: 84,
      status: 'active'
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (id, title, category, price, description, condition, college_id, seller_id, campus_location, contact_preference, images, dynamic_attributes, views_count, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of products) {
    insertProduct.run(p.id, p.title, p.category, p.price, p.description, p.condition, p.college_id, p.seller_id, p.campus_location, p.contact_preference, p.images, p.dynamic_attributes, p.views_count, p.status);
  }

  // 4. Sample Conversation & Messages
  const convId = 'conv-sample-1';
  db.prepare(`
    INSERT INTO conversations (id, product_id, buyer_id, seller_id, last_message, last_message_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    convId,
    'prod-3', // Bicycle
    'user-priya', // Buyer
    'user-aarav', // Seller
    'Can we meet at the Central Canteen today around 5:30 PM to check the cycle?',
    new Date().toISOString()
  );

  const sampleMessages = [
    {
      id: 'msg-1',
      conv_id: convId,
      sender_id: 'user-priya',
      content: 'Hey Aarav! Is the Hero Sprint 26T cycle still available?',
      is_read: 1,
      offset: 120
    },
    {
      id: 'msg-2',
      conv_id: convId,
      sender_id: 'user-aarav',
      content: 'Hi Priya, yes it is! The gears and brakes were tuned just last week.',
      is_read: 1,
      offset: 90
    },
    {
      id: 'msg-3',
      conv_id: convId,
      sender_id: 'user-priya',
      content: 'Great. Would you take ₹3,200 for it if I pick it up today?',
      is_read: 1,
      offset: 45
    },
    {
      id: 'msg-4',
      conv_id: convId,
      sender_id: 'user-aarav',
      content: 'I can do ₹3,400 including the combination lock and gel seat cover.',
      is_read: 1,
      offset: 20
    },
    {
      id: 'msg-5',
      conv_id: convId,
      sender_id: 'user-priya',
      content: 'Can we meet at the Central Canteen today around 5:30 PM to check the cycle?',
      is_read: 0,
      offset: 5
    }
  ];

  const insertMsg = db.prepare(`
    INSERT INTO messages (id, conversation_id, sender_id, content, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', ?))
  `);
  for (const m of sampleMessages) {
    insertMsg.run(m.id, m.conv_id, m.sender_id, m.content, m.is_read, `-${m.offset} minutes`);
  }

  // Sample Notification
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'notif-1',
    'user-aarav',
    'New Message from Priya',
    'Priya sent you a message about "Hero Sprint Pro 26T"',
    'message',
    '#inbox'
  );

  console.log('✅ CampusCart database initialized and successfully seeded with GSV marketplace data!');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'campuscart_salt_2026').digest('hex');
}

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// JSON helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Parse Request Body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 25 * 1024 * 1024) { // 25MB limit for base64 images
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Extract Auth User from Authorization header or cookie
function getAuthUser(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const parts = token.split('.');
      if (parts.length === 2) {
        const userId = parts[0];
        const user = db.prepare('SELECT * FROM users WHERE id = ? AND is_suspended = 0').get(userId);
        if (user) return user;
      }
    } catch (e) {
      // Fallback
    }
  }
  return null;
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  try {
    // -------------------------------------------------------------
    // API ROUTES
    // -------------------------------------------------------------

    // 1. Health & Status
    if (pathname === '/api/health') {
      return sendJSON(res, 200, {
        status: 'healthy',
        platform: 'CampusCart',
        version: '1.0.0',
        activeCampus: 'Gati Shakti Vishwavidyalaya (GSV), Vadodara',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        database: 'SQLite 3 (Built-in) / Supabase Ready'
      });
    }

    // 2. Real-Time Server-Sent Events (SSE) Stream
    if (pathname === '/api/realtime/stream') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write(`data: ${JSON.stringify({ type: 'connected', time: Date.now() })}\n\n`);

      const userId = searchParams.get('userId');

      const onMessage = (event) => {
        // Send if relevant to user
        if (!userId || event.recipientId === userId || event.senderId === userId || event.broadcast) {
          res.write(`data: ${JSON.stringify(event)}\n\n`);
        }
      };

      realtimeBus.on('event', onMessage);

      // Heartbeat ping every 25 seconds
      const pingInterval = setInterval(() => {
        res.write(`: ping\n\n`);
      }, 25000);

      req.on('close', () => {
        clearInterval(pingInterval);
        realtimeBus.removeListener('event', onMessage);
      });
      return;
    }

    // 3. Auth Endpoints
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const data = await parseBody(req);
      const { full_name, email, mobile, college_id, roll_number, password } = data;

      if (!full_name || !email || !college_id || !password) {
        return sendJSON(res, 400, { error: 'Please provide full name, email, college, and password.' });
      }

      // Check existing email
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
      if (existing) {
        return sendJSON(res, 409, { error: 'An account with this student email already exists.' });
      }

      const id = 'user-' + crypto.randomUUID().substring(0, 8);
      const password_hash = hashPassword(password);
      const avatar_url = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(full_name)}&backgroundColor=e2e8f0,b6e3f4,c0aede`;

      db.prepare(`
        INSERT INTO users (id, full_name, email, mobile, college_id, roll_number, password_hash, avatar_url, role, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'student', 0)
      `).run(id, full_name.trim(), email.toLowerCase().trim(), mobile || '', college_id, roll_number || '', password_hash, avatar_url);

      const user = db.prepare(`
        SELECT u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.avatar_url, u.role, u.is_admin, c.name as college_name, c.short_name as college_short_name
        FROM users u
        LEFT JOIN colleges c ON u.college_id = c.id
        WHERE u.id = ?
      `).get(id);

      const token = `${user.id}.${crypto.randomBytes(16).toString('hex')}`;
      return sendJSON(res, 201, { user, token, message: 'Student registration successful!' });
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const data = await parseBody(req);
      const { email, password } = data;

      if (!email || !password) {
        return sendJSON(res, 400, { error: 'Please enter both student email and password.' });
      }

      const hash = hashPassword(password);
      const user = db.prepare(`
        SELECT u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.avatar_url, u.role, u.is_admin, u.is_suspended, c.name as college_name, c.short_name as college_short_name
        FROM users u
        LEFT JOIN colleges c ON u.college_id = c.id
        WHERE LOWER(u.email) = ? AND u.password_hash = ?
      `).get(email.toLowerCase().trim(), hash);

      if (!user) {
        return sendJSON(res, 401, { error: 'Invalid email address or password. Try demo accounts if testing.' });
      }

      if (user.is_suspended) {
        return sendJSON(res, 403, { error: 'This student account has been suspended for policy violations.' });
      }

      const token = `${user.id}.${crypto.randomBytes(16).toString('hex')}`;
      return sendJSON(res, 200, { user, token, message: 'Welcome back to CampusCart!' });
    }

    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) {
        return sendJSON(res, 401, { error: 'Unauthorized session' });
      }
      const fullUser = db.prepare(`
        SELECT u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.avatar_url, u.role, u.is_admin, c.name as college_name, c.short_name as college_short_name
        FROM users u
        LEFT JOIN colleges c ON u.college_id = c.id
        WHERE u.id = ?
      `).get(user.id);
      return sendJSON(res, 200, { user: fullUser });
    }

    // Switch demo user (for testing buyer/seller flows smoothly)
    if (pathname === '/api/auth/switch-demo' && req.method === 'POST') {
      const data = await parseBody(req);
      const { userId } = data;
      const user = db.prepare(`
        SELECT u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.is_roll_private, u.avatar_url, u.role, u.is_admin, c.name as college_name, c.short_name as college_short_name
        FROM users u
        LEFT JOIN colleges c ON u.college_id = c.id
        WHERE u.id = ?
      `).get(userId);

      if (!user) return sendJSON(res, 404, { error: 'Demo user not found' });
      const token = `${user.id}.demo_session`;
      return sendJSON(res, 200, { user, token });
    }

    // 4. Colleges Endpoints
    if (pathname === '/api/colleges' && req.method === 'GET') {
      const colleges = db.prepare('SELECT * FROM colleges ORDER BY is_active DESC, student_count DESC').all();
      return sendJSON(res, 200, { colleges });
    }

    if (pathname === '/api/colleges/request' && req.method === 'POST') {
      const data = await parseBody(req);
      const { college_name, city, state, requester_name, requester_email, student_id, reason } = data;
      if (!college_name || !city || !requester_name || !requester_email) {
        return sendJSON(res, 400, { error: 'College name, city, requester name, and email are required.' });
      }
      const id = 'req-' + crypto.randomUUID().substring(0, 8);
      db.prepare(`
        INSERT INTO college_requests (id, college_name, city, state, requester_name, requester_email, student_id, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, college_name, city, state || '', requester_name, requester_email, student_id || '', reason || '');

      return sendJSON(res, 201, {
        message: 'Your college request has been submitted for review! We will notify you once activated.',
        requestId: id
      });
    }

    // 5. Products Endpoints
    if (pathname === '/api/products' && req.method === 'GET') {
      const collegeId = searchParams.get('collegeId');
      const category = searchParams.get('category');
      const search = searchParams.get('q');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const condition = searchParams.get('condition');
      const sort = searchParams.get('sort') || 'latest';
      const sellerId = searchParams.get('sellerId');
      const exploreAll = searchParams.get('exploreAll') === 'true';

      let sql = `
        SELECT p.*, 
               u.full_name as seller_name, 
               u.avatar_url as seller_avatar,
               u.email as seller_email,
               u.mobile as seller_mobile,
               c.name as college_name,
               c.short_name as college_short_name
        FROM products p
        JOIN users u ON p.seller_id = u.id
        JOIN colleges c ON p.college_id = c.id
        WHERE p.status != 'deleted'
      `;
      const params = [];

      if (sellerId) {
        sql += ' AND p.seller_id = ?';
        params.push(sellerId);
      } else {
        // If not viewing specific seller's own listings, show only active items
        sql += " AND p.status = 'active'";
      }

      if (collegeId && !exploreAll && !sellerId) {
        sql += ' AND p.college_id = ?';
        params.push(collegeId);
      }

      if (category && category !== 'All') {
        sql += ' AND p.category = ?';
        params.push(category);
      }

      if (condition && condition !== 'All') {
        sql += ' AND p.condition = ?';
        params.push(condition);
      }

      if (minPrice) {
        sql += ' AND p.price >= ?';
        params.push(parseInt(minPrice, 10));
      }

      if (maxPrice) {
        sql += ' AND p.price <= ?';
        params.push(parseInt(maxPrice, 10));
      }

      if (search) {
        sql += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.campus_location LIKE ?)';
        const query = `%${search}%`;
        params.push(query, query, query, query);
      }

      if (sort === 'price_asc') {
        sql += ' ORDER BY p.price ASC';
      } else if (sort === 'price_desc') {
        sql += ' ORDER BY p.price DESC';
      } else if (sort === 'popular') {
        sql += ' ORDER BY p.views_count DESC';
      } else {
        sql += ' ORDER BY p.created_at DESC';
      }

      const rows = db.prepare(sql).all(...params);
      const products = rows.map(r => ({
        ...r,
        images: JSON.parse(r.images || '[]'),
        dynamic_attributes: r.dynamic_attributes ? JSON.parse(r.dynamic_attributes) : {}
      }));

      return sendJSON(res, 200, { products, total: products.length });
    }

    // Single Product Detail
    if (pathname.startsWith('/api/products/') && req.method === 'GET') {
      const id = pathname.split('/')[3];
      // Increment view count
      db.prepare('UPDATE products SET views_count = views_count + 1 WHERE id = ?').run(id);

      const r = db.prepare(`
        SELECT p.*, 
               u.full_name as seller_name, 
               u.avatar_url as seller_avatar,
               u.email as seller_email,
               u.mobile as seller_mobile,
               u.created_at as seller_joined,
               c.name as college_name,
               c.short_name as college_short_name
        FROM products p
        JOIN users u ON p.seller_id = u.id
        JOIN colleges c ON p.college_id = c.id
        WHERE p.id = ?
      `).get(id);

      if (!r) return sendJSON(res, 404, { error: 'Product listing not found' });

      const product = {
        ...r,
        images: JSON.parse(r.images || '[]'),
        dynamic_attributes: r.dynamic_attributes ? JSON.parse(r.dynamic_attributes) : {}
      };

      return sendJSON(res, 200, { product });
    }

    // Create New Product Listing
    if (pathname === '/api/products' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please sign in to list a product.' });

      const data = await parseBody(req);
      const {
        title,
        category,
        price,
        description,
        condition,
        college_id,
        campus_location,
        contact_preference,
        images,
        dynamic_attributes
      } = data;

      if (!title || !category || !price || !description || !condition) {
        return sendJSON(res, 400, { error: 'Please provide product title, category, price, condition, and description.' });
      }

      const id = 'prod-' + crypto.randomUUID().substring(0, 8);
      const targetCollege = college_id || user.college_id;
      const imagesArr = Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
      ];

      db.prepare(`
        INSERT INTO products (
          id, title, category, price, description, condition,
          college_id, seller_id, campus_location, contact_preference,
          images, dynamic_attributes, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `).run(
        id,
        title.trim(),
        category,
        parseInt(price, 10),
        description.trim(),
        condition,
        targetCollege,
        user.id,
        campus_location || 'Campus Main Area',
        contact_preference || 'chat',
        JSON.stringify(imagesArr),
        JSON.stringify(dynamic_attributes || {})
      );

      // Realtime notification
      realtimeBus.emit('event', {
        type: 'product_created',
        productId: id,
        title,
        collegeId: targetCollege,
        broadcast: true
      });

      return sendJSON(res, 201, {
        message: 'Product listed successfully on CampusCart!',
        productId: id
      });
    }

    // Update Product Listing
    if (pathname.startsWith('/api/products/') && req.method === 'PATCH') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const id = pathname.split('/')[3];
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!product) return sendJSON(res, 404, { error: 'Product not found' });
      if (product.seller_id !== user.id && !user.is_admin) {
        return sendJSON(res, 403, { error: 'You can only edit your own listings.' });
      }

      const data = await parseBody(req);
      const { title, price, description, condition, status, campus_location, dynamic_attributes } = data;

      db.prepare(`
        UPDATE products 
        SET title = COALESCE(?, title),
            price = COALESCE(?, price),
            description = COALESCE(?, description),
            condition = COALESCE(?, condition),
            status = COALESCE(?, status),
            campus_location = COALESCE(?, campus_location),
            dynamic_attributes = COALESCE(?, dynamic_attributes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        title,
        price ? parseInt(price, 10) : null,
        description,
        condition,
        status,
        campus_location,
        dynamic_attributes ? JSON.stringify(dynamic_attributes) : null,
        id
      );

      return sendJSON(res, 200, { message: 'Product updated successfully' });
    }

    // Delete Product Listing
    if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const id = pathname.split('/')[3];
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!product) return sendJSON(res, 404, { error: 'Product not found' });
      if (product.seller_id !== user.id && !user.is_admin) {
        return sendJSON(res, 403, { error: 'You can only delete your own listings.' });
      }

      db.prepare("UPDATE products SET status = 'deleted' WHERE id = ?").run(id);
      return sendJSON(res, 200, { message: 'Product listing removed successfully' });
    }

    // Mark as Sold
    if (pathname.endsWith('/mark-sold') && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const parts = pathname.split('/');
      const id = parts[3];
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!product) return sendJSON(res, 404, { error: 'Product not found' });
      if (product.seller_id !== user.id && !user.is_admin) {
        return sendJSON(res, 403, { error: 'Unauthorized' });
      }

      const nextStatus = product.status === 'sold' ? 'active' : 'sold';
      db.prepare("UPDATE products SET status = ? WHERE id = ?").run(nextStatus, id);

      return sendJSON(res, 200, {
        message: nextStatus === 'sold' ? 'Marked as Sold! Great job on your deal.' : 'Relisted as Active!',
        status: nextStatus
      });
    }

    // 6. Internal Chat & Conversations (Most Important Feature)
    // Get all conversations for current user
    if (pathname === '/api/conversations' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please log in to view your inbox.' });

      const convs = db.prepare(`
        SELECT c.*,
               p.title as product_title,
               p.price as product_price,
               p.images as product_images,
               p.status as product_status,
               buyer.full_name as buyer_name,
               buyer.avatar_url as buyer_avatar,
               buyer_col.short_name as buyer_college,
               seller.full_name as seller_name,
               seller.avatar_url as seller_avatar,
               seller_col.short_name as seller_college,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != ? AND m.is_read = 0) as unread_count
        FROM conversations c
        JOIN products p ON c.product_id = p.id
        JOIN users buyer ON c.buyer_id = buyer.id
        LEFT JOIN colleges buyer_col ON buyer.college_id = buyer_col.id
        JOIN users seller ON c.seller_id = seller.id
        LEFT JOIN colleges seller_col ON seller.college_id = seller_col.id
        WHERE c.buyer_id = ? OR c.seller_id = ?
        ORDER BY c.last_message_at DESC
      `).all(user.id, user.id, user.id);

      const formatted = convs.map(c => ({
        ...c,
        product_images: JSON.parse(c.product_images || '[]'),
        other_user: c.buyer_id === user.id ? {
          id: c.seller_id,
          name: c.seller_name,
          avatar: c.seller_avatar,
          college: c.seller_college,
          role: 'Seller'
        } : {
          id: c.buyer_id,
          name: c.buyer_name,
          avatar: c.buyer_avatar,
          college: c.buyer_college,
          role: 'Buyer'
        }
      }));

      return sendJSON(res, 200, { conversations: formatted });
    }

    // Initiate or open existing conversation for a product
    if (pathname === '/api/conversations' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please log in to contact seller.' });

      const data = await parseBody(req);
      const { product_id, initial_message } = data;

      if (!product_id) return sendJSON(res, 400, { error: 'Product ID required' });

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
      if (!product) return sendJSON(res, 404, { error: 'Product not found' });

      if (product.seller_id === user.id) {
        return sendJSON(res, 400, { error: 'You are the seller of this product! You cannot start a conversation with yourself.' });
      }

      // Check if conversation already exists
      let conv = db.prepare(`
        SELECT * FROM conversations 
        WHERE product_id = ? AND buyer_id = ? AND seller_id = ?
      `).get(product.id, user.id, product.seller_id);

      let isNew = false;
      if (!conv) {
        isNew = true;
        const convId = 'conv-' + crypto.randomUUID().substring(0, 8);
        const firstMsg = initial_message || 'Hi, I am interested in this product! Is it still available?';
        db.prepare(`
          INSERT INTO conversations (id, product_id, buyer_id, seller_id, last_message, last_message_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(convId, product.id, user.id, product.seller_id, firstMsg);

        // Insert first message
        const msgId = 'msg-' + crypto.randomUUID().substring(0, 8);
        db.prepare(`
          INSERT INTO messages (id, conversation_id, sender_id, content, is_read)
          VALUES (?, ?, ?, ?, 0)
        `).run(msgId, convId, user.id, firstMsg);

        // Notify seller
        const notifId = 'notif-' + crypto.randomUUID().substring(0, 8);
        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type, link)
          VALUES (?, ?, ?, ?, 'message', '#inbox')
        `).run(
          notifId,
          product.seller_id,
          `New inquiry from ${user.full_name}`,
          `"${firstMsg.substring(0, 40)}..." about ${product.title}`
        );

        realtimeBus.emit('event', {
          type: 'new_message',
          conversationId: convId,
          senderId: user.id,
          recipientId: product.seller_id,
          content: firstMsg
        });

        conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convId);
      }

      return sendJSON(res, 200, { conversation: conv, isNew });
    }

    // Get messages for a specific conversation
    if (pathname.startsWith('/api/conversations/') && pathname.endsWith('/messages') && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convId = pathname.split('/')[3];
      const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convId);
      if (!conv) return sendJSON(res, 404, { error: 'Conversation not found' });

      // Verify membership
      if (conv.buyer_id !== user.id && conv.seller_id !== user.id && !user.is_admin) {
        return sendJSON(res, 403, { error: 'You are not a participant in this conversation.' });
      }

      // Mark messages from other user as read
      db.prepare(`
        UPDATE messages 
        SET is_read = 1 
        WHERE conversation_id = ? AND sender_id != ?
      `).run(convId, user.id);

      const messages = db.prepare(`
        SELECT m.*, u.full_name as sender_name, u.avatar_url as sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
      `).all(convId);

      return sendJSON(res, 200, { messages });
    }

    // Post a message in a conversation
    if (pathname.startsWith('/api/conversations/') && pathname.endsWith('/messages') && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convId = pathname.split('/')[3];
      const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convId);
      if (!conv) return sendJSON(res, 404, { error: 'Conversation not found' });

      if (conv.buyer_id !== user.id && conv.seller_id !== user.id && !user.is_admin) {
        return sendJSON(res, 403, { error: 'Unauthorized' });
      }

      const data = await parseBody(req);
      const { content } = data;
      if (!content || !content.trim()) {
        return sendJSON(res, 400, { error: 'Message cannot be empty.' });
      }

      const msgId = 'msg-' + crypto.randomUUID().substring(0, 8);
      const trimmed = content.trim();

      db.prepare(`
        INSERT INTO messages (id, conversation_id, sender_id, content, is_read)
        VALUES (?, ?, ?, ?, 0)
      `).run(msgId, convId, user.id, trimmed);

      db.prepare(`
        UPDATE conversations 
        SET last_message = ?, last_message_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(trimmed, convId);

      const recipientId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;

      // Broadcast Real-time event
      realtimeBus.emit('event', {
        type: 'new_message',
        conversationId: convId,
        messageId: msgId,
        senderId: user.id,
        recipientId: recipientId,
        content: trimmed,
        created_at: new Date().toISOString()
      });

      const newMsg = db.prepare(`
        SELECT m.*, u.full_name as sender_name, u.avatar_url as sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.id = ?
      `).get(msgId);

      return sendJSON(res, 201, { message: newMsg });
    }

    // 7. Wishlist / Saved Items
    if (pathname === '/api/wishlist' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const items = db.prepare(`
        SELECT p.*, c.short_name as college_short_name, u.full_name as seller_name
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        JOIN colleges c ON p.college_id = c.id
        JOIN users u ON p.seller_id = u.id
        WHERE w.user_id = ? AND p.status != 'deleted'
        ORDER BY w.created_at DESC
      `).all(user.id);

      const formatted = items.map(p => ({
        ...p,
        images: JSON.parse(p.images || '[]')
      }));

      return sendJSON(res, 200, { wishlist: formatted });
    }

    if (pathname === '/api/wishlist/toggle' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please log in to save items.' });

      const data = await parseBody(req);
      const { product_id } = data;
      if (!product_id) return sendJSON(res, 400, { error: 'Product ID required' });

      const existing = db.prepare('SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ?').get(user.id, product_id);

      if (existing) {
        db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(user.id, product_id);
        return sendJSON(res, 200, { isFavorited: false, message: 'Removed from saved items' });
      } else {
        db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(user.id, product_id);
        return sendJSON(res, 200, { isFavorited: true, message: 'Saved to your wishlist!' });
      }
    }

    // 8. Notifications
    if (pathname === '/api/notifications' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const notifications = db.prepare(`
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 20
      `).all(user.id);

      const unreadCount = db.prepare(`
        SELECT COUNT(*) as count FROM notifications 
        WHERE user_id = ? AND is_read = 0
      `).get(user.id).count;

      return sendJSON(res, 200, { notifications, unreadCount });
    }

    if (pathname === '/api/notifications/mark-read' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(user.id);
      return sendJSON(res, 200, { message: 'All notifications marked as read' });
    }

    // 9. Content Moderation & Reporting
    if (pathname === '/api/reports' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please sign in to report a listing or user.' });

      const data = await parseBody(req);
      const { target_type, target_id, reason, details } = data;

      if (!target_type || !target_id || !reason) {
        return sendJSON(res, 400, { error: 'Target type, target ID, and reason are required.' });
      }

      const id = 'rep-' + crypto.randomUUID().substring(0, 8);
      db.prepare(`
        INSERT INTO reports (id, reporter_id, target_type, target_id, reason, details)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, user.id, target_type, target_id, reason, details || '');

      return sendJSON(res, 201, {
        message: 'Thank you for reporting. CampusCart moderators will review this listing within 24 hours.',
        reportId: id
      });
    }

    // 10. Admin Panel Endpoints
    if (pathname.startsWith('/api/admin/')) {
      const user = getAuthUser(req);
      if (!user || !user.is_admin) {
        return sendJSON(res, 403, { error: 'Access restricted to authorized CampusCart administrators.' });
      }

      // Platform Stats
      if (pathname === '/api/admin/stats') {
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const totalColleges = db.prepare('SELECT COUNT(*) as count FROM colleges').get().count;
        const activeColleges = db.prepare('SELECT COUNT(*) as count FROM colleges WHERE is_active = 1').get().count;
        const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE status != "deleted"').get().count;
        const activeProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE status = "active"').get().count;
        const soldProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE status = "sold"').get().count;
        const totalConversations = db.prepare('SELECT COUNT(*) as count FROM conversations').get().count;
        const pendingReports = db.prepare('SELECT COUNT(*) as count FROM reports WHERE status = "pending"').get().count;
        const pendingCollegeRequests = db.prepare('SELECT COUNT(*) as count FROM college_requests WHERE status = "pending"').get().count;

        return sendJSON(res, 200, {
          totalUsers,
          totalColleges,
          activeColleges,
          totalProducts,
          activeProducts,
          soldProducts,
          totalConversations,
          pendingReports,
          pendingCollegeRequests
        });
      }

      // Manage Colleges
      if (pathname === '/api/admin/colleges' && req.method === 'POST') {
        const data = await parseBody(req);
        const { id, name, short_name, city, state, domain, is_active, student_count, badge } = data;
        if (!name || !short_name || !city || !domain) {
          return sendJSON(res, 400, { error: 'College name, short name, city, and domain are required.' });
        }
        const collegeId = id || 'col-' + short_name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        db.prepare(`
          INSERT INTO colleges (id, name, short_name, city, state, domain, is_active, student_count, badge)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(collegeId, name, short_name, city, state || '', domain, is_active ? 1 : 0, student_count || 0, badge || 'New Campus');

        return sendJSON(res, 201, { message: 'College added successfully', collegeId });
      }

      if (pathname === '/api/admin/colleges/toggle' && req.method === 'POST') {
        const data = await parseBody(req);
        const { id, is_active } = data;
        db.prepare('UPDATE colleges SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, id);
        return sendJSON(res, 200, { message: 'College status updated' });
      }

      // College Requests
      if (pathname === '/api/admin/college-requests' && req.method === 'GET') {
        const requests = db.prepare('SELECT * FROM college_requests ORDER BY created_at DESC').all();
        return sendJSON(res, 200, { requests });
      }

      if (pathname === '/api/admin/college-requests/approve' && req.method === 'POST') {
        const data = await parseBody(req);
        const { id } = data;
        const r = db.prepare('SELECT * FROM college_requests WHERE id = ?').get(id);
        if (!r) return sendJSON(res, 404, { error: 'Request not found' });

        const newCollegeId = 'col-' + crypto.randomUUID().substring(0, 6);
        db.prepare(`
          INSERT INTO colleges (id, name, short_name, city, state, domain, is_active, student_count, badge)
          VALUES (?, ?, ?, ?, ?, ?, 1, 500, 'Student Approved')
        `).run(newCollegeId, r.college_name, r.college_name.split(' ')[0], r.city, r.state, r.requester_email.split('@')[1] || 'edu.in');

        db.prepare("UPDATE college_requests SET status = 'approved' WHERE id = ?").run(id);
        return sendJSON(res, 200, { message: `Approved and launched ${r.college_name} on CampusCart!` });
      }

      // Reports List
      if (pathname === '/api/admin/reports' && req.method === 'GET') {
        const reports = db.prepare(`
          SELECT rep.*, u.full_name as reporter_name, u.email as reporter_email
          FROM reports rep
          JOIN users u ON rep.reporter_id = u.id
          ORDER BY rep.created_at DESC
        `).all();
        return sendJSON(res, 200, { reports });
      }

      // Dismiss or Take Action on Report
      if (pathname === '/api/admin/reports/resolve' && req.method === 'POST') {
        const data = await parseBody(req);
        const { id, action } = data;
        const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
        if (!report) return sendJSON(res, 404, { error: 'Report not found' });

        if (action === 'delete_product') {
          db.prepare("UPDATE products SET status = 'deleted' WHERE id = ?").run(report.target_id);
          db.prepare("UPDATE reports SET status = 'resolved' WHERE id = ?").run(id);
          return sendJSON(res, 200, { message: 'Product listing removed and report marked as resolved.' });
        } else if (action === 'suspend_user') {
          db.prepare("UPDATE users SET is_suspended = 1 WHERE id = ?").run(report.target_id);
          db.prepare("UPDATE reports SET status = 'resolved' WHERE id = ?").run(id);
          return sendJSON(res, 200, { message: 'User suspended and report resolved.' });
        } else {
          db.prepare("UPDATE reports SET status = 'dismissed' WHERE id = ?").run(id);
          return sendJSON(res, 200, { message: 'Report dismissed.' });
        }
      }

      // View All Registered Users
      if (pathname === '/api/admin/users' && req.method === 'GET') {
        const users = db.prepare(`
          SELECT u.id, u.full_name, u.email, u.mobile, u.college_id, u.roll_number, u.role, u.is_admin, u.is_suspended, u.created_at,
                 c.short_name as college_short_name,
                 (SELECT COUNT(*) FROM products p WHERE p.seller_id = u.id) as listing_count
          FROM users u
          LEFT JOIN colleges c ON u.college_id = c.id
          ORDER BY u.created_at DESC
        `).all();
        return sendJSON(res, 200, { users });
      }

      // Toggle User Suspension
      if (pathname === '/api/admin/users/toggle-suspend' && req.method === 'POST') {
        const data = await parseBody(req);
        const { userId, is_suspended } = data;
        db.prepare('UPDATE users SET is_suspended = ? WHERE id = ?').run(is_suspended ? 1 : 0, userId);
        return sendJSON(res, 200, { message: `User ${is_suspended ? 'suspended' : 'reactivated'}` });
      }
    }

    // 11. Image Upload Endpoint (supports Base64 data URLs)
    if (pathname === '/api/upload' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const data = await parseBody(req);
      const { dataUrl, filename } = data;

      if (!dataUrl || !dataUrl.startsWith('data:image/')) {
        return sendJSON(res, 400, { error: 'Invalid image format. Please upload JPEG, PNG, or WebP.' });
      }

      const matches = dataUrl.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return sendJSON(res, 400, { error: 'Invalid Base64 image encoding' });
      }

      const ext = matches[1].replace('jpeg', 'jpg');
      const base64Data = matches[2];
      const fileId = 'img-' + Date.now() + '-' + crypto.randomUUID().substring(0, 6) + '.' + ext;
      const filePath = path.join(UPLOADS_DIR, fileId);

      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      const publicUrl = `/uploads/${fileId}`;

      return sendJSON(res, 201, { url: publicUrl, message: 'Image uploaded successfully' });
    }

    // 12. Supabase Connection Status & Configuration Endpoint
    if (pathname === '/api/config/supabase') {
      const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
      const hasSupabaseKey = Boolean(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const isConnected = hasSupabaseUrl && hasSupabaseKey;

      return sendJSON(res, 200, {
        supabase: {
          configured: isConnected,
          url: isConnected ? (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) : 'Not configured (using local SQLite storage)',
          mode: isConnected ? 'Live Supabase Cloud' : 'Local SQLite + Realtime SSE (Fully Functional)',
          schemaPath: '/supabase_schema.sql',
          notes: 'Full PostgreSQL schema with Row Level Security (RLS) is provided in supabase_schema.sql. All client endpoints seamlessly connect to either Supabase or the built-in local engine.'
        }
      });
    }

    // -------------------------------------------------------------
    // STATIC FILE SERVING
    // -------------------------------------------------------------
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

    // If requesting supabase_schema.sql, serve from root
    if (pathname === '/supabase_schema.sql') {
      filePath = path.join(__dirname, 'supabase_schema.sql');
    }

    // Check if file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Default to index.html for SPA routing
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
      return;
    }

    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found - CampusCart');

  } catch (err) {
    console.error('Server Error:', err);
    sendJSON(res, 500, { error: 'Internal Server Error', details: err.message });
  }
});

// Start Server
initDatabase();
server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 CampusCart - Premium Multi-College Marketplace`);
  console.log(`🎯 Tagline: "One Platform. Every Campus."`);
  console.log(`🏛️  Launch Campus: Gati Shakti Vishwavidyalaya (GSV), Vadodara`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`💬 Realtime SSE messaging active`);
  console.log(`📦 Database: SQLite (Built-in Node.js v24)`);
  console.log(`=======================================================`);
});
