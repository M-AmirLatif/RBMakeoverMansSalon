-- ==============================================================================
-- R.B MAKEOVER MAN'S SALON — SUPABASE DATABASE SCHEMA & INITIAL SEED
-- ==============================================================================
-- Execute this file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rkfqzokuofvztofkpzxs/sql/new
-- ==============================================================================

-- 1. BARBERS TABLE
CREATE TABLE IF NOT EXISTS public.barbers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'senior',
  initials TEXT NOT NULL,
  experience TEXT NOT NULL,
  rating NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 10,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  rates JSONB NOT NULL DEFAULT '{"haircut": 1000, "beard": 500, "hairAndBeard": 1400, "facial": 1800, "groomingPackage": 3500}'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT DEFAULT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. GALLERY ITEMS TABLE (Supports both Images and Videos)
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Interiors',
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  webp TEXT DEFAULT NULL,
  thumbnail_url TEXT DEFAULT NULL,
  width INTEGER DEFAULT 1200,
  height INTEGER DEFAULT 800,
  aspect_ratio TEXT DEFAULT 'portrait',
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT DEFAULT 'Rs. 1,000',
  numeric_price INTEGER DEFAULT 1000,
  description TEXT DEFAULT '',
  duration TEXT DEFAULT '30-45 mins',
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SITE IMAGES TABLE (Editable key images across the website)
CREATE TABLE IF NOT EXISTS public.site_images (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES IF RE-RUNNING
DROP POLICY IF EXISTS "Public read barbers" ON public.barbers;
DROP POLICY IF EXISTS "Admin write barbers" ON public.barbers;
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Admin write gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Public read services" ON public.services;
DROP POLICY IF EXISTS "Admin write services" ON public.services;
DROP POLICY IF EXISTS "Public read site images" ON public.site_images;
DROP POLICY IF EXISTS "Admin write site images" ON public.site_images;

-- CREATE RLS POLICIES FOR PUBLIC READ & AUTHENTICATED WRITE
CREATE POLICY "Public read barbers" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Admin write barbers" ON public.barbers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admin write gallery" ON public.gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin write services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public read site images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Admin write site images" ON public.site_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STORAGE POLICIES FOR 'salon-media' BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('salon-media', 'salon-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'])
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read salon-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated insert salon-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update salon-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete salon-media" ON storage.objects;

CREATE POLICY "Public read salon-media" ON storage.objects FOR SELECT USING (bucket_id = 'salon-media');
CREATE POLICY "Authenticated insert salon-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'salon-media');
CREATE POLICY "Authenticated update salon-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'salon-media');
CREATE POLICY "Authenticated delete salon-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'salon-media');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- SEED 10 BARBERS
INSERT INTO public.barbers (id, name, title, category, initials, experience, rating, review_count, specialties, bio, rates, is_popular, display_order)
VALUES
(
  'imtiaz-ahmad',
  'Imtiaz Ahmad',
  'Head Stylist & Salon Owner',
  'senior',
  'IA',
  '14+ Years',
  5.0,
  24,
  ARRAY['Executive Haircuts', 'VIP Styling', 'Signature Consultation'],
  'Owner of R.B Makeover. Known for attentive consultations, executive styling, and high salon standards.',
  '{"haircut": 1500, "beard": 800, "hairAndBeard": 2000, "facial": 2500, "groomingPackage": 4500}'::jsonb,
  true,
  1
),
(
  'asfand-imtiaz',
  'Asfand Imtiaz',
  'Senior Director & Master Barber',
  'senior',
  'AI',
  '10 Years',
  5.0,
  21,
  ARRAY['Modern Fades', 'Texture Cuts', 'Precision Grooming'],
  'Storefront partner noted for modern skin fades, textured scissor cuts, and customer satisfaction.',
  '{"haircut": 1400, "beard": 700, "hairAndBeard": 1900, "facial": 2200, "groomingPackage": 4200}'::jsonb,
  true,
  2
),
(
  'ijaz-bhai',
  'Ijaz / Ejaz Bhai',
  'Senior Hair Stylist',
  'haircut',
  'IB',
  '9 Years',
  5.0,
  19,
  ARRAY['Custom Scissor Cuts', 'Classic Haircuts', 'Beard Shaping'],
  'Named by Muhammad Bilal and Ibrahim Arshad in Google reviews for exceptional haircutting precision.',
  '{"haircut": 1200, "beard": 600, "hairAndBeard": 1600, "facial": 2000, "groomingPackage": 3800}'::jsonb,
  true,
  3
),
(
  'naveed-bhai',
  'Naveed Bhai',
  'Senior Barber & Stylist',
  'haircut',
  'NB',
  '8 Years',
  4.9,
  16,
  ARRAY['Sharp Beard Lineup', 'Fade Haircuts', 'Professional Shave'],
  'Praised by Abdullah Tariq in Google reviews for his friendly demeanor and sharp beard grooming.',
  '{"haircut": 1000, "beard": 600, "hairAndBeard": 1500, "facial": 1800, "groomingPackage": 3500}'::jsonb,
  false,
  4
),
(
  'hamza-khan',
  'Hamza Khan',
  'Hair & Beard Stylist',
  'haircut',
  'HK',
  '6 Years',
  4.9,
  12,
  ARRAY['Skin Fades', 'Taper Cuts', 'Curly Hair Styling'],
  'Expert in contemporary low, mid, and high fades as well as tailored curly hair styling.',
  '{"haircut": 900, "beard": 500, "hairAndBeard": 1300, "facial": 1600, "groomingPackage": 3000}'::jsonb,
  false,
  5
),
(
  'muhammad-bilal',
  'Muhammad Bilal',
  'Barber & Shaving Specialist',
  'haircut',
  'MB',
  '7 Years',
  4.9,
  15,
  ARRAY['Clean Shave', 'Beard Dyeing', 'Head Massage'],
  'Specializes in traditional straight line shaves, beard conditioning, and therapeutic head massage.',
  '{"haircut": 900, "beard": 500, "hairAndBeard": 1300, "facial": 1600, "groomingPackage": 3000}'::jsonb,
  false,
  6
),
(
  'ali-raza',
  'Ali Raza',
  'Skincare & Facial Specialist',
  'skincare',
  'AR',
  '6 Years',
  5.0,
  14,
  ARRAY['Facial Massage', 'Deep Pore Cleansing', 'Skin Glow Masks'],
  'Recognized for relaxing facial treatments, blackhead cleansing, and skin hydration therapies.',
  '{"haircut": 800, "beard": 500, "hairAndBeard": 1200, "facial": 2000, "groomingPackage": 3200}'::jsonb,
  false,
  7
),
(
  'usman-tariq',
  'Usman Tariq',
  'Hair Color & Straightening Specialist',
  'haircut',
  'UT',
  '7 Years',
  4.8,
  11,
  ARRAY['Hair Coloring', 'Hair Straightening', 'Keratin Treatment'],
  'Specializes in natural hair color tones, smoothing keratin treatments, and hair care repair.',
  '{"haircut": 1000, "beard": 500, "hairAndBeard": 1400, "facial": 1800, "groomingPackage": 3500}'::jsonb,
  false,
  8
),
(
  'farhan-ahmad',
  'Farhan Ahmad',
  'Junior Stylist & Barber',
  'haircut',
  'FA',
  '4 Years',
  4.9,
  9,
  ARRAY['Classic Haircuts', 'Kids Haircuts', 'Simple Beard Trim'],
  'Patient and gentle with boys and kids, providing fast and reliable everyday haircuts.',
  '{"haircut": 700, "beard": 400, "hairAndBeard": 1000, "facial": 1400, "groomingPackage": 2600}'::jsonb,
  false,
  9
),
(
  'rashid-mehmood',
  'Rashid Mehmood',
  'Grooming & Scalp Care Technician',
  'skincare',
  'RM',
  '5 Years',
  4.9,
  10,
  ARRAY['Scalp Washing', 'Shampoo & Conditioning', 'Hand Grooming'],
  'Provides therapeutic scalp washing, intensive conditioning, and complete grooming care.',
  '{"haircut": 800, "beard": 450, "hairAndBeard": 1150, "facial": 1500, "groomingPackage": 2800}'::jsonb,
  false,
  10
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  initials = EXCLUDED.initials,
  experience = EXCLUDED.experience,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  specialties = EXCLUDED.specialties,
  bio = EXCLUDED.bio,
  rates = EXCLUDED.rates,
  is_popular = EXCLUDED.is_popular,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- SEED GALLERY ITEMS
INSERT INTO public.gallery_items (id, title, alt, category, media_type, url, webp, width, height, aspect_ratio, featured, display_order)
VALUES
(
  'salon-panoramic-view',
  'Main Styling Room',
  'Panoramic view of styling stations and illuminated mirrors at R.B Makeover',
  'Interiors',
  'image',
  '/images/salon-wide-stations.jpg',
  '/images/salon-wide-stations.webp',
  1165,
  1470,
  'landscape',
  true,
  1
),
(
  'tools-vanity-station',
  'Styling Console',
  'Styling tools and vanity console at R.B Makeover',
  'Styling',
  'image',
  '/images/tools-styling-vanity.jpg',
  '/images/tools-styling-vanity.webp',
  1350,
  1800,
  'portrait',
  false,
  2
),
(
  'service-beard-action',
  'Hair and Beard Work',
  'Hair cutting and beard grooming at R.B Makeover Man''s Salon',
  'Styling',
  'image',
  '/images/service-beard-trimming.jpg',
  '/images/service-beard-trimming.webp',
  1350,
  1800,
  'portrait',
  false,
  3
),
(
  'service-shampoo-nook',
  'Shampoo Station',
  'Hair washing and shampoo station at R.B Makeover',
  'Interiors',
  'image',
  '/images/service-shampoo-station.jpg',
  '/images/service-shampoo-station.webp',
  1350,
  1800,
  'portrait',
  false,
  4
),
(
  'station-arched-damask',
  'Arched Mirror Station',
  'Styling station with arched mirror at R.B Makeover',
  'Interiors',
  'image',
  '/images/styling-station-arched.jpg',
  '/images/styling-station-arched.webp',
  675,
  1200,
  'portrait',
  false,
  5
),
(
  'station-products-black',
  'Styling Bay',
  'Styling station and chair at R.B Makeover',
  'Interiors',
  'image',
  '/images/styling-station-products.jpg',
  '/images/styling-station-products.webp',
  675,
  1200,
  'portrait',
  false,
  6
),
(
  'storefront-ext',
  'Rose Commercial Storefront',
  'Storefront entrance of R.B Makeover Man''s Salon at Rose Commercial, Park View City',
  'Storefront',
  'image',
  '/images/storefront-exterior.jpg',
  '/images/storefront-exterior.webp',
  2048,
  1152,
  'portrait',
  false,
  7
),
(
  'team-salon-staff',
  'Professional Styling Team',
  'Styling team and barber staff at R.B Makeover Man''s Salon',
  'Styling',
  'image',
  '/images/team-staff-craft.jpg',
  '/images/team-staff-craft.webp',
  1350,
  1800,
  'portrait',
  false,
  8
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  alt = EXCLUDED.alt,
  category = EXCLUDED.category,
  media_type = EXCLUDED.media_type,
  url = EXCLUDED.url,
  webp = EXCLUDED.webp,
  featured = EXCLUDED.featured,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- SEED SERVICES
INSERT INTO public.services (id, name, category, price, numeric_price, description, duration, display_order)
VALUES
('mens-haircuts', 'Men''s Haircuts', 'haircuts', 'Rs. 1,000', 1000, 'Classic and modern precision hair cuts', '30 mins', 1),
('kids-haircuts', 'Kids'' Haircuts', 'haircuts', 'Rs. 700', 700, 'Gentle and patient cuts for children', '25 mins', 2),
('fade-haircuts', 'Fade & Taper Haircuts', 'haircuts', 'Rs. 1,200', 1200, 'Low, mid, high, or drop skin fade', '40 mins', 3),
('scissor-cuts', 'Scissor Precision Cuts', 'haircuts', 'Rs. 1,200', 1200, 'Shear over comb layered texturing', '35 mins', 4),
('curly-styling', 'Curly Hair Styling', 'haircuts', 'Rs. 1,400', 1400, 'Diffused styling and curl definition', '40 mins', 5),
('hair-coloring', 'Hair Coloring', 'haircuts', 'Rs. 2,000', 2000, 'Natural tones and grey blending', '50 mins', 6),
('hair-straightening', 'Hair Straightening', 'haircuts', 'Rs. 3,500', 3500, 'Smooth sleek straightening therapy', '75 mins', 7),
('beard-trimming', 'Beard Trimming & Lineup', 'beard', 'Rs. 600', 600, 'Razor edge line and beard shaping', '25 mins', 8),
('pro-shave', 'Professional Shaving', 'beard', 'Rs. 700', 700, 'Hot towel straight razor lather shave', '30 mins', 9),
('beard-dye', 'Beard Dyeing & Conditioning', 'beard', 'Rs. 900', 900, 'Natural beard tint and argan oil softness', '30 mins', 10),
('facial-massage', 'Facial Treatments & Cleansing', 'facial', 'Rs. 1,600', 1600, 'Deep pore steam cleanse and glowing mask', '45 mins', 11),
('gold-facial', 'VIP Royal Gold Facial', 'facial', 'Rs. 2,500', 2500, 'Exfoliation, steam, blackhead extraction and massage', '60 mins', 12),
('vip-grooming', 'VIP Complete Grooming Package', 'grooming', 'Rs. 3,500', 3500, 'Haircut + Beard Styling + Facial Cleanse + Massage', '90 mins', 13)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  numeric_price = EXCLUDED.numeric_price,
  description = EXCLUDED.description,
  duration = EXCLUDED.duration,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- SEED KEY SITE IMAGES
INSERT INTO public.site_images (key, label, description, url)
VALUES
('hero_barber', 'Hero Barber Cutout Image', 'The master barber cutout portrait shown on the hero section', '/images/hero-barber-craft.webp'),
('about_salon', 'About Section Salon Floor', 'The wide styling room photograph in the About Story section', '/images/about-interior-floor.webp'),
('precision_center', 'Precision Section Center Model', 'The center portrait in the Craftsmanship section', '/images/cutout-precision-taper.webp')
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  updated_at = NOW();
