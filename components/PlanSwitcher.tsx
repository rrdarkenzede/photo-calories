'use client';

import { useAppStore } from '@/lib/store';
import { PLAN_DESCRIPTIONS } from '@/lib/plans';
import { PlanType } from '@/lib/types';
import { Check } from 'lucide-react';

const plans: PlanType[] = ['free', 'pro', 'fitness'];

export function PlanSwitcher() {
  const { currentPlan, setPlan } = useAppStore();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="dropdown dropdown-end">
        <button
          tabIndex={0}
          className="btn btn-sm btn-outline gap-2 font-semibold"
        >
          <span className="badge badge-primary">{currentPlan.toUpperCase()}</span>
          Changer de Plan
        </button>
        <div
          tabIndex={0}
          className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-64 space-y-2"
        >
          {plans.map((plan) => (
            <div
              key={plan}
              onClick={() => setPlan(plan)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                currentPlan === plan
                  ? 'bg-primary text-white ring-2 ring-primary'
                  : 'bg-base-200 hover:bg-base-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">{plan}</span>
                {currentPlan === plan && <Check className="w-4 h-4" />}
              </div>
              <p className="text-xs opacity-80 mb-2">
                {PLAN_DESCRIPTIONS[plan].price}
              </p>
              <p className="text-xs opacity-75">
                {PLAN_DESCRIPTIONS[plan].scans}
              </p>
              <p className="text-xs opacity-75">
                {PLAN_DESCRIPTIONS[plan].history}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
