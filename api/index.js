/**
 * CampusCart - Vercel Serverless API Handler
 * "One Platform. Every Campus."
 * 
 * Works seamlessly on Vercel Serverless Functions with zero external dependencies.
 */

const crypto = require('node:crypto');
const EventEmitter = require('node:events');

const realtimeBus = new EventEmitter();
realtimeBus.setMaxListeners(100);

// Connected SSE clients for real-time notification streaming
const sseClients = new Map();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'campuscart_salt_2026').digest('hex');
}

// In-Memory Database Store (Ultra-fast, zero-dependency, crash-proof on Vercel)
const DB = {
  colleges: [
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
  ],

  users: [
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
      password_hash: hashPassword('student123'),
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
      password_hash: hashPassword('student123'),
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
      password_hash: hashPassword('student123'),
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
      password_hash: hashPassword('admin123'),
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      role: 'admin',
      is_admin: 1,
      is_suspended: 0
    }
  ],

  products: [
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
        pnr_status: 'Confirmed (B3-42 Lower)'
      },
      views_count: 89,
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
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
        fragrance_type: 'Eau de Parfum'
      },
      views_count: 142,
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
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
        accessories: 'Heavy Duty Wire Lock'
      },
      views_count: 215,
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
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
        subject: 'Engineering Math & Railway Engineering'
      },
      views_count: 98,
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 20).toISOString()
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
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80'
      ],
      dynamic_attributes: {
        wattage: '1500W Kettle / 1000W Rod',
        brand: 'Bajaj'
      },
      views_count: 174,
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
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
        exam_approved: 'Yes'
      },
      views_count: 110,
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 30).toISOString()
    }
  ],

  conversations: [
    {
      id: 'conv-sample-1',
      product_id: 'prod-3',
      buyer_id: 'user-priya',
      seller_id: 'user-aarav',
      last_message: 'Can we meet at the Central Canteen today around 5:30 PM to check the cycle?',
      last_message_at: new Date().toISOString()
    }
  ],

  messages: [
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
  ],

  wishlist: [],
  college_requests: [],
  reports: [],
  notifications: [
    {
      id: 'notif-1',
      type: 'upload',
      title: 'New GSV Listing Live',
      message: 'Aarav Sharma listed "Hero Sprint Pro 26T 21-Speed Gear Bicycle + Lock" in Hostel Cycle Parking, GSV (₹3,600)',
      productId: 'prod-3',
      productTitle: 'Hero Sprint Pro 26T 21-Speed Gear Bicycle + Lock',
      productPrice: 3600,
      category: 'Cycles',
      campus_location: 'Hostel Cycle Parking, GSV',
      seller_name: 'Aarav Sharma',
      seller_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      is_read: 0,
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'notif-2',
      type: 'upload',
      title: 'New GSV Listing Live',
      message: 'Priya Patel listed "Higher Engineering Mathematics (B.S. Grewal 44th Edition)" in Central Library, GSV (₹550)',
      productId: 'prod-4',
      productTitle: 'Higher Engineering Mathematics (B.S. Grewal 44th Edition)',
      productPrice: 550,
      category: 'Books & Study Materials',
      campus_location: 'Central Library, GSV',
      seller_name: 'Priya Patel',
      seller_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      is_read: 0,
      created_at: new Date(Date.now() - 5400000).toISOString()
    }
  ]
};

// JSON response helper
function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
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
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring(7);
    const userId = token.split('.')[0];
    return DB.users.find(u => u.id === userId && !u.is_suspended) || null;
  }
  return null;
}

// Master Serverless Request Handler
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

    const parsedUrl = new URL(req.url, `https://${req.headers.host || 'campuscart.vercel.app'}`);
  const searchParams = parsedUrl.searchParams;
  let rawPath = searchParams.get('api_path') || req.headers['x-matched-path'] || parsedUrl.pathname;
  if (rawPath === 'index.js' || rawPath === '/index.js' || rawPath === '/api/index.js') {
    rawPath = 'colleges';
  }
  if (rawPath.startsWith('/api/')) rawPath = rawPath.substring(5);
  else if (rawPath.startsWith('/api')) rawPath = rawPath.substring(4);
  else if (rawPath.startsWith('/')) rawPath = rawPath.substring(1);
  const pathname = '/api/' + rawPath;

  try {
    // 1. Health
    if (pathname === '/api/health') {
      return sendJSON(res, 200, {
        status: 'healthy',
        platform: 'CampusCart',
        version: '1.0.0',
        activeCampus: 'Gati Shakti Vishwavidyalaya (GSV), Vadodara',
        timestamp: new Date().toISOString(),
        environment: 'Vercel Serverless Production'
      });
    }

    // 2. Colleges
    if (pathname === '/api/colleges' && req.method === 'GET') {
      return sendJSON(res, 200, { colleges: DB.colleges });
    }

    if (pathname === '/api/colleges/request' && req.method === 'POST') {
      const data = await parseBody(req);
      const reqId = 'req-' + crypto.randomUUID().substring(0, 8);
      DB.college_requests.push({
        id: reqId,
        ...data,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      return sendJSON(res, 201, {
        message: 'Your college request has been submitted for review! We will notify you once activated.',
        requestId: reqId
      });
    }

    // 3. Auth
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const data = await parseBody(req);
      const hash = hashPassword(data.password || '');
      const user = DB.users.find(u => u.email.toLowerCase() === (data.email || '').toLowerCase().trim() && u.password_hash === hash);

      if (!user) {
        return sendJSON(res, 401, { error: 'Invalid email or password. Use demo buttons for testing.' });
      }

      const college = DB.colleges.find(c => c.id === user.college_id);
      const fullUser = {
        ...user,
        college_name: college ? college.name : 'GSV Vadodara',
        college_short_name: college ? college.short_name : 'GSV Vadodara'
      };

      const token = `${user.id}.${crypto.randomBytes(16).toString('hex')}`;
      return sendJSON(res, 200, { user: fullUser, token });
    }

    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const data = await parseBody(req);
      const { full_name, email, mobile, college_id, roll_number, password } = data;
      if (!full_name || !email || !college_id || !password) {
        return sendJSON(res, 400, { error: 'Please provide full name, email, college, and password.' });
      }

      const id = 'user-' + crypto.randomUUID().substring(0, 8);
      const newUser = {
        id,
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        mobile: mobile || '',
        college_id,
        roll_number: roll_number || '',
        is_roll_private: 1,
        password_hash: hashPassword(password),
        avatar_url: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(full_name)}&backgroundColor=e2e8f0,b6e3f4`,
        role: 'student',
        is_admin: 0,
        is_suspended: 0
      };
      DB.users.push(newUser);

      const college = DB.colleges.find(c => c.id === college_id);
      const fullUser = {
        ...newUser,
        college_name: college ? college.name : 'GSV Vadodara',
        college_short_name: college ? college.short_name : 'GSV Vadodara'
      };

      const token = `${newUser.id}.${crypto.randomBytes(16).toString('hex')}`;
      return sendJSON(res, 201, { user: fullUser, token, message: 'Registration successful!' });
    }

    if (pathname === '/api/auth/switch-demo' && req.method === 'POST') {
      const data = await parseBody(req);
      const user = DB.users.find(u => u.id === data.userId);
      if (!user) return sendJSON(res, 404, { error: 'Demo user not found' });

      const college = DB.colleges.find(c => c.id === user.college_id);
      const fullUser = {
        ...user,
        college_name: college ? college.name : 'GSV Vadodara',
        college_short_name: college ? college.short_name : 'GSV Vadodara'
      };

      const token = `${user.id}.demo_session`;
      return sendJSON(res, 200, { user: fullUser, token });
    }

    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });
      const college = DB.colleges.find(c => c.id === user.college_id);
      return sendJSON(res, 200, {
        user: {
          ...user,
          college_name: college ? college.name : 'GSV',
          college_short_name: college ? college.short_name : 'GSV'
        }
      });
    }

    // 4. Products
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

      let list = DB.products.filter(p => p.status !== 'deleted');

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

      if (minPrice) {
        list = list.filter(p => p.price >= parseInt(minPrice, 10));
      }

      if (maxPrice) {
        list = list.filter(p => p.price <= parseInt(maxPrice, 10));
      }

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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

      const formatted = list.map(p => {
        const seller = DB.users.find(u => u.id === p.seller_id) || {};
        const col = DB.colleges.find(c => c.id === p.college_id) || {};
        return {
          ...p,
          seller_name: seller.full_name || 'Student Seller',
          seller_avatar: seller.avatar_url || '',
          college_name: col.name || 'GSV Vadodara',
          college_short_name: col.short_name || 'GSV Vadodara'
        };
      });

      return sendJSON(res, 200, { products: formatted, total: formatted.length });
    }

    if (pathname.startsWith('/api/products/') && req.method === 'GET') {
      const id = pathname.split('/')[3];
      const p = DB.products.find(x => x.id === id);
      if (!p) return sendJSON(res, 404, { error: 'Product not found' });

      p.views_count = (p.views_count || 0) + 1;
      const seller = DB.users.find(u => u.id === p.seller_id) || {};
      const col = DB.colleges.find(c => c.id === p.college_id) || {};

      return sendJSON(res, 200, {
        product: {
          ...p,
          seller_name: seller.full_name,
          seller_avatar: seller.avatar_url,
          college_name: col.name,
          college_short_name: col.short_name
        }
      });
    }

    if (pathname === '/api/products' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please sign in to list products' });

      const data = await parseBody(req);
      const newProd = {
        id: 'prod-' + crypto.randomUUID().substring(0, 8),
        title: data.title,
        category: data.category,
        price: parseInt(data.price, 10),
        description: data.description,
        condition: data.condition,
        college_id: data.college_id || user.college_id,
        seller_id: user.id,
        campus_location: data.campus_location || 'Campus',
        contact_preference: data.contact_preference || 'chat',
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'
        ],
        dynamic_attributes: data.dynamic_attributes || {},
        views_count: 1,
        status: 'active',
        created_at: new Date().toISOString()
      };

      DB.products.unshift(newProd);

      // Create persistent Real-Time Upload Notification
      const newNotif = {
        id: 'notif-' + crypto.randomUUID().substring(0, 8),
        type: 'upload',
        title: 'New GSV Listing Live',
        message: `${user.full_name} listed "${newProd.title}" in ${newProd.campus_location} (₹${newProd.price})`,
        productId: newProd.id,
        productTitle: newProd.title,
        productPrice: newProd.price,
        category: newProd.category,
        campus_location: newProd.campus_location,
        seller_name: user.full_name,
        seller_avatar: user.avatar_url,
        seller_id: user.id,
        is_read: 0,
        created_at: new Date().toISOString()
      };
      DB.notifications.unshift(newNotif);

      // Broadcast immediately to all connected SSE browser clients
      const ssePayload = JSON.stringify({
        type: 'NEW_UPLOAD',
        notification: newNotif
      });
      for (const [clientId, clientRes] of sseClients.entries()) {
        try {
          clientRes.write(`data: ${ssePayload}\n\n`);
        } catch (e) {
          sseClients.delete(clientId);
        }
      }

      return sendJSON(res, 201, {
        message: 'Product listed successfully and broadcast to campus!',
        productId: newProd.id,
        notification: newNotif
      });
    }

    // 5. Conversations & Real-Time Chat
    if (pathname === '/api/conversations' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convs = DB.conversations.filter(c => c.buyer_id === user.id || c.seller_id === user.id);
      const formatted = convs.map(c => {
        const prod = DB.products.find(p => p.id === c.product_id) || {};
        const isBuyer = c.buyer_id === user.id;
        const otherId = isBuyer ? c.seller_id : c.buyer_id;
        const otherUser = DB.users.find(u => u.id === otherId) || {};
        const otherCollege = DB.colleges.find(col => col.id === otherUser.college_id) || {};
        const unread = DB.messages.filter(m => m.conversation_id === c.id && m.sender_id !== user.id && !m.is_read).length;

        return {
          ...c,
          product_title: prod.title || 'Product',
          product_price: prod.price || 0,
          product_images: prod.images || [],
          product_status: prod.status || 'active',
          unread_count: unread,
          other_user: {
            id: otherUser.id,
            name: otherUser.full_name || 'Student',
            avatar: otherUser.avatar_url || '',
            college: otherCollege.short_name || 'GSV'
          }
        };
      });

      return sendJSON(res, 200, { conversations: formatted });
    }

    if (pathname === '/api/conversations' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Please sign in to chat' });

      const data = await parseBody(req);
      const prod = DB.products.find(p => p.id === data.product_id);
      if (!prod) return sendJSON(res, 404, { error: 'Product not found' });

      let conv = DB.conversations.find(c => c.product_id === prod.id && c.buyer_id === user.id && c.seller_id === prod.seller_id);
      let isNew = false;

      if (!conv) {
        isNew = true;
        const convId = 'conv-' + crypto.randomUUID().substring(0, 8);
        const initialMsg = data.initial_message || 'Hi! Is this still available?';
        conv = {
          id: convId,
          product_id: prod.id,
          buyer_id: user.id,
          seller_id: prod.seller_id,
          last_message: initialMsg,
          last_message_at: new Date().toISOString()
        };
        DB.conversations.push(conv);

        DB.messages.push({
          id: 'msg-' + crypto.randomUUID().substring(0, 8),
          conversation_id: convId,
          sender_id: user.id,
          content: initialMsg,
          is_read: 0,
          created_at: new Date().toISOString()
        });
      }

      return sendJSON(res, 200, { conversation: conv, isNew });
    }

    if (pathname.startsWith('/api/conversations/') && pathname.endsWith('/messages') && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convId = pathname.split('/')[3];
      // Mark as read
      DB.messages.filter(m => m.conversation_id === convId && m.sender_id !== user.id).forEach(m => m.is_read = 1);
      const msgs = DB.messages.filter(m => m.conversation_id === convId);

      return sendJSON(res, 200, { messages: msgs });
    }

    if (pathname.startsWith('/api/conversations/') && pathname.endsWith('/messages') && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const convId = pathname.split('/')[3];
      const data = await parseBody(req);
      const newMsg = {
        id: 'msg-' + crypto.randomUUID().substring(0, 8),
        conversation_id: convId,
        sender_id: user.id,
        content: data.content.trim(),
        is_read: 0,
        created_at: new Date().toISOString()
      };
      DB.messages.push(newMsg);

      const conv = DB.conversations.find(c => c.id === convId);
      if (conv) {
        conv.last_message = data.content.trim();
        conv.last_message_at = new Date().toISOString();
      }

      return sendJSON(res, 201, { message: newMsg });
    }

    // 6. Wishlist
    if (pathname === '/api/wishlist' && req.method === 'GET') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const itemIds = DB.wishlist.filter(w => w.user_id === user.id).map(w => w.product_id);
      const items = DB.products.filter(p => itemIds.includes(p.id));
      return sendJSON(res, 200, { wishlist: items });
    }

    if (pathname === '/api/wishlist/toggle' && req.method === 'POST') {
      const user = getAuthUser(req);
      if (!user) return sendJSON(res, 401, { error: 'Unauthorized' });

      const data = await parseBody(req);
      const idx = DB.wishlist.findIndex(w => w.user_id === user.id && w.product_id === data.product_id);

      if (idx !== -1) {
        DB.wishlist.splice(idx, 1);
        return sendJSON(res, 200, { isFavorited: false, message: 'Removed from wishlist' });
      } else {
        DB.wishlist.push({ user_id: user.id, product_id: data.product_id });
        return sendJSON(res, 200, { isFavorited: true, message: 'Saved to wishlist!' });
      }
    }

    // 7. Notifications & Real-Time SSE Stream
    if (pathname === '/api/notifications/stream' && req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write(': connected\n\n');

      const clientId = crypto.randomUUID();
      sseClients.set(clientId, res);

      const heartbeat = setInterval(() => {
        try {
          res.write(': heartbeat\n\n');
        } catch (e) {
          clearInterval(heartbeat);
          sseClients.delete(clientId);
        }
      }, 25000);

      req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(clientId);
      });
      return;
    }

    if (pathname === '/api/notifications' && req.method === 'GET') {
      const unreadCount = DB.notifications.filter(n => !n.is_read).length;
      return sendJSON(res, 200, {
        notifications: DB.notifications,
        unreadCount
      });
    }

    if (pathname.startsWith('/api/notifications/') && pathname.endsWith('/read') && req.method === 'POST') {
      const parts = pathname.split('/');
      const notifId = parts[3];
      const notif = DB.notifications.find(n => n.id === notifId);
      if (notif) notif.is_read = 1;
      const unreadCount = DB.notifications.filter(n => !n.is_read).length;
      return sendJSON(res, 200, { success: true, unreadCount });
    }

    if (pathname === '/api/notifications/read-all' && req.method === 'POST') {
      DB.notifications.forEach(n => { n.is_read = 1; });
      return sendJSON(res, 200, { success: true, unreadCount: 0 });
    }

    // 8. Admin
    if (pathname === '/api/admin/stats') {
      return sendJSON(res, 200, {
        totalUsers: DB.users.length,
        totalColleges: DB.colleges.length,
        activeColleges: DB.colleges.filter(c => c.is_active).length,
        totalProducts: DB.products.length,
        activeProducts: DB.products.filter(p => p.status === 'active').length,
        soldProducts: DB.products.filter(p => p.status === 'sold').length,
        totalConversations: DB.conversations.length,
        pendingReports: DB.reports.length,
        pendingCollegeRequests: DB.college_requests.length
      });
    }

    if (pathname === '/api/admin/college-requests') {
      return sendJSON(res, 200, { requests: DB.college_requests });
    }

    if (pathname === '/api/admin/reports') {
      return sendJSON(res, 200, { reports: DB.reports });
    }

    if (pathname === '/api/admin/users') {
      return sendJSON(res, 200, { users: DB.users });
    }

    if (pathname === '/api/config/supabase') {
      return sendJSON(res, 200, {
        supabase: {
          configured: false,
          mode: 'Vercel Serverless Ready (Zero-Crash Guarantee)',
          notes: 'Full PostgreSQL schema available in /supabase_schema.sql'
        }
      });
    }

    // Default 404
    return sendJSON(res, 404, { error: 'API route not found: ' + pathname });

  } catch (err) {
    console.error('Serverless Error:', err);
    return sendJSON(res, 500, { error: 'Internal Server Error', details: err.message });
  }
};
