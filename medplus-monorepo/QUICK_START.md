# MedPlus Monorepo - Quick Start

## ✅ Setup Complete!

Your monorepo is ready with:
- **Next.js web app** (`apps/web/`)
- **Ionic mobile app** (`apps/mobile/`)
- **Shared packages** (`packages/`)

---

## 🚀 Running the Apps

### Option 1: Run Web App Only (Next.js)
```bash
cd medplus-monorepo
npm run web
```
**Key Pages Created:**
- 🏠 **Home:** http://localhost:3000
- 🔐 **Login:** http://localhost:3000/login
- 📝 **Signup:** http://localhost:3000/signup
- 🏥 **For Doctors:** http://localhost:3000/for-doctors
- 📊 **Admin Dashboard:** http://localhost:3000/admin

### Option 2: Run Mobile App Only
```bash
cd medplus-monorepo
npm run mobile
```
Visit: **http://localhost:5173**

### Option 3: Run Both Together
```bash
cd medplus-monorepo
npm run dev
```
- Web: http://localhost:3000
- Mobile: http://localhost:5173

---

## 📁 Project Structure

```
medplus-monorepo/
├── apps/
│   ├── web/          # Next.js (for desktop/web browsers)
│   └── mobile/       # Ionic (for iOS/Android apps)
├── packages/
│   ├── shared-types/ # Common TypeScript types
│   └── api-client/   # Supabase services
└── supabase/         # Database migrations
```

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Run web only
npm run web

# Run mobile only
npm run mobile

# Run both
npm run dev

# Build all
npm run build

# Lint all
npm run lint
```

---

## 📝 Next Steps

1. **Set up Supabase:**
   - Create project at supabase.com
   - Run `supabase/migrations/001_initial_schema.sql`
   - Add credentials to `.env.local` (web) and `.env` (mobile)

2. **Continue building:**
   - Hospital search pages
   - Doctor profiles
   - Booking flow
   - Role-based dashboards

---

## 🐛 Troubleshooting

**If mobile app fails to start:**
```bash
cd apps/mobile
npm install
cd ../..
npm run mobile
```

**If web app port is in use:**
```bash
# Next.js will auto-select next available port (3001, 3002, etc.)
```

**Clean build:**
```bash
rm -rf apps/web/.next
rm -rf apps/mobile/node_modules
npm install
```
