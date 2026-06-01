# ConvertAI 🚀

> AI-powered file conversion, OCR, document scanning & compression platform
> Built with Next.js 15 · Groq AI · Tesseract OCR · PostgreSQL · Redis

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** v20+ → https://nodejs.org
- **npm** v9+ (comes with Node.js)
- **Docker Desktop** → https://docker.com (for PostgreSQL + Redis)
- **Git** → https://git-scm.com

---

## ⚡ Quick Start (5 minutes)

### Step 1 — Install dependencies

```bash
cd convertai
npm install
```

### Step 2 — Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in **at minimum**:
```
GROQ_API_KEY=your-groq-api-key          # Get free at: https://console.groq.com
DATABASE_URL=postgresql://postgres:password@localhost:5432/convertai
NEXTAUTH_SECRET=any-random-32-char-string
```

### Step 3 — Start PostgreSQL + Redis with Docker

```bash
docker-compose -f docker/docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL on port `5432`
- Redis on port `6379`
- pgAdmin (DB UI) on port `5050`

### Step 4 — Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

### Step 5 — Run the development server

```bash
npm run dev
```

Open → http://localhost:3000 🎉

---

## 🔧 All Available Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database (Prisma)
```bash
npm run db:generate      # Generate Prisma client from schema
npm run db:push          # Push schema changes to DB (dev only)
npm run db:migrate       # Create & run migrations (production)
npm run db:studio        # Open Prisma Studio (visual DB editor)
npm run db:seed          # Seed the database with sample data
```

### Background Worker
```bash
npm run worker           # Start BullMQ background job worker
```

### Docker
```bash
# Start all services (postgres + redis)
docker-compose -f docker/docker-compose.dev.yml up -d

# Stop all services
docker-compose -f docker/docker-compose.dev.yml down

# View logs
docker-compose -f docker/docker-compose.dev.yml logs -f

# Reset database (DESTRUCTIVE)
docker-compose -f docker/docker-compose.dev.yml down -v
```

---

## 🌍 Getting API Keys

### 1. Groq API Key (Required for AI OCR)
1. Go to https://console.groq.com
2. Sign up / Log in
3. Go to **API Keys** → Create new key
4. Copy key to `GROQ_API_KEY` in `.env.local`
5. **Free tier**: 14,400 requests/day — very generous!

### 2. Google OAuth (Optional, for "Login with Google")
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable **Google+ API** and **OAuth Consent Screen**
4. Create **OAuth 2.0 credentials** (Web Application)
5. Add `http://localhost:3000/api/auth/callback/google` to Authorized Redirect URIs
6. Copy Client ID → `GOOGLE_CLIENT_ID`
7. Copy Client Secret → `GOOGLE_CLIENT_SECRET`

### 3. Stripe (Optional, for payments)
1. Go to https://dashboard.stripe.com
2. Get keys from **Developers → API Keys**
3. Copy to `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. For webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 4. Razorpay (Optional, for Indian payments)
1. Go to https://dashboard.razorpay.com
2. Get keys from **Settings → API Keys**

### 5. AWS S3 (Optional, for file storage)
1. Create an S3 bucket in AWS Console
2. Create IAM user with S3 full access
3. Copy credentials to env vars

---

## 🏗️ Project Structure

```
convertai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Login
│   │   │   ├── register/page.tsx     # Register
│   │   │   └── forgot-password/
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # User dashboard
│   │   │   └── history/              # Conversion history
│   │   ├── tools/
│   │   │   ├── convert/page.tsx      # File converter
│   │   │   ├── ocr/page.tsx          # AI OCR
│   │   │   ├── compress/page.tsx     # File compressor
│   │   │   ├── scanner/page.tsx      # Document scanner
│   │   │   ├── pdf-tools/page.tsx    # PDF tools
│   │   │   └── image-tools/page.tsx  # Image editor
│   │   └── api/
│   │       ├── convert/route.ts      # Conversion API
│   │       ├── compress/route.ts     # Compression API
│   │       ├── ocr/route.ts          # OCR API (Groq + Tesseract)
│   │       ├── ocr/download/route.ts # Download OCR output
│   │       └── auth/register/route.ts
│   ├── components/
│   │   ├── ui/                       # Shadcn UI components
│   │   ├── layout/                   # Navbar, Footer, ThemeProvider
│   │   └── features/
│   │       └── landing/              # Landing page sections
│   ├── lib/
│   │   ├── db.ts                     # Prisma client
│   │   ├── utils.ts                  # Utility functions
│   │   └── hooks/use-toast.ts        # Toast hook
│   └── styles/globals.css            # Global styles + design tokens
├── prisma/
│   └── schema.prisma                 # Database schema
├── docker/
│   └── docker-compose.dev.yml        # Docker services
├── .env.example                      # Environment template
├── Dockerfile                        # Production Docker image
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Features

| Feature | Status | Details |
|---------|--------|---------|
| File Converter | ✅ | Image→PDF, Image→Image, PDF→TXT |
| AI OCR | ✅ | Groq + Tesseract, 50+ languages |
| Document Scanner | ✅ | Filter modes, multi-page PDF export |
| File Compressor | ✅ | PDF, JPG, PNG, WEBP |
| PDF Tools | ✅ | Merge PDFs (client-side) |
| Image Tools | ✅ | Brightness/Contrast/Saturation |
| Authentication | 🔧 | Login/Register forms (needs NextAuth setup) |
| Dashboard | ✅ | Usage stats, activity history |
| Payments | 🔧 | Stripe/Razorpay ready (needs keys) |
| Dark Mode | ✅ | Full dark/light mode support |
| Mobile Responsive | ✅ | Works on all screen sizes |

---

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or via CLI:
vercel env add GROQ_API_KEY
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

### Deploy with Docker

```bash
# Build image
docker build -t convertai .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e GROQ_API_KEY="..." \
  -e NEXTAUTH_SECRET="..." \
  convertai
```

### Production Database
Use a managed PostgreSQL service:
- **Neon** (free tier, serverless) → https://neon.tech
- **Supabase** (free tier) → https://supabase.com
- **Railway** → https://railway.app

---

## 🔑 Minimum .env.local to Run

```env
# Required
DATABASE_URL="postgresql://postgres:password@localhost:5432/convertai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
GROQ_API_KEY="gsk_xxxxxxxxxxxx"  # https://console.groq.com

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🐛 Troubleshooting

**Port 5432 already in use:**
```bash
# Find and kill the process
lsof -i :5432
kill -9 <PID>
# Or change the port in docker-compose.dev.yml
```

**Prisma client not found:**
```bash
npm run db:generate
```

**Tesseract not working:**
```bash
# It's a pure JS package, should work without system install
# If issues, rebuild node_modules:
rm -rf node_modules && npm install
```

**GROQ_API_KEY not set warning:**
- OCR will still work using Tesseract only (without AI enhancement)
- Get a free key at https://console.groq.com

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Animations | Framer Motion |
| AI/OCR | Groq (llama-3.1-8b) + Tesseract.js |
| PDF | pdf-lib, pdfkit, pdf-parse |
| Images | Sharp |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 |
| Queue | BullMQ + Redis |
| Storage | AWS S3 / Cloudinary |
| Payments | Stripe + Razorpay |
| Deployment | Vercel / Docker |

---

## 📄 License

MIT © ConvertAI
