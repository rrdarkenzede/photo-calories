'use client';

import React from 'react';

interface NutriscoreBadgeProps {
  score: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function NutriscoreBadge({ score, size = 'md' }: NutriscoreBadgeProps) {
  const normalized = score?.toUpperCase() || 'N/A';
  
  const colors: Record<string, string> = {
    'A': 'bg-green-500',
    'B': 'bg-lime-400',
    'C': 'bg-yellow-400',
    'D': 'bg-orange-400',
    'E': 'bg-red-500',
    'N/A': 'bg-gray-400',
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const bgColor = colors[normalized] || colors['N/A'];
  const sizeClass = sizes[size];

  if (normalized === 'N/A') {
    return null; // Don't show badge if no score
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="text-xs font-semibold text-gray-600">Nutri-Score</div>
      <div className={`${bgColor} ${sizeClass} rounded-lg flex items-center justify-center font-black text-white shadow-lg`}>
        {normalized}
      </div>
    </div>
  );
}
