# 📸 PhotoCalories API

A modern food tracking API with AI-powered image recognition, barcode scanning, and nutrition calculation.

## 🚀 Features

- 📸 **Vision API** - Analyze food photos for nutritional content
- 📍 **Barcode API** - Quick product lookup from barcode
- 🥜 **Nutrition Calculator** - Calculate macros from ingredients
- 📋 **History Tracking** - Track daily food intake
- 💊 **Responsive** - Modern Next.js 14 + TypeScript

## 📦 API Endpoints

### 1. Vision Analysis
**Endpoint:** `POST /api/vision`

Analyze food image and extract nutritional information.

```bash
curl -X POST http://localhost:3000/api/vision \
  -H "Content-Type: application/json" \
  -d '{
    "base64Image": "data:image/jpeg;base64,..."
  }'
```

**Response:**
```json
{
  "foodName": "Mixed Salad",
  "calories": 250,
  "protein": 12,
  "carbs": 30,
  "fat": 8,
  "serving": "250g",
  "confidence": 0.85
}
```

### 2. Barcode Lookup
**Endpoint:** `POST /api/barcode`

Lookup product information from barcode.

```bash
curl -X POST http://localhost:3000/api/barcode \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "5901234123457"
  }'
```

**Response:**
```json
{
  "name": "Organic Yogurt",
  "brand": "YogurtCo",
  "calories": 120,
  "protein": 8,
  "carbs": 15,
  "fat": 2,
  "servingSize": "100g"
}
```

### 3. Nutrition Calculator
**Endpoint:** `POST /api/nutrition`

Calculate total nutrition from ingredients list.

```bash
curl -X POST http://localhost:3000/api/nutrition \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": [
      {"name": "Chicken", "quantity": 200, "unit": "g"},
      {"name": "Rice", "quantity": 150, "unit": "g"}
    ]
  }'
```

**Response:**
```json
{
  "totalCalories": 500,
  "totalProtein": 25,
  "totalCarbs": 60,
  "totalFat": 15,
  "servings": 2,
  "perServing": {
    "calories": 250,
    "protein": 12.5,
    "carbs": 30,
    "fat": 7.5
  }
}
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/rrdarkenzede/photo-calories.git
cd photo-calories

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test APIs.

## 📚 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Runtime:** Node.js
- **Deployment:** Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── vision/       # Image analysis
│   │   ├── barcode/      # Product lookup
│   │   └── nutrition/    # Macro calculation
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── types/
│   └── index.ts          # Shared TypeScript types
├── lib/
│   └── ...              # Utility functions
└── public/              # Static assets
```

## 🔘 Development

### Add New API Endpoint

1. Create route file: `app/api/yourfeature/route.ts`
2. Define request/response types in `types/index.ts`
3. Implement handler:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Your logic here
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

## 😀 TODO

- [ ] Integrate Google Vision API
- [ ] Connect OpenFoodFacts database
- [ ] Add authentication (JWT)
- [ ] Database integration (PostgreSQL)
- [ ] Rate limiting
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Unit tests
- [ ] E2E tests

## 👤 Author

Rayane - [@rrdarkenzede](https://github.com/rrdarkenzede)

## 📄 License

MIT - Feel free to use this project!
