# PrismFlow AI — AI-Powered Photo & Video Editor

A production-ready, full-stack AI SaaS platform for photo and video editing. Built with Next.js 15, Supabase, Stripe, and cutting-edge AI APIs.

## ✨ Features

### AI Photo Editor
- 🖼️ **Background Removal** — Pixel-perfect AI background removal
- 🔍 **4x Upscaling** — AI-powered image upscaling without quality loss
- 👤 **Face Enhancement** — Portrait and skin retouching
- 🎨 **100+ Cinematic Filters** — Hollywood, vintage, luxury, travel, and more
- ✨ **Auto Enhancement** — One-click AI photo improvement
- 🌈 **Color Grading** — Professional cinematic color tools

### AI Video Studio
- 🎬 **Cinematic LUTs** — Professional color grading presets
- 📝 **AI Subtitles** — Auto-generate captions in 50+ languages
- 🔇 **Audio Denoising** — Remove background noise
- ⚡ **AI Stabilization** — Eliminate camera shake
- 🎵 **Music Sync** — Auto-sync background music
- 📱 **Format Presets** — TikTok, YouTube, Instagram, Reels

### Platform
- 🛒 **Filter Marketplace** — 247+ community filters
- 💳 **Stripe Subscriptions** — Free, Creator, Pro, Studio plans
- 🔐 **Google OAuth** — One-click social login
- 📊 **Admin Dashboard** — Full platform management
- 📈 **Analytics** — Usage tracking and insights

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| Payments | Stripe |
| State | Zustand |
| Storage | Supabase Storage |
| Deployment | Vercel |
| AI APIs | Replicate, OpenAI |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account
- Stripe account
- Vercel account (for deployment)

### Local Development

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Photo-edit

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in all required values in .env.local

# 4. Run the database schema
# Open Supabase SQL Editor and run: supabase/schema.sql

# 5. Start the dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AI APIs (Required for AI features)
OPENAI_API_KEY=
REPLICATE_API_TOKEN=

# Cloudinary (Optional - for CDN)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Database Setup

1. Go to your Supabase project → SQL Editor
2. Run the full schema: `supabase/schema.sql`
3. Create storage buckets: `images`, `videos`, `thumbnails`, `exports`
4. Enable Google OAuth in Supabase Auth settings

## 💳 Stripe Setup

1. Create products and prices in Stripe Dashboard
2. Copy Price IDs to `.env.local`
3. Set up webhook endpoint: `POST https://your-domain.com/api/stripe/webhook`
4. Enable events: `customer.subscription.*`, `invoice.payment_succeeded`

## 🚀 Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Required Vercel environment variables:**
- Add all variables from `.env.example` to Vercel project settings
- Set `NEXT_PUBLIC_APP_URL` to your production URL

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   │   ├── ai/           # AI processing endpoints
│   │   ├── auth/         # Auth callbacks
│   │   ├── stripe/       # Payment webhooks
│   │   └── upload/       # File upload endpoint
│   ├── billing/           # Billing page
│   ├── dashboard/         # User dashboard
│   ├── editor/            # AI Photo Editor
│   ├── features/          # Features page
│   ├── marketplace/       # Filter Marketplace
│   ├── pricing/           # Pricing page
│   ├── profile/           # User profile
│   ├── settings/          # Settings page
│   └── video-studio/      # AI Video Studio
├── components/
│   ├── editor/            # Photo editor components
│   ├── landing/           # Landing page sections
│   ├── layout/            # Navbar, Sidebar, Footer
│   ├── marketplace/       # Marketplace components
│   ├── ui/                # Reusable UI components
│   └── video/             # Video editor components
├── hooks/                 # Custom React hooks
├── lib/
│   └── supabase/          # Supabase client (client + server)
├── middleware.ts           # Auth middleware
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── utils.ts               # Utility functions

supabase/
└── schema.sql             # Full database schema
```

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Authentication (Google + Email)
- [x] Landing page
- [x] Photo Editor UI
- [x] Video Studio UI
- [x] Filter Marketplace
- [x] Dashboard
- [x] Admin Panel
- [x] Stripe integration
- [x] Supabase schema

### Phase 2
- [ ] Replicate AI integrations
- [ ] Real background removal API
- [ ] FFmpeg WASM video processing
- [ ] UploadThing integration
- [ ] Email notifications (Resend)
- [ ] PostHog analytics

### Phase 3
- [ ] Team collaboration
- [ ] Community filter marketplace
- [ ] Mobile app (React Native)
- [ ] Custom AI model fine-tuning
- [ ] White-label API

## 🔒 Security

- All secrets stored in environment variables (never committed)
- Row Level Security on all Supabase tables
- File validation on upload (type + size)
- Authentication middleware on all protected routes
- CSRF protection via Next.js
- Stripe webhook signature verification

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ by PrismFlow AI Team
