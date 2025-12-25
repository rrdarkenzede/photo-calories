export interface Plan {
  name: string
  price: number
  scans: number
  history: number
  recipes: boolean
  stats: boolean
  coach: boolean
}

export const PLAN_FEATURES: Record<'free' | 'pro' | 'fitness', Plan> = {
  free: {
    name: 'Gratuit',
    price: 0,
    scans: 2,
    history: 7,
    recipes: false,
    stats: false,
    coach: false,
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    scans: 10,
    history: 90,
    recipes: true,
    stats: true,
    coach: false,
  },
  fitness: {
    name: 'Fitness',
    price: 19.99,
    scans: 40,
    history: -1,
    recipes: true,
    stats: true,
    coach: true,
  },
}