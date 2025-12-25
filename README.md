# 📸 PhotoCalories 2.0

> **Application moderne de suivi nutritionnel par IA**

Scannez vos repas en photo ou code-barres pour un suivi nutritionnel automatique et précis, alimenté par l'intelligence artificielle.

![Status](https://img.shields.io/badge/Version-2.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Nouveautés v2.0

- 🎨 **Design complètement refait** - Interface moderne et élégante
- 🔍 **Intégration multi-API** - Clarifai + USDA + OpenFoodFacts
- 📱 **Composants animés** - Framer Motion pour une expérience fluide
- 🌚 **Mode sombre** - Support du thème sombre natif
- ⚡ **Performance optimisée** - Chargement rapide et réactif

## 🚀 Technologies

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne et responsive
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes
- **Zustand** - Gestion d'état légère
- **Sonner** - Notifications toastées

### APIs & Services
- **Clarifai API** - Reconnaissance d'images alimentaires
- **USDA FoodData Central** - Base de données nutritionnelles complète
- **OpenFoodFacts** - Scanner de codes-barres
- **Supabase** (prévu) - Base de données et authentification

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Clés API (Clarifai, USDA)

### Étapes

```bash
# Cloner le repo
git clone https://github.com/rrdarkenzede/photo-calories.git
cd photo-calories

# Changer de branche
git checkout redesign-modern

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
```

Modifiez `.env.local` avec vos clés API :

```env
NEXT_PUBLIC_CLARIFAI_API_KEY=votre_cle_clarifai
NEXT_PUBLIC_USDA_API_KEY=votre_cle_usda
NEXT_PUBLIC_OPENFOODFACTS_API=https://world.openfoodfacts.org
```

```bash
# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 Fonctionnalités

### 📸 Scanner Photo
- Prise de photo via webcam ou import d'image
- Détection automatique des aliments (Clarifai)
- Récupération des informations nutritionnelles (USDA)
- Calcul automatique des calories et macros

### 🔷 Scanner Code-barres
- Scan de codes-barres en temps réel
- Base de données OpenFoodFacts (900k+ produits)
- Informations nutritionnelles détaillées

### 📊 Suivi Nutritionnel
- Dashboard avec statistiques quotidiennes
- Graphiques de progression
- Historique des repas
- Objectifs personnalisables

### 🍳 Recettes Personnalisées
- Création de recettes
- Calcul automatique des valeurs nutritionnelles
- Sauvegarde et réutilisation

### 💪 Coach IA (Plan FITNESS)
- Conseils nutritionnels personnalisés
- Suggestions d'optimisation
- Insights hebdomadaires

## 💳 Plans d'abonnement

| Fonctionnalité | GRATUIT | PRO | FITNESS |
|------------------|---------|-----|----------|
| Scans/jour | 2 | 10 | 40 |
| Historique | 7j | ∞ | ∞ |
| Recettes | ❌ | ✅ | ✅ |
| Statistiques | ❌ | ✅ | ✅ |
| Coach IA | ❌ | ❌ | ✅ |
| **Prix** | **0€** | **4.99€/mois** | **9.99€/mois** |

## 📁 Structure du Projet

```
photo-calories/
├── app/
│   ├── api/                  # Routes API
│   │   ├── scan/
│   │   │   ├── photo/        # Scan photo
│   │   │   └── barcode/      # Scan code-barres
│   │   ├── search/          # Recherche aliments
│   │   └── meals/           # CRUD repas
│   ├── page.tsx             # Page d'accueil
│   ├── layout.tsx           # Layout principal
│   └── globals.css          # Styles globaux
│
├── components/
│   ├── ui/                  # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Input.tsx
│   ├── Scanner.tsx         # Composant scanner
│   └── StatsCard.tsx       # Carte de statistiques
│
├── lib/
│   ├── utils.ts             # Utilitaires
│   ├── constants.ts         # Constantes
│   └── api-config.ts        # Configuration APIs
│
├── types/
│   └── index.ts             # Types TypeScript
│
└── package.json
```

## 🔌 API Routes

### Scan Photo
```bash
POST /api/scan/photo
Body: { "image": "base64..." }
Response: { "success": true, "foods": [...], "totalCalories": 450 }
```

### Scan Code-barres
```bash
POST /api/scan/barcode
Body: { "barcode": "3017620422003" }
Response: { "success": true, "product": {...} }
```

### Recherche Aliments
```bash
GET /api/search/food?query=chicken
Response: { "success": true, "foods": [...] }
```

### Repas
```bash
GET /api/meals?date=2025-12-25
POST /api/meals
Body: { "type": "lunch", "foods": [...] }
```

## 🎨 Composants UI

### Button
```tsx
import Button from '@/components/ui/Button'

<Button variant="primary" size="lg">
  Mon bouton
</Button>
```

### Card
```tsx
import Card from '@/components/ui/Card'

<Card hover gradient>
  Contenu
</Card>
```

### Scanner
```tsx
import Scanner from '@/components/Scanner'

<Scanner 
  onClose={() => {}}
  onScanComplete={(result) => {}}
/>
```

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🛣️ Roadmap

- [x] Design moderne
- [x] Intégration Clarifai
- [x] Intégration USDA
- [x] Intégration OpenFoodFacts
- [x] Composants UI modernes
- [ ] Scanner code-barres temps réel
- [ ] Intégration Supabase
- [ ] Authentification
- [ ] Système de paiement Stripe
- [ ] Application mobile (React Native)
- [ ] Coach IA avancé
- [ ] Export de données
- [ ] Intégration wearables

## 📝 License

MIT © 2025 - Rayane [@rrdarkenzede](https://github.com/rrdarkenzede)

## 🚀 Déploiement

### Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rrdarkenzede/photo-calories)

### Variables d'environnement à configurer

- `NEXT_PUBLIC_CLARIFAI_API_KEY`
- `NEXT_PUBLIC_USDA_API_KEY`
- `NEXT_PUBLIC_OPENFOODFACTS_API`

---

**Fait avec ❤️ par Rayane - Nutrition simplifiée par l'IA**