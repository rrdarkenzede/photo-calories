'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Zap, TrendingUp, Award, ArrowRight, Check, ChevronRight, BarChart3, Lock, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PhotoCalories</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Fonctionnalités</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Tarifs</a>
              <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">FAQ</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Connexion
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard?plan=free')}
                className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
              >
                Essayer gratuitement
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8"
            >
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Détection IA en 2 secondes</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Suivez votre nutrition
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                avec intelligence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Scannez vos repas. Obtenez instantanément calories, macros et nutriments.
              <br className="hidden md:block" />
              L'intelligence artificielle au service de votre santé.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard?plan=free')}
                className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition flex items-center gap-2 shadow-lg"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-900 hover:bg-gray-50 transition"
              >
                Voir les tarifs
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Aucune carte bancaire requise • 2 scans gratuits par jour
            </p>
          </motion.div>

          {/* Hero Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center p-12">
                  <Camera className="w-24 h-24 text-blue-600 mx-auto mb-6" />
                  <p className="text-2xl font-bold text-gray-900 mb-2">Interface intuitive</p>
                  <p className="text-gray-600">Scannez, analysez, progressez</p>
                </div>
              </div>
            </div>
            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">450 kcal</p>
                  <p className="text-sm text-gray-600">Détecté en 2s</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -right-8 bottom-1/4 bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Objectif atteint</p>
                  <p className="text-sm text-gray-600">-2kg ce mois</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '700,000+', label: 'Produits reconnus' },
              { value: '95%', label: 'Précision IA' },
              { value: '2 sec', label: 'Temps de scan' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600">
              Une technologie puissante pour des résultats concrets
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                icon: Camera,
                title: 'Détection instantanée',
                description: 'Photographiez votre repas. Notre IA identifie automatiquement tous les aliments avec une précision de 95%.',
                color: 'blue',
              },
              {
                icon: BarChart3,
                title: 'Analyse complète',
                description: 'Calories, protéines, glucides, lipides, Nutri-Score. Toutes les informations nutritionnelles en un clin dœil.',
                color: 'cyan',
              },
              {
                icon: TrendingUp,
                title: 'Suivi personnalisé',
                description: 'Définissez vos objectifs. Suivez votre progression. Recevez des conseils adaptés à votre profil.',
                color: 'green',
              },
              {
                icon: Lock,
                title: 'Sécurisé et privé',
                description: 'Vos données sont chiffrées et protégées. Vous gardez le contrôle total sur vos informations.',
                color: 'purple',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-gray-600">
              Commencez gratuitement, upgradez quand vous êtes prêt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FREE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['2 scans par jour', 'Calories uniquement', 'Historique 7 jours'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push('/dashboard?plan=free')}
                className="w-full py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition"
              >
                Commencer gratuitement
              </button>
            </motion.div>

            {/* PRO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-3xl p-8 border-2 border-gray-900 relative shadow-2xl scale-105"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                Populaire
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$4.99</span>
                <span className="text-gray-400">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['10 scans par jour', 'Macros détaillés (P/G/L)', 'Historique 90 jours', 'Export de données', 'Analytics avancés'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push('/dashboard?plan=pro')}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
              >
                Essayer Pro
              </button>
            </motion.div>

            {/* FITNESS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fitness</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-600">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['40 scans par jour', 'Toutes les données nutritionnelles', 'Historique illimité', 'Coach IA 24/7', 'Sync fitness apps', 'Recettes personnalisées'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push('/dashboard?plan=fitness')}
                className="w-full py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition"
              >
                Essayer Fitness
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Prêt à transformer votre nutrition ?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Rejoignez des milliers d'utilisateurs qui atteignent leurs objectifs avec PhotoCalories.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard?plan=free')}
              className="px-12 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition shadow-lg text-lg"
            >
              Commencer gratuitement
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">PhotoCalories</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 PhotoCalories. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">Confidentialité</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">CGU</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
