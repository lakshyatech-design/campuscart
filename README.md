# CampusCart – A Premium Multi-College Student Marketplace
> **"One Platform. Every Campus."**

Initially launching with **Gati Shakti Vishwavidyalaya (GSV), Vadodara, Gujarat**, built from day one as a pan-India multi-college marketplace platform.

---

## 🌟 Key Product Highlights & Architecture

1. **Design System & Aesthetics**
   - **Linear + Airbnb + OLX** design synthesis: Deep Navy (`#0F172A`), Electric Blue (`#2563EB`), Emerald Green (`#10B981`), rounded-2xl cards, subtle frosted glass blur, micro-interactions, responsive mobile layout.
   - Built with lightweight, zero-dependency SVG icon system and clean CSS variables.

2. **Multi-College System from Day 1**
   - GSV is the designated launch campus with verified student ID rules.
   - Expandable across India with built-in hubs (IIT Bombay, BITS Pilani, NIT Trichy, Delhi University, IIM Ahmedabad).
   - Dynamic **"Search College"**, **"Explore Other Campuses"** nationwide toggle, and **"Request to Add Your College"** workflow.
   - Admin can add, edit, approve, or disable colleges dynamically without code changes.

3. **Dual-Role Authentication**
   - Single student account works as **both Buyer and Seller**.
   - Fields: Full Name, College Name, Roll Number / Student ID, Mobile Number, College Email (`@gsv.ac.in`), Password.
   - Built-in one-click demo login buttons for instant testing (Aarav [Seller], Priya [Buyer], Rohan [Student], Admin).

4. **Internal Real-Time Messaging & Inbox (Most Important Feature)**
   - WhatsApp / OLX-inspired in-app messaging engine.
   - Instant real-time updates powered by **Server-Sent Events (SSE)** and broadcast event bus.
   - Persistent messages in database, conversation roster with unread badges, product context header, and quick offer buttons.
   - No phone number exposure or WhatsApp redirects by default.

5. **Dynamic Categories & Regulatory Compliance**
   - **Railway Tickets**: Dedicated fields (Journey Date, From Station, To Station, Train Name/Number, Class) + Clear Indian Railways passenger transfer compliance notice and agreement.
   - **Perfumes**: Dynamic fields (Brand, Bottle Size, Remaining Level, Box/Batch code).
   - **Textbooks, Cycles, Electronics, Hostel Essentials, Sports, Fashion, Accessories**.

6. **Seller Dashboard & Management**
   - Live metrics: Active listings, sold items, total views, inquiries.
   - Add new products with multi-photo upload and instant preview.
   - Edit listings, delete listings, mark as sold with one click.

7. **Admin Control Center**
   - Platform metrics overview (Users, Colleges, Active Listings, Sold Items, Conversations).
   - College management & student expansion requests approval.
   - Content moderation & reported listings review with one-click resolution.
   - Registered student user management with suspension toggles.

8. **Database & Supabase Integration**
   - Built on Node.js v24 native SQLite engine (`node:sqlite`) for 100% out-of-the-box offline reliability.
   - Includes production **`supabase_schema.sql`** with tables, foreign keys, triggers, and Row Level Security (RLS) policies for direct migration to Supabase PostgreSQL cloud.

---

## 🚀 How to Run the Application

### 1. Start the Server
Run the Node.js server inside the `campuscart` folder:
```powershell
cd C:\Users\dsuid\.gemini\antigravity\scratch\campuscart
node server.js
```

The server starts at **`http://localhost:3000`** and initializes the database with verified seed data for GSV.

### 2. Open in Browser
Visit **`http://localhost:3000`** in your browser.

---

## 🧪 Testing the Core Features

1. **Test College Switching:**
   - Click the college badge in the navbar (defaults to *GSV Vadodara*).
   - Switch to *IIT Bombay* or *BITS Pilani*, or click *"Request to Add Your College"*.
   - Toggle *"Explore Listings From All Campuses"* to view cross-campus items.

2. **Test Real-Time Chat (Buyer & Seller):**
   - Click **Login** and select **"👤 Aarav (GSV Seller)"**. Check his listings in *"My Dashboard"*.
   - In another browser tab or window, switch demo user to **"👩 Priya (GSV Buyer)"**.
   - Browse the bicycle or textbooks, click **"Chat"** or **"Contact Seller"**.
   - Send messages or quick offer chips (e.g., *"Can we meet at Central Canteen today at 5:30 PM?"*). Notice instantaneous message delivery in both tabs via the SSE stream!

3. **Test Listing a New Product:**
   - Click **"Sell an Item"**.
   - Choose **"Railway Tickets"** or **"Perfumes"** to see dynamic conditional form fields appear automatically.
   - Select photos or click the quick presets, enter price and campus pickup point, and click **"Publish to Marketplace"**.

4. **Test Content Moderation & Admin:**
   - Click on any product and choose *"Report suspicious or prohibited listing"*.
   - Log in as **"🛡️ Admin Account"** (or switch to admin view) to inspect the report, resolve it, approve college requests, and view platform metrics.

---

## 📁 Project Structure

```
campuscart/
├── data/
│   └── campuscart.db          # Persistent SQLite database
├── public/
│   ├── css/
│   │   └── app.css            # Design system (OLX + Airbnb + Linear)
│   ├── js/
│   │   ├── icons.js           # Lightweight SVG icon library
│   │   ├── api.js             # Client API & SSE stream handler
│   │   ├── state.js           # Reactive global state manager
│   │   └── components/
│   │       ├── Navbar.js
│   │       ├── CollegeSelectorModal.js
│   │       ├── HeroSection.js
│   │       ├── PopularCategories.js
│   │       ├── Marketplace.js
│   │       ├── ProductDetailModal.js
│   │       ├── SellItemModal.js
│   │       ├── ChatInbox.js
│   │       ├── SellerDashboard.js
│   │       ├── UserProfileModal.js
│   │       ├── AuthModal.js
│   │       ├── AdminDashboard.js
│   │       └── ReportModal.js
│   ├── uploads/               # Uploaded product photos
│   └── index.html             # Main application entry point
├── server.js                  # Node.js REST API + Realtime SSE server
├── supabase_schema.sql        # Full Supabase PostgreSQL schema with RLS
├── .env.example               # Environment configuration template
└── README.md                  # Project documentation
```
