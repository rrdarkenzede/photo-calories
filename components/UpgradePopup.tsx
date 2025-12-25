'use client';

interface UpgradePopupProps {
  show: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan: 'pro' | 'fitness';
}

export default function UpgradePopup({ show, onClose, feature, requiredPlan }: UpgradePopupProps) {
  if (!show) return null;

  const planInfo = {
    pro: { name: 'PRO', price: 5, emoji: '💎' },
    fitness: { name: 'FITNESS', price: 15, emoji: '💪' },
  };

  const info = planInfo[requiredPlan];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Fonctionnalité {info.name}
          </h2>
          <p className="text-gray-600">
            {feature} est disponible avec le plan {info.name}
          </p>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-teal-600">
              {info.price}€<span className="text-lg text-gray-600">/mois</span>
            </div>
          </div>
          
          <ul className="space-y-3">
            {requiredPlan === 'pro' && (
              <>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>15 scans par jour</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Calories + Macros (P/G/L)</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Objectif calorique personnalisé</span>
                </li>
              </>
            )}
            {requiredPlan === 'fitness' && (
              <>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>40 scans par jour</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Infos nutritionnelles complètes</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Coach personnalisé</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Sauvegarde de recettes</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Modification des ingrédients</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 rounded-xl font-bold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg">
            Passer au plan {info.name}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
