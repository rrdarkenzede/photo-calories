'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Zap, TrendingUp, ChefHat, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const PlanCard = ({ plan, icon: Icon, price, features, highlight }: any) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: highlight ? 1 : 1.05, y: -5 }}
    className={`rounded-2xl border-2 p-8 transition-all duration-300 group ${
      highlight
        ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl ring-2 ring-blue-300/50'
        : 'border-gray-200 bg-white shadow-lg hover:shadow-xl'
    }`}
  >
    {highlight && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
          <Sparkles className="w-4 h-4" />
          Populaire
        </div>
      </div>
    )}

    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 capitalize mb-2">{plan}</h3>
        {price && <p className="text-sm font-semibold text-gray-600">{price}</p>}
      </div>
      <div className={`p-3 rounded-lg bg-gradient-to-br ${
        plan === 'fitness' 
          ? 'from-orange-200 to-pink-200' 
          : plan === 'pro' 
          ? 'from-blue-200 to-cyan-200' 
          : 'from-gray-200 to-gray-300'
      }`}>
        <Icon className={`w-6 h-6 ${
          plan === 'fitness' ? 'text-orange-600' : plan === 'pro' ? 'text-blue-600' : 'text-gray-600'
        }`} />
      </div>
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature: any, i: number) => (
        <li key={i} className="text-gray-700 flex items-start gap-3">
          <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
            plan === 'fitness' ? 'bg-orange-500' : plan === 'pro' ? 'bg-blue-500' : 'bg-gray-500'
          }`} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <Link href={`/dashboard?plan=${plan}`}>
      <button className={`w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
        highlight
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
          : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 hover:from-gray-300 hover:to-gray-400'
      }`}>
        Commencer
      </button>
    </Link>
  </motion.div>
);

export default function Home() {
  const plans = [
    {
      plan: 'free',
      icon: Smartphone,
      price: 'Gratuit',
      features: [
        '📸 Upload photo',
        '🔥 Calories',
        '📅 Historique 7 jours',
      ],
    },
    {
      plan: 'pro',
      icon: TrendingUp,
      price: 'Illimité',
      features: [
        '🔥 Calories + Macros',
        '📊 Analytics',
        '📅 Historique illimité',
        '📱 Scan code-barres',
      ],
      highlight: true,
    },
    {
      plan: 'fitness',
      icon: ChefHat,
      price: 'Premium',
      features: [
        '✨ TOUT illimité',
        '🤖 Coach IA 24/7',
        '👨‍🍳 Recipe Builder',
        '📊 Nutritional Analysis',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
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
        <motion.header variants={itemVariants} className="px-4 py-6 border-b-2 border-gray-200/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black gradient-text">
                Bonjour Kamal
              </h1>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard?plan=free">
                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold text-white transition-all duration-300 shadow-lg">
                  Essayer
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 md:py-20 flex flex-col justify-center">
          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">
                Scannez votre plat<br />
              </span>
              <span className="text-gray-900">
                et optimisez votre nutrition
              </span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Photographiez votre repas et laissez l'IA analyser les calories et macronutriments en temps réel.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard?plan=free">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Commencer Maintenant
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Preview */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-20 md:gap-6">
            {[
              { icon: Camera, label: 'Upload', desc: 'Photo ou code' },
              { icon: Zap, label: 'Instant', desc: '2 secondes' },
              { icon: TrendingUp, label: 'Track', desc: 'Toutes les infos' },
            ].map((item, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-xl mb-3 inline-block border-2 border-blue-200 hover:border-blue-400 transition-all">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-bold text-gray-900 text-sm md:text-base">{item.label}</p>
                <p className="text-gray-500 text-xs md:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Plans Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-3xl md:text-4xl font-black text-center mb-12 text-gray-900">Choisissez votre plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan) => (
                <PlanCard key={plan.plan} {...plan} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="border-t-2 border-gray-200/50 backdrop-blur-sm py-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 PhotoCalories | Powered by AI 🚀
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
