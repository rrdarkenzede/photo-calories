# 🚀 Guide de Déploiement - PhotoCalories 2.0

## Prérequis

- Node.js 18+
- Clés API:
  - Clarifai
  - USDA FoodData Central
  - OpenFoodFacts (gratuit)

## Installation Locale

### 1. Cloner et installer
```bash
git clone https://github.com/rrdarkenzede/photo-calories.git
cd photo-calories
git checkout redesign-modern
npm install
```

### 2. Configuration
```bash
cp .env.example .env.local
```

Modifier `.env.local` avec vos clés API:
```env
NEXT_PUBLIC_CLARIFAI_API_KEY=votre_cle
NEXT_PUBLIC_USDA_API_KEY=votre_cle
NEXT_PUBLIC_OPENFOODFACTS_API=https://world.openfoodfacts.org
```

### 3. Dev
```bash
npm run dev
# Ouvrir http://localhost:3000
```

### 4. Build
```bash
npm run build
npm run start
```

## Déploiement sur Vercel

### Option 1: CLI Vercel
```bash
npm i -g vercel
vercel
```

### Option 2: Dashboard Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set environment variables
4. Deploy

### Variables d'environnement Vercel
```
NEXT_PUBLIC_CLARIFAI_API_KEY = your_key
NEXT_PUBLIC_USDA_API_KEY = your_key
NEXT_PUBLIC_OPENFOODFACTS_API = https://world.openfoodfacts.org
```

## Checklist de Déploiement

- [x] Tous les types TypeScript corrects
- [x] Pas d'erreurs ESLint
- [x] APIs fonctionnelles
- [x] Design responsive
- [x] Mode sombre supporté
- [x] Variables d'environnement configurées
- [x] Build local réussi (`npm run build`)
- [x] Pas de console errors en production

## Troubleshooting

### Build failure: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API returns 401
Vérifier les clés API dans `.env.local` et Vercel settings

### Image won't load in webcam
Vérifier les permissions du navigateur pour la caméra

## Support

Problèmes? Ouvrir une issue sur GitHub:
https://github.com/rrdarkenzede/photo-calories/issues
