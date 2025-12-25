# 🗺️ PhotoCalories Development Roadmap

## Phase 1: MVP (Current)
**Status:** 💪 In Progress

### ✅ Done
- Backend API structure (scan, recipes, history, stats, coach)
- Frontend dashboard with plan selector
- Database schema (PostgreSQL)
- TypeScript types & validation
- Documentation

### 🖄 Next (Priority Order)
1. **Database Integration**
   - Connect PostgreSQL/Supabase
   - Implement user tables
   - Add sample data

2. **Camera Integration**
   - WebRTC camera access
   - Photo capture & upload
   - Preview before scan

3. **Google Vision API**
   - Setup API keys
   - Implement image analysis
   - Extract food & ingredients
   - Parse confidence scores

4. **Barcode Scanner**
   - Integrate barcode reader library
   - Connect OpenFoodFacts API
   - Fallback search

5. **Basic Recipes**
   - Ingredient database
   - Manual recipe creation
   - Save & retrieve

---

## Phase 2: Features (Week 2)
**Goal:** Core functionality working end-to-end

### Features
- [ ] History view with editable scans
- [ ] Daily stats & summaries
- [ ] Weekly stats graphs
- [ ] Ingredient breakdown details
- [ ] Calorie goals & progress
- [ ] Mobile-responsive design fixes

---

## Phase 3: Authentication (Week 3)
**Goal:** User accounts and data persistence

### Auth System
- [ ] Email registration
- [ ] Email verification
- [ ] Login/logout
- [ ] JWT tokens
- [ ] Session management
- [ ] Password reset
- [ ] Profile customization

### User Features
- [ ] Daily calorie goals
- [ ] Macro ratio preferences
- [ ] Height/weight profile
- [ ] Activity level

---

## Phase 4: Premium Features (Week 4)
**Goal:** Monetization ready

### Recipes
- [ ] Public recipe library
- [ ] Search recipes
- [ ] Rate recipes
- [ ] Share recipes

### Stats (PRO)
- [ ] Monthly trends
- [ ] Macro distribution charts
- [ ] Weekly averages
- [ ] Goals vs actual
- [ ] Export PDF reports

### Coach (FITNESS)
- [ ] Analyze eating patterns
- [ ] Generate insights
- [ ] Weekly recommendations
- [ ] Performance tips
- [ ] Motivation messages

---

## Phase 5: Payments (Week 5)
**Goal:** Production-ready payment system

### Stripe Integration
- [ ] Checkout flow
- [ ] Subscription management
- [ ] Invoice generation
- [ ] Billing portal
- [ ] Payment webhooks
- [ ] Plan upgrades/downgrades

### Plan Features
- [ ] Enforce scan limits
- [ ] Feature gating
- [ ] Trial period (if needed)
- [ ] Renewal notifications

---

## Phase 6: Polish (Week 6)
**Goal:** Production launch

### Performance
- [ ] Image optimization
- [ ] Caching strategy
- [ ] Database indexing
- [ ] API rate limiting

### Testing
- [ ] Unit tests (APIs)
- [ ] E2E tests (flows)
- [ ] Performance testing
- [ ] Security audit

### DevOps
- [ ] CI/CD pipeline
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Posthog)
- [ ] Logging

### Marketing
- [ ] Landing page
- [ ] Terms of service
- [ ] Privacy policy
- [ ] Social media assets

---

## Future Ideas

### Social Features
- Share meals with friends
- Friends' stats
- Challenges & competitions
- Community recipes

### Integrations
- Apple Health
- Google Fit
- Strava
- Fitbit

### Advanced AI
- Meal planning
- Personalized diet plans
- Workout recommendations
- Recipe suggestions based on goals

### Mobile Apps
- React Native iOS app
- React Native Android app
- Offline support
- Push notifications

---

## Current Tech Debt
- [ ] Error handling (everywhere)
- [ ] Input validation (all endpoints)
- [ ] Database queries need optimization
- [ ] Frontend state management (consider Redux/Zustand)
- [ ] Component splitting (currently monolithic page.tsx)
- [ ] API response standardization

---

## Questions to Answer
1. Where to host database? (Supabase, Railway, etc.)
2. How to handle offline scans?
3. Food database: Use OpenFoodFacts or custom?
4. Multiple meals per day support?
5. Export formats? (CSV, PDF, etc.)
6. Mobile app priority?
7. Social features timeline?

---

**Last Updated:** 2025-12-25
**Estimated Launch:** 2025-Q1
