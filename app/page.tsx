'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Zap, TrendingUp, Award, ArrowRight, Check, ChevronRight, BarChart3, Lock, Smartphone, Shield, Ruler, Pizza, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

      {/* Features Section - VISUAL CARDS */}
      <section id="features" className="py-32 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600">
              Une technologie puissante pour des résultats concrets
            </p>
          </div>

          {/* GRID OF VISUAL CARDS */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Détection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="relative bg-white rounded-3xl p-10 border border-gray-200 overflow-hidden group"
            >
              {/* Icon circle background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Détection instantanée
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Photographiez votre repas. Notre IA identifie automatiquement tous les aliments avec une précision de 95%.
                </p>
              </div>
            </motion.div>

            {/* Card 2 - Analyse */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="relative bg-white rounded-3xl p-10 border border-gray-200 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Analyse complète
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Calories, protéines, glucides, lipides, Nutri-Score. Toutes les informations nutritionnelles en un clin d'œil.
                </p>
              </div>
            </motion.div>

            {/* Card 3 - Suivi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="relative bg-white rounded-3xl p-10 border border-gray-200 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Suivi personnalisé
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Définissez vos objectifs. Suivez votre progression. Recevez des conseils adaptés à votre profil.
                </p>
              </div>
            </motion.div>

            {/* Card 4 - Sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="relative bg-white rounded-3xl p-10 border border-gray-200 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Sécurisé et privé
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Vos données sont chiffrées et protégées. Vous gardez le contrôle total sur vos informations.
                </p>
              </div>
            </motion.div>
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
