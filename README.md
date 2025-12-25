# 📸 PhotoCalories

**AI-powered food tracking app** - Scan your meals in seconds and automatically track nutrition.

![Status](https://img.shields.io/badge/Status-Alpha-orange)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node-18%2B-blue)

## ✨ Features

### 📸 Photo Scanning
- Snap a photo of your meal
- AI detects food type and ingredients
- Automatically calculates calories & macros
- Saves detailed ingredient breakdown

### 📍 Barcode Scanner
- Quick product lookup
- Search from OpenFoodFacts database
- Instant nutrition info

### 🍳 Custom Recipes
- Create recipes manually
- Add ingredients with quantities
- Auto-calculate totals
- Save & reuse recipes

### 📋 Tracking
- Complete daily history
- Scan limits per plan
- Macro breakdown
- Monthly stats

### 💎 AI Coach (FITNESS plan)
- Personalized nutrition advice
- Weekly insights
- Optimization tips

## 🛦 Plans

| Feature | FREE | PRO | FITNESS |
|---------|------|-----|----------|
| Scans/day | **2** | **10** | **40** |
| Photo scan | ✅ | ✅ | ✅ |
| Barcode scan | ✅ | ✅ | ✅ |
| Custom recipes | ❌ | ✅ | ✅ |
| History | ➡️ 7d | ✅ | ✅ |
| Stats | ❌ | ✅ | ✅ |
| AI Coach | ❌ | ❌ | ✅ |
| **Price** | **Free** | **4.99€/mo** | **9.99€/mo** |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (optional, for persistence)

### Installation

```bash
# Clone repo
git clone https://github.com/rrdarkenzede/photo-calories.git
cd photo-calories

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 API Endpoints

### Scans
```bash
POST /api/scan
{
  "type": "photo",
  "data": { "image": "base64..." }
}
```

### History
```bash
GET /api/history?date=2025-12-25&range=day
```

### Recipes
```bash
GET /api/recipes
POST /api/recipes
PUT /api/recipes/:id
DELETE /api/recipes/:id
```

### Stats
```bash
GET /api/stats?period=week
```

### Coach (FITNESS)
```bash
GET /api/coach
```

### Plan Switching (Testing)
```bash
POST /api/auth/set-plan
{ "plan": "pro" }
```

## 📁 Project Structure

```
app/
├── api/
│   ├── scan/           # Main scanning
│   ├── barcode/        # Product lookup
│   ├── vision/         # Image analysis
│   ├── nutrition/      # Macro calculation
│   ├── recipes/        # Recipe CRUD
│   ├── history/        # Scan history
│   ├── stats/          # Analytics
│   ├── coach/          # AI advice
│   └── auth/           # Auth endpoints
├── page.tsx         # Main dashboard
└── layout.tsx       # Root layout

lib/
└── db.schema.sql   # Database schema

types/
└── index.ts        # TypeScript types
```

## 🛠️ Current State

### ✅ Implemented
- Backend API structure
- Frontend dashboard with tabs
- Plan switching (for testing)
- Database schema
- TypeScript types
- Tailwind styling

### ⚠️ TODO
- [ ] Database integration (PostgreSQL/Supabase)
- [ ] Google Vision API integration
- [ ] OpenFoodFacts barcode lookup
- [ ] Authentication (JWT)
- [ ] Camera integration
- [ ] Stripe payments
- [ ] AI coach logic
- [ ] Stats calculations
- [ ] Unit tests
- [ ] E2E tests

## 📄 Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Supabase (planned)
- **Vision:** Google Cloud Vision API
- **Auth:** JWT (planned)
- **Payment:** Stripe (planned)
- **Hosting:** Vercel

## 👤 Author

Rayane - [@rrdarkenzede](https://github.com/rrdarkenzede)

## 📄 License

MIT © 2025
