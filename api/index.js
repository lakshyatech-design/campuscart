/**
 * CampusCart - Vercel Serverless API Handler
 * Fully compatible with Vercel Serverless Functions (Node.js 18, 20, 22)
 * Zero external dependencies. Zero read-only filesystem crashes.
 */

const crypto = require('node:crypto');

// In-Memory Database Store for Vercel Serverless Execution
const COLLEGES = [
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

const USERS = [
  {
    id: 'user-aarav',
    full_name: 'Aarav Sharma',
    email: 'aarav.sharma@gsv.ac.in',
    mobile: '+91 98765 43210',
    college_id: 'gsv-vadodara',
    roll_number: 'GSV2023BTECH042',
    is_roll_private: 0,
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    is_admin: 0,
    is_suspended: 0
  },
  {
    id: 'user-priya',
    full_name: 'Priya Patel',
    email: 'priya.patel@gsv.ac.in',
    mobile: '+91 98251 23456',
    college_id: 'gsv-vadodara',
    roll_number: 'GSV2024MBA018',
    is_roll_private: 1,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    is_admin: 0,
    is_suspended: 0
  },
  {
    id: 'user-rohan',
    full_name: 'Rohan Mehta',
    email: 'rohan.mehta@gsv.ac.in',
    mobile: '+91 98980 98765',
    college_id: 'gsv-vadodara',
    roll_number: 'GSV2022BTECH105',
    is_roll_private: 0,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    is_admin: 0,
    is_suspended: 0
  },
  {
    id: 'user-ananya',
    full_name: 'Ananya Iyer',
    email: 'ananya.iyer@gsv.ac.in',
    mobile: '+91 97123 45678',
    college_id: 'gsv-vadodara',
    roll_number: 'GSV2023MTECH011',
    is_roll_private: 1,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    is_admin: 0,
    is_suspended: 0
  },
  {
    id: 'user-admin',
    full_name: 'CampusCart Admin (GSV Operations)',
    email: 'admin@campuscart.in',
    mobile: '+91 99000 11223',
    college_id: 'gsv-vadodara',
    roll_number: 'STAFF-ADM-01',
    is_roll_private: 0,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    is_admin: 1,
    is_suspended: 0
  }
];

let PRODUCTS = [
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
    images: [
      'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      journey_date: '2026-11-28',
      from_station: 'Vadodara Jn (BRC)',
      to_station: 'New Delhi (NDLS)',
      train_name_number: '12951 / Mumbai Central Rajdhani',
      ticket_type: '3AC (3rd AC Sleeper)',
      pnr_status: 'Confirmed (B3-42 Lower)',
      compliance_notice: 'Important: Indian Railways permits transfer of confirmed tickets to other bonafide students on written application by the recognized educational institution head 24h before train departure.'
    },
    views_count: 89,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      brand: 'Rasasi',
      bottle_size: '100 ml',
      remaining_level: '85 ml (85%)',
      original_box: 'Yes, original box with batch code included',
      fragrance_type: 'Eau de Parfum (Aquatic Fruity Woody)'
    },
    views_count: 142,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      brand: 'Hero Sprint Pro',
      gears: '21 Shimano Gears',
      brakes: 'Dual Disc',
      accessories: 'Heavy Duty Wire Lock, Mudguards, Water bottle cage'
    },
    views_count: 215,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      edition: '44th Edition',
      subject: 'Engineering Math & Railway Engineering',
      pages_condition: 'Clean, no highlighter marks'
    },
    views_count: 98,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      wattage: '1500W Kettle / 1000W Rod',
      brand: 'Bajaj',
      warranty_status: 'Out of warranty, fully functional'
    },
    views_count: 174,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      model: 'Casio fx-991CW',
      exam_approved: 'Yes (Anna University, GSV, Mumbai Univ approved)',
      battery_condition: 'Original battery + solar cell working'
    },
    views_count: 110,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 60).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      tension: '24 lbs (BG65)',
      weight: '3U (88g)',
      includes: 'Racket, cover, 3 Mavis 350 shuttles'
    },
    views_count: 63,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
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
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80'
    ],
    dynamic_attributes: {
      brand: 'Dior',
      bottle_size: '100 ml',
      remaining_level: '90 ml (90%)',
      original_box: 'Tester box with batch 2M01'
    },
    views_count: 84,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

let CONVERSATIONS = [
  {
    id: 'conv-sample-1',
    product_id: 'prod-3',
    buyer_id: 'user-priya',
    seller_id: 'user-aarav',
    last_message: 'Can we meet at the Central Canteen today around 5:30 PM to check the cycle?',
    last_message_at: new Date().toISOString()
  }
];

let MESSAGES = [
  {
    id: 'msg-1',
    conversation_id: 'conv-sample-1',
    sender_id: 'user-priya',
    content: 'Hey Aarav! Is the Hero Sprint 26T cycle still available?',
    is_read: 1,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-sample-1',
    sender_id: 'user-aarav',
    content: 'Hi Priya, yes it is! The gears and brakes were tuned just last week.',
    is_read: 1,
    created_at: new Date(Date.now() - 5400000).toISOString()
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-sample-1',
    sender_id: 'user-priya',
    content: 'Great. Would you take ₹3,200 for it if I pick it up today?',
    is_read: 1,
    created_at: new Date(Date.now() - 2700000).toISOString()
  },
  {
    id: 'msg-4',
    conversation_id: 'conv-sample-1',
    sender_id: 'user-aarav',
    content: 'I can do ₹3,400 including the combination lock and gel seat cover.',
    is_read: 1,
    created_at: new Date(Date.now() - 1200000).toISOString()
  },
  {
    id: 'msg-5',
    conversation_id: 'conv-sample-1',
    sender_id: 'user-priya',
    content: 'Can we meet at the Central Canteen today around 5:30 PM to check the cycle?',
    is_read: 0,
    created_at: new Date(Date.now() - 300000).toISOString()
  }
];

let WISHLIST = [];
let COLLEGE_REQUESTS = [];
let REPORTS = [];

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function getAuthUser(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const userId = token.split('.')[0];
    return USERS.find(u => u.id === userId && !u.is_suspended) || null;
  }
  return null;
}

module.exports = async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `https://${req.headers.host || 'campuscart.vercel.app'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  try {
    // 1. Health
    if (pathname === '/api/health') {
      return sendJSON(res, 200, {
        status: 'healthy',
        platform: 'CampusCart',
        version: '1.0.0',
        activeCampus: 'Gati Shakti Vishwavidyalaya (GSV), Vadodara',
        timestamp: new Date().toISOString(),
        environment: 'Vercel Serverless'
      });
    }

    // 2. Real-time stream fallback on serverless
    if (pathname === '/api/realtime/stream') {
      return sendJSON(res, 200, {
        message: 'Serverless Real-Time Event Stream Ready'
      });
    }

    // 3. Auth Endpoints
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const data = await parseBody(req);
      const { full_name, email, mobile, college_id, roll_number, password } = data;

      if (!full_name || !email || !college_id || !password) {
        return sendJSON(res, 400, { error: 'Please provide full name, email, college, and password.' });
      }

      const id = 'user-' + crypto.randomUUID().substring(0, 8);
      const col = COLLEGES.find(c => c.id === college_id) || COLLEGES[0];
      const newUser = {
        id,
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile || '',
        college_id,
        college_name: col.name,
        college_short_name: col.short_name,
        roll_number: roll_number || '',
        is_roll_private: 1,
        avatar_url: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(full_name)}&backgroundColor=e2e8f0,b6e3f4,c0aede`,
        role: 'student',
        is_admin: 0,
        is_suspended: 0
      };
      USERS.push(newUser);

      const token = `${newUser.id}.${crypto.randomBytes(16).toString('hex')}`;
      return sendJSON(res, 201, { user: newUser, token, message: 'Student registration successful!' });
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const data = await parseBody(req);
      const { email } = data;

      const user = USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
      if (!user) {
        return sendJSON(res, 401, { error: 'Invalid email address or password. Try demo accounts if testing.' });
      }

      const col = COLLEGES.find(c => c.id === user.college_id) || COLLEGES[0];
      const fullUser = { ...user, college_name: col.name, college_short_name: col.short_name };
      const token = `${user.id}.${crypto.randomBytes(16).toString('hex')}`;
      return sendJSON(res, 200, { user: fullUser, token, message: 'Welcome back to CampusCart!' });
    }

    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized session' });

      const col = COLLEGES.find(c => c.id === user.college_id) || COLLEGES[0];
      return sendJSON(res, 200, { user: { ...user, college_name: col.name, college_short_name: col.short_name } });
    }

    if (pathname === '/api/auth/switch-demo' && req.method === 'POST') {
      const data = await parseBody(req);
      const user = USERS.find(u => u.id === data.userId);
      if (!user) return sendJSON(res, 404, { error: 'Demo user not found' });

      const col = COLLEGES.find(c => c.id === user.college_id) || COLLEGES[0];
      const fullUser = { ...user, college_name: col.name, college_short_name: col.short_name };
      const token = `${user.id}.demo_session`;
      return sendJSON(res, 200, { user: fullUser, token });
    }

    // 4. Colleges Endpoints
    if (pathname === '/api/colleges' && req.method === 'GET') {
      return sendJSON(res, 200, { colleges: COLLEGES });
    }

    if (pathname === '/api/colleges/request' && req.method === 'POST') {
      const data = await parseBody(req);
      const id = 'req-' + crypto.randomUUID().substring(0, 8);
      COLLEGE_REQUESTS.push({ id, ...data, status: 'pending', created_at: new Date().toISOString() });
      return sendJSON(res, 201, { message: 'College request submitted successfully!', requestId: id });
    }

    // 5. Products Endpoints
    if (pathname === '/api/products' && req.method === 'GET') {
      const collegeId = searchParams.get('collegeId');
      const category = searchParams.get('category');
      const search = (searchParams.get('q') || '').toLowerCase();
      const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice'), 10) : null;
      const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice'), 10) : null;
      const condition = searchParams.get('condition');
      const sort = searchParams.get('sort') || 'latest';
      const sellerId = searchParams.get('sellerId');
      const exploreAll = searchParams.get('exploreAll') === 'true';

      let list = PRODUCTS.filter(p => p.status !== 'deleted');

      if (sellerId) {
        list = list.filter(p => p.seller_id === sellerId);
      } else {
        list = list.filter(p => p.status === 'active');
      }

      if (collegeId && !exploreAll && !sellerId) {
        list = list.filter(p => p.college_id === collegeId);
      }

      if (category && category !== 'All') {
        list = list.filter(p => p.category === category);
      }

      if (condition && condition !== 'All') {
        list = list.filter(p => p.condition === condition);
      }

      if (minPrice !== null) {
        list = list.filter(p => p.price >= minPrice);
      }

      if (maxPrice !== null) {
        list = list.filter(p => p.price <= maxPrice);
      }

      if (search) {
        list = list.filter(p => 
          p.title.toLowerCase().includes(search) || 
          p.description.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          (p.campus_location || '').toLowerCase().includes(search)
        );
      }

      if (sort === 'price_asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (sort === 'popular') {
        list.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
      } else {
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      const populated = list.map(p => {
        const seller = USERS.find(u => u.id === p.seller_id) || {};
        const col = COLLEGES.find(c => c.id === p.college_id) || {};
        return {
          ...p,
          seller_name: seller.full_name || 'Student',
          seller_avatar: seller.avatar_url || '',
          college_name: col.name || 'GSV',
          college_short_name: col.short_name || 'GSV'
        };
      });

      return sendJSON(res, 200, { products: populated, total: populated.length });
    }

    if (pathname.startsWith('/api/products/') && req.method === 'GET') {
      const id = pathname.split('/')[3];
      const p = PRODUCTS.find(item => item.id === id);
      if (!p) return sendJSON(res, 404, { error: 'Product listing not found' });

      p.views_count = (p.views_count || 0) + 1;
      const seller = USERS.find(u => u.id === p.seller_id) || {};
      const col = COLLEGES.find(c => c.id === p.college_id) || {};

      const populated = {
        ...p,
        seller_name: seller.full_name || 'Student',
        seller_avatar: seller.avatar_url || '',
        seller_email: seller.email || '',
        college_name: col.name || 'GSV',
        college_short_name: col.short_name || 'GSV'
      };

      return sendJSON(res, 200, { product: populated });
    }

    if (pathname === '/api/products' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please sign in to list a product.' });

      const data = await parseBody(req);
      const id = 'prod-' + crypto.randomUUID().substring(0, 8);
      const newProduct = {
        id,
        title: data.title,
        category: data.category,
        price: parseInt(data.price, 10),
        description: data.description,
        condition: data.condition,
        college_id: data.college_id || user.college_id,
        seller_id: user.id,
        campus_location: data.campus_location || 'Campus Main Area',
        contact_preference: data.contact_preference || 'chat',
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'
        ],
        dynamic_attributes: data.dynamic_attributes || {},
        status: 'active',
        views_count: 1,
        created_at: new Date().toISOString()
      };

      PRODUCTS.unshift(newProduct);
      return sendJSON(res, 201, { message: 'Product listed successfully!', productId: id });
    }

    if (pathname.endsWith('/mark-sold') && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const id = pathname.split('/')[3];
      const p = PRODUCTS.find(item => item.id === id);
      if (!p) return sendJSON(res, 404, { error: 'Product not found' });

      p.status = p.status === 'sold' ? 'active' : 'sold';
      return sendJSON(res, 200, {
        message: p.status === 'sold' ? 'Marked as Sold!' : 'Relisted as Active!',
        status: p.status
      });
    }

    // 6. Conversations & Messages
    if (pathname === '/api/conversations' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please log in to view inbox.' });

      const userConvs = CONVERSATIONS.filter(c => c.buyer_id === user.id || c.seller_id === user.id);
      const formatted = userConvs.map(c => {
        const prod = PRODUCTS.find(p => p.id === c.product_id) || {};
        const buyer = USERS.find(u => u.id === c.buyer_id) || {};
        const seller = USERS.find(u => u.id === c.seller_id) || {};
        const otherUser = c.buyer_id === user.id ? seller : buyer;
        const col = COLLEGES.find(col => col.id === otherUser.college_id) || {};

        return {
          ...c,
          product_title: prod.title || 'Product',
          product_price: prod.price || 0,
          product_images: prod.images || [],
          product_status: prod.status || 'active',
          unread_count: MESSAGES.filter(m => m.conversation_id === c.id && m.sender_id !== user.id && !m.is_read).length,
          other_user: {
            id: otherUser.id,
            name: otherUser.full_name,
            avatar: otherUser.avatar_url,
            college: col.short_name || 'GSV'
          }
        };
      });

      return sendJSON(res, 200, { conversations: formatted });
    }

    if (pathname === '/api/conversations' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please log in to contact seller.' });

      const data = await parseBody(req);
      const prod = PRODUCTS.find(p => p.id === data.product_id);
      if (!prod) return sendJSON(res, 404, { error: 'Product not found' });

      let conv = CONVERSATIONS.find(c => c.product_id === prod.id && c.buyer_id === user.id);
      if (!conv) {
        const convId = 'conv-' + crypto.randomUUID().substring(0, 8);
        const firstMsg = data.initial_message || 'Hi, I am interested in this product! Is it still available?';
        conv = {
          id: convId,
          product_id: prod.id,
          buyer_id: user.id,
          seller_id: prod.seller_id,
          last_message: firstMsg,
          last_message_at: new Date().toISOString()
        };
        CONVERSATIONS.unshift(conv);

        MESSAGES.push({
          id: 'msg-' + crypto.randomUUID().substring(0, 8),
          conversation_id: convId,
          sender_id: user.id,
          content: firstMsg,
          is_read: 0,
          created_at: new Date().toISOString()
        });
      }

      return sendJSON(res, 200, { conversation: conv });
    }

    if (pathname.startsWith('/api/conversations/') && pathname.endsWith('/messages') && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convId = pathname.split('/')[3];
      MESSAGES.forEach(m => {
        if (m.conversation_id === convId && m.sender_id !== user.id) m.is_read = 1;
      });

      const msgs = MESSAGES.filter(m => m.conversation_id === convId);
      return sendJSON(res, 200, { messages: msgs });
    }

    if (pathname.startsWith('/api/conversations/') && pathname.endsWith('/messages') && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convId = pathname.split('/')[3];
      const conv = CONVERSATIONS.find(c => c.id === convId);
      if (!conv) return sendJSON(res, 404, { error: 'Conversation not found' });

      const data = await parseBody(req);
      const newMsg = {
        id: 'msg-' + crypto.randomUUID().substring(0, 8),
        conversation_id: convId,
        sender_id: user.id,
        content: (data.content || '').trim(),
        is_read: 0,
        created_at: new Date().toISOString()
      };

      MESSAGES.push(newMsg);
      conv.last_message = newMsg.content;
      conv.last_message_at = newMsg.created_at;

      return sendJSON(res, 201, { message: newMsg });
    }

    // 7. Wishlist
    if (pathname === '/api/wishlist' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const userWishlist = WISHLIST.filter(w => w.user_id === user.id);
      const items = userWishlist.map(w => PRODUCTS.find(p => p.id === w.product_id)).filter(Boolean);
      return sendJSON(res, 200, { wishlist: items });
    }

    if (pathname === '/api/wishlist/toggle' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please log in to save items.' });

      const data = await parseBody(req);
      const idx = WISHLIST.findIndex(w => w.user_id === user.id && w.product_id === data.product_id);
      if (idx !== -1) {
        WISHLIST.splice(idx, 1);
        return sendJSON(res, 200, { isFavorited: false, message: 'Removed from saved items' });
      } else {
        WISHLIST.push({ user_id: user.id, product_id: data.product_id });
        return sendJSON(res, 200, { isFavorited: true, message: 'Saved to your wishlist!' });
      }
    }

    // 8. Admin & Config
    if (pathname === '/api/admin/stats') {
      return sendJSON(res, 200, {
        totalUsers: USERS.length,
        totalColleges: COLLEGES.length,
        activeColleges: COLLEGES.filter(c => c.is_active).length,
        totalProducts: PRODUCTS.filter(p => p.status !== 'deleted').length,
        activeProducts: PRODUCTS.filter(p => p.status === 'active').length,
        soldProducts: PRODUCTS.filter(p => p.status === 'sold').length,
        totalConversations: CONVERSATIONS.length,
        pendingReports: REPORTS.filter(r => r.status === 'pending').length,
        pendingCollegeRequests: COLLEGE_REQUESTS.filter(r => r.status === 'pending').length
      });
    }

    if (pathname === '/api/admin/colleges' && req.method === 'POST') {
      const data = await parseBody(req);
      const newCol = {
        id: 'col-' + crypto.randomUUID().substring(0, 6),
        name: data.name,
        short_name: data.short_name,
        city: data.city,
        state: data.state,
        domain: data.domain,
        is_active: 1,
        student_count: 500,
        badge: 'New Hub'
      };
      COLLEGES.push(newCol);
      return sendJSON(res, 201, { message: 'College added successfully!', collegeId: newCol.id });
    }

    if (pathname === '/api/admin/college-requests') {
      return sendJSON(res, 200, { requests: COLLEGE_REQUESTS });
    }

    if (pathname === '/api/admin/reports') {
      return sendJSON(res, 200, { reports: REPORTS });
    }

    if (pathname === '/api/admin/users') {
      return sendJSON(res, 200, { users: USERS });
    }

    if (pathname === '/api/reports' && req.method === 'POST') {
      const data = await parseBody(req);
      const id = 'rep-' + crypto.randomUUID().substring(0, 8);
      REPORTS.push({ id, ...data, status: 'pending', created_at: new Date().toISOString() });
      return sendJSON(res, 201, { message: 'Report submitted for moderation review.', reportId: id });
    }

    if (pathname === '/api/config/supabase') {
      return sendJSON(res, 200, {
        supabase: {
          configured: Boolean(process.env.SUPABASE_URL),
          url: process.env.SUPABASE_URL || 'Not configured',
          mode: 'Vercel Serverless Production'
        }
      });
    }

    // Default 404
    return sendJSON(res, 404, { error: 'Endpoint not found' });
  } catch (err) {
    console.error('API Error:', err);
    return sendJSON(res, 500, { error: 'Internal Server Error', message: err.message });
  }
};
