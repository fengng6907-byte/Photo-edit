-- ================================================================
-- PrismFlow AI — Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor to initialize the database
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- USERS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'creator', 'pro', 'studio')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'past_due', 'canceled')),
  stripe_customer_id TEXT UNIQUE,
  storage_used BIGINT NOT NULL DEFAULT 0,
  storage_limit INTEGER NOT NULL DEFAULT 1, -- in GB
  credits_remaining INTEGER NOT NULL DEFAULT 10,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- PROJECTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- UPLOADS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration FLOAT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- FILTERS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.filters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('portrait', 'cinematic', 'travel', 'social_media', 'retro', 'gaming', 'luxury', 'nature', 'food', 'wedding')),
  thumbnail_url TEXT,
  preview_before_url TEXT,
  preview_after_url TEXT,
  settings JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  popularity_score INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  rating FLOAT NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- PRESETS TABLE (User-created custom presets)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- SUBSCRIPTIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('creator', 'pro', 'studio')),
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- PAYMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- AI JOBS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.ai_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  upload_id UUID REFERENCES public.uploads(id) ON DELETE SET NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('background_removal', 'upscale', 'enhance', 'style_transfer', 'color_grade', 'face_enhance', 'noise_removal', 'stabilize', 'subtitle_generation', 'slow_motion')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  input_url TEXT NOT NULL,
  output_url TEXT,
  settings JSONB DEFAULT '{}',
  error TEXT,
  processing_time INTEGER, -- in milliseconds
  credits_used INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- FAVORITES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  filter_id UUID REFERENCES public.filters(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, filter_id),
  UNIQUE(user_id, project_id)
);

-- ================================================================
-- NOTIFICATIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- ANALYTICS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- RENDER HISTORY TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.render_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  upload_id UUID REFERENCES public.uploads(id) ON DELETE SET NULL,
  output_url TEXT NOT NULL,
  format TEXT NOT NULL,
  resolution TEXT NOT NULL,
  file_size BIGINT,
  duration FLOAT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON public.uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_id ON public.ai_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON public.ai_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created_at ON public.ai_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_filters_category ON public.filters(category);
CREATE INDEX IF NOT EXISTS idx_filters_popularity ON public.filters(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.render_history ENABLE ROW LEVEL SECURITY;

-- Users: own row only
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Projects: own rows only
CREATE POLICY "projects_all_own" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- Uploads: own rows only
CREATE POLICY "uploads_all_own" ON public.uploads FOR ALL USING (auth.uid() = user_id);

-- Filters: public read, admin write
CREATE POLICY "filters_select_all" ON public.filters FOR SELECT USING (true);
CREATE POLICY "filters_insert_admin" ON public.filters FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));
CREATE POLICY "filters_update_admin" ON public.filters FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- Presets: own + public ones readable
CREATE POLICY "presets_select" ON public.presets FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "presets_insert_own" ON public.presets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "presets_update_own" ON public.presets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "presets_delete_own" ON public.presets FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions: own rows
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payments: own rows
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- AI Jobs: own rows
CREATE POLICY "ai_jobs_all_own" ON public.ai_jobs FOR ALL USING (auth.uid() = user_id);

-- Favorites: own rows
CREATE POLICY "favorites_all_own" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Notifications: own rows
CREATE POLICY "notifications_all_own" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Analytics: insert for authenticated users
CREATE POLICY "analytics_insert_auth" ON public.analytics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "analytics_select_own" ON public.analytics FOR SELECT USING (auth.uid() = user_id);

-- Render history: own rows
CREATE POLICY "render_history_all_own" ON public.render_history FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- FUNCTIONS & TRIGGERS
-- ================================================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_ai_jobs_updated_at BEFORE UPDATE ON public.ai_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ================================================================
-- STORAGE BUCKETS
-- ================================================================
-- Run these in the Supabase dashboard or via CLI:
-- supabase storage create images --public
-- supabase storage create videos --public
-- supabase storage create thumbnails --public
-- supabase storage create exports --public

-- ================================================================
-- SEED DATA — Sample filters
-- ================================================================
INSERT INTO public.filters (name, description, category, thumbnail_url, settings, is_premium, popularity_score, tags) VALUES
  ('Hollywood Gold', 'Hollywood-grade cinematic color grading', 'cinematic', NULL, '{"contrast": 20, "temperature": 15, "saturation": -10}', false, 1542, ARRAY['cinematic', 'warm', 'professional']),
  ('Soft Korean', 'Popular Korean beauty filter', 'portrait', NULL, '{"brightness": 15, "saturation": 10, "highlights": 20}', false, 1235, ARRAY['portrait', 'soft', 'beauty']),
  ('Teal & Orange', 'Classic Hollywood color split', 'cinematic', NULL, '{"temperature": 20, "tint": -10, "saturation": 30}', false, 1189, ARRAY['cinematic', 'teal', 'orange']),
  ('Bali Sunset', 'Tropical golden hour magic', 'travel', NULL, '{"temperature": 40, "brightness": 15, "saturation": 20}', false, 1089, ARRAY['travel', 'warm', 'golden']),
  ('Cyberpunk 2077', 'Neon-lit futuristic aesthetic', 'gaming', NULL, '{"saturation": 50, "hue": 280, "contrast": 30}', true, 982, ARRAY['neon', 'dark', 'futuristic']),
  ('Black Gold Luxury', 'High-contrast luxury lifestyle', 'luxury', NULL, '{"saturation": -40, "contrast": 25, "shadows": -30}', true, 874, ARRAY['luxury', 'dark', 'gold']),
  ('TikTok Viral', 'The most viral TikTok aesthetic', 'social_media', NULL, '{"brightness": 10, "saturation": 25, "contrast": 15}', false, 1892, ARRAY['social', 'bright', 'trendy']),
  ('VHS Glitch', 'Authentic VHS tape effect', 'retro', NULL, '{"saturation": -20, "grain": 30, "contrast": 15}', false, 765, ARRAY['retro', 'glitch', 'vintage']),
  ('Golden Wedding', 'Romantic wedding photography', 'wedding', NULL, '{"temperature": 25, "brightness": 10, "saturation": 15}', true, 623, ARRAY['wedding', 'romantic', 'warm']),
  ('Tokyo Nights', 'Vibrant Japanese city lights', 'travel', NULL, '{"saturation": 40, "temperature": -20, "contrast": 20}', false, 1123, ARRAY['city', 'night', 'neon'])
ON CONFLICT DO NOTHING;

-- ================================================================
-- END OF SCHEMA
-- ================================================================
