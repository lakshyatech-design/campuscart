-- ========================================================
-- CampusCart: Full PostgreSQL / Supabase Database Schema
-- Tagline: "One Platform. Every Campus."
-- Launch Campus: Gati Shakti Vishwavidyalaya (GSV), Vadodara
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE product_condition AS ENUM ('Brand New', 'Like New', 'Good', 'Fair');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('active', 'sold', 'deleted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  domain TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  student_count INTEGER DEFAULT 0,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  college_id TEXT NOT NULL REFERENCES public.colleges(id),
  roll_number TEXT,
  is_roll_private BOOLEAN DEFAULT true,
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  is_admin BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  condition product_condition NOT NULL,
  college_id TEXT NOT NULL REFERENCES public.colleges(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campus_location TEXT NOT NULL,
  contact_preference TEXT DEFAULT 'chat',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  dynamic_attributes JSONB DEFAULT '{}'::jsonb,
  status product_status DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_product_buyer_seller UNIQUE (product_id, buyer_id, seller_id)
);

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- 8. COLLEGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.college_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  student_id TEXT,
  reason TEXT,
  status request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'product' or 'user'
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Colleges: Anyone can read, only admin can insert/update
CREATE POLICY "Colleges are viewable by everyone" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Admins can manage colleges" ON public.colleges FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Profiles: Public can read basic profile, user can edit own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can read active products, sellers can update/delete their own
CREATE POLICY "Active products viewable by everyone" ON public.products FOR SELECT USING (status != 'deleted');
CREATE POLICY "Authenticated users can create products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete their own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Conversations: ONLY buyer and seller can see their conversation
CREATE POLICY "Users can view their own conversations" ON public.conversations FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid() = buyer_id
);

-- Messages: ONLY participants in the conversation can read and send messages
CREATE POLICY "Conversation participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = messages.conversation_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);
CREATE POLICY "Conversation participants can insert messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = messages.conversation_id AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- Wishlist: Users manage their own wishlist
CREATE POLICY "Users can manage their wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- Notifications: Users see only their own notifications
CREATE POLICY "Users view their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ========================================================
-- SEED DATA FOR SUPABASE
-- ========================================================
INSERT INTO public.colleges (id, name, short_name, city, state, domain, is_active, student_count, badge)
VALUES 
  ('gsv-vadodara', 'Gati Shakti Vishwavidyalaya (GSV)', 'GSV Vadodara', 'Vadodara', 'Gujarat', 'gsv.ac.in', true, 2450, 'Launch Campus'),
  ('iit-bombay', 'Indian Institute of Technology Bombay (IITB)', 'IIT Bombay', 'Mumbai', 'Maharashtra', 'iitb.ac.in', true, 11200, 'Active Hub'),
  ('bits-pilani', 'Birla Institute of Technology and Science (BITS)', 'BITS Pilani', 'Pilani', 'Rajasthan', 'pilani.bits-pilani.ac.in', true, 5800, 'Active Hub'),
  ('nit-trichy', 'National Institute of Technology Tiruchirappalli (NITT)', 'NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu', 'nitt.edu', true, 6700, 'Active Hub'),
  ('delhi-university', 'University of Delhi (DU)', 'Delhi University', 'New Delhi', 'Delhi', 'du.ac.in', false, 25000, 'Coming Soon')
ON CONFLICT (id) DO NOTHING;
