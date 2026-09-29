import type { PlanId } from '../state/AppState';

export type Plan = {
  id: PlanId;
  title: string;
  price: string;
  period: string;
  detail: string;
  badge?: string;
  trialDays?: number;
};

export const plans: Plan[] = [
  {
    id: 'yearly',
    title: 'Yearly',
    price: '$59.99',
    period: '/year',
    detail: '$5.00/month · 7-day free trial',
    badge: 'SAVE 50%',
    trialDays: 7,
  },
  { id: 'monthly', title: 'Monthly', price: '$9.99', period: '/month', detail: 'Cancel anytime' },
  { id: 'lifetime', title: 'Lifetime', price: '$129.99', period: 'once', detail: 'All current & future courses' },
];

export const getPlan = (id: PlanId) => plans.find((p) => p.id === id)!;

export const proPerks = [
  { icon: 'book-open-page-variant', text: 'Every lesson in every course' },
  { icon: 'chef-hat', text: 'Step-by-step videos with Loafy' },
  { icon: 'timer-outline', text: 'Built-in proofing & bake timers' },
  { icon: 'scale-balance', text: "Recipe scaler with baker's percentages" },
] as const;
