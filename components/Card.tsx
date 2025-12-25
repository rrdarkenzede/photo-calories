'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: 'orange' | 'blue' | 'purple' | 'green' | 'none';
  animated?: boolean;
}

const gradients = {
  orange: 'from-orange-500/10 to-amber-500/10 border-orange-500/30',
  blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30',
  purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/30',
  green: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
  none: 'border-gray-700/50',
};

export default function Card({
  children,
  className = '',
  hover = true,
  gradient = 'none',
  animated = true,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl p-6 border backdrop-blur-md transition-all duration-300
        ${gradients[gradient]}
        ${hover ? 'hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1' : ''}
        ${animated ? 'animate-fadeIn' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
