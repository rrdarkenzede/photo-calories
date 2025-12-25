'use client'

import { PLAN_FEATURES, upgradePlan, Plan, UserProfile } from '@/lib/calculations'

export default function PlansModal({ profile, onUpgrade }: { profile: UserProfile; onUpgrade: (plan: Plan) => void }) {
  const handleUpgrade = (plan: Plan) => {
    upgradePlan(plan)
    onUpgrade(plan)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '3rem' }}>Choisissez votre plan</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {(['free', 'pro', 'fitness'] as Plan[]).map(planId => {
            const plan = PLAN_FEATURES[planId]
            const isCurrentPlan = profile.plan === planId

            return (
              <div key={planId} className="glass" style={{ padding: '2rem', borderRadius: '16px', color: 'white', border: planId === 'pro' ? '3px solid rgba(102, 126, 234, 0.8)' : '1px solid rgba(255,255,255,0.2)', position: 'relative', transform: planId === 'pro' ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'center' }}>
                {planId === 'pro' && <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>⭐ POPULAIRE</div>}

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{plan.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>
                  {plan.price}€
                  {plan.price > 0 && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>/mois</span>}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', display: 'grid', gap: '0.75rem' }}>
                  <li>✓ {plan.scansPerDay} scans/jour</li>
                  <li>✓ Historique {plan.historyDays} jours</li>
                  <li>✓ Calories {plan.showMacros ? '+ Macros' : 'seulement'}</li>
                  {plan.analytics && <li>✓ Analytics avancées</li>}
                  {plan.coach && <li>✓ Coach IA 24/7</li>}
                  {plan.fitnesSync && <li>✓ Sync Fitness apps</li>}
                  {plan.recipeBuilder && <li>✓ Recipe Builder</li>}
                  {plan.ads && <li>⚠️ Avec publicités</li>}
                  {!plan.ads && <li>✓ Pas de pubs</li>}
                </ul>

                <button
                  onClick={() => handleUpgrade(planId)}
                  disabled={isCurrentPlan}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: isCurrentPlan ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: isCurrentPlan ? 'default' : 'pointer',
                    opacity: isCurrentPlan ? 0.6 : 1,
                  }}
                >
                  {isCurrentPlan ? '✓ Plan actuel' : plan.price === 0 ? 'Commencer gratuit' : 'Souscrire'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', color: 'white', marginBottom: '2rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Feature</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>Gratuit</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>Pro</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>Fitness+</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '1rem' }}>Scans/jour</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>2</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>10</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>40</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '1rem' }}>Historique</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>7j</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>90j</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>∞</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '1rem' }}>Macros détaillés</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '1rem' }}>Analytics</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '1rem' }}>Coach IA</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '1rem' }}>Fitness Sync</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem' }}>Publicités</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>✅</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
