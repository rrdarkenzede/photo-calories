'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Zap, TrendingUp, ChefHat, Smartphone, Star, Check } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const PlanCard = ({ plan, icon: Icon, price, features, highlighted }: any) => {
  const colors: any = {
    free: { bg: 'from-gray-800 to-gray-900', border: 'border-gray-600', btn: 'bg-gray-700 hover:bg-gray-600', accent: 'text-gray-400' },
    pro: { bg: 'from-blue-900/40 to-purple-900/40', border: 'border-blue-500/50', btn: 'bg-blue-600 hover:bg-blue-700', accent: 'text-blue-400' },
    fitness: { bg: 'from-yellow-900/40 to-orange-900/40', border: 'border-yellow-500/50', btn: 'bg-yellow-600 hover:bg-yellow-700', accent: 'text-yellow-400' },
  };

  const color = colors[plan];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: highlighted ? 1 : 1.05, y: -10 }}
      className={`relative rounded-2xl p-8 backdrop-blur-md border ${
        highlighted
          ? `${color.border} ${color.bg} shadow-2xl ring-2 ring-${plan === 'fitness' ? 'yellow' : 'blue'}-500/50`
          : `border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30`
      } transition-all duration-300 group`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            <Star className="w-4 h-4" />
            Populaire
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white capitalize mb-2">{plan}</h3>
          {price && <p className={`text-sm font-semibold ${color.accent}`}>{price}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 ${
          plan === 'fitness' ? 'text-yellow-400' : plan === 'pro' ? 'text-blue-400' : 'text-gray-400'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature: any, i: number) => (
          <li key={i} className="text-gray-300 flex items-start gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              plan === 'fitness' ? 'text-yellow-400' : plan === 'pro' ? 'text-blue-400' : 'text-gray-400'
            }`} />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={`/dashboard?plan=${plan}`}>
        <button className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
          color.btn
        }`}>
          Commencer
        </button>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const plans = [
    {
      plan: 'free',
      icon: Smartphone,
      price: 'Gratuit',
      features: [
        'Upload photo ou scan',
        'Calories détectées',
        'Historique 7 jours',
        '2 scans/jour',
      ],
    },
    {
      plan: 'pro',
      icon: TrendingUp,
      price: '4,99€/mois',
      features: [
        'Calories + Macros',
        'Défis personnalisés',
        'Historique illimité',
        'Scan code-barres',
        '10 scans/jour',
      ],
      highlighted: true,
    },
    {
      plan: 'fitness',
      icon: ChefHat,
      price: '9,99€/mois',
      features: [
        'Analyse nutritionnelle complète',
        'Coach IA 24/7',
        'Builder de recettes',
        'Tout illimité',
        'Nutriscores détaillés',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="px-4 py-6 border-b border-gray-700/30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                PhotoCalories
              </h1>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard?plan=free">
                <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white transition-all duration-300">
                  Essayer
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 md:py-20 flex flex-col justify-center">
          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                Scannez, analysez,<br />optimisez
              </span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Photographiez votre repas et laissez l'IA analyser vos calories et macronutriments en temps réel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard?plan=free">
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Commencer Gratuitement
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Preview */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-20 md:gap-6">
            {[
              { icon: Camera, label: 'Upload/Scan', desc: 'Photo ou code-barres' },
              { icon: Zap, label: 'Instant', desc: 'Analyse en 2s' },
              { icon: TrendingUp, label: 'Tracking', desc: 'Toutes les infos' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-xl mb-3 inline-block border border-blue-500/30 hover:border-blue-500/50 transition-all">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <p className="font-bold text-white text-sm md:text-base">{item.label}</p>
                <p className="text-gray-400 text-xs md:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Plans Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-3xl md:text-4xl font-black text-center mb-12">Choisissez votre plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan) => (
                <PlanCard key={plan.plan} {...plan} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="border-t border-gray-700/30 backdrop-blur-md py-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 PhotoCalories | 🚀 Powered by AI
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
