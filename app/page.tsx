'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Zap, TrendingUp, Award, ArrowRight, Sparkles, Star, Flame, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* CRAZY Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient meshes */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500 via-green-500 to-yellow-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full blur-3xl"
        />
        
        {/* Mouse follower glow */}
        <motion.div
          animate={{
            x: mousePosition.x - 200,
            y: mousePosition.y - 200,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="absolute w-[400px] h-[400px] bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Glassmorphism overlay */}
      <div className="fixed inset-0 backdrop-blur-[100px] bg-black/40" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: 'spring' }}
        className="relative z-50 container mx-auto px-6 py-8"
      >
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50"
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">PhotoCalories</span>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-white/10 backdrop-blur-xl rounded-2xl font-bold hover:bg-white/20 transition border-2 border-white/20 hover:border-white/40 shadow-xl"
          >
            Connexion
          </motion.button>
        </div>
      </motion.header>

      {/* HERO SECTION - ULTRA WILD */}
      <motion.div style={{ y: y1, opacity }} className="relative z-40 container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="flex items-center justify-center gap-4 mb-8 flex-wrap"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border-2 border-pink-400/30 shadow-2xl"
            >
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-bold text-pink-300">IA en 2 sec</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-green-500/20 backdrop-blur-xl rounded-full border-2 border-cyan-400/30 shadow-2xl"
            >
              <Star className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300">700k+ produits</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-full border-2 border-orange-400/30 shadow-2xl"
            >
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-bold text-orange-300">Précision 95%</span>
            </motion.div>
          </motion.div>

          {/* GIANT Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            className="text-6xl md:text-9xl font-black mb-8 leading-[0.9]"
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 via-cyan-400 via-green-400 to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Scanne.
            </motion.span>
            <br />
            <motion.span
              animate={{
                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-orange-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Connais.
            </motion.span>
            <br />
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block bg-gradient-to-r from-orange-400 via-red-400 via-pink-400 via-purple-400 to-orange-400 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Atteins.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-2xl md:text-4xl text-gray-200 mb-12 max-w-3xl mx-auto font-semibold"
          >
            L'IA qui 
            <span className="text-pink-400 font-black"> explose</span> tous les compteurs.
            <br />
            Plus de calculs. Que des 
            <span className="text-cyan-400 font-black">résultats</span>.
          </motion.p>

          {/* MEGA CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
            className="flex flex-col items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard?plan=free')}
              className="group relative px-16 py-7 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl font-black text-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all overflow-hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100"
              />
              <span className="relative z-10 flex items-center gap-3">
                🚀 COMMENCER GRATUITEMENT
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-gray-400 font-semibold"
            >
              ✨ Aucune CB • 2 scans gratuits/jour • Upgrade quand tu veux
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* FEATURES - FLOATING CARDS */}
      <motion.div style={{ y: y2 }} className="relative z-40 container mx-auto px-6 py-32">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black text-center mb-20"
        >
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Pourquoi c'est OUF?
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Camera,
              title: 'Scan en 2 sec',
              desc: 'Photo → IA → Nutrition. BOOM. Done.',
              gradient: 'from-pink-500 to-purple-500',
              color: 'pink',
            },
            {
              icon: TrendingUp,
              title: 'Précision 95%',
              desc: 'Clarifai AI + OpenFoodFacts. Les VRAIES données.',
              gradient: 'from-cyan-500 to-blue-500',
              color: 'cyan',
            },
            {
              icon: Award,
              title: 'Coach IA',
              desc: 'Objectifs sur mesure. Conseils 24/7. TON coach.',
              gradient: 'from-orange-500 to-red-500',
              color: 'orange',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
              className="relative p-10 bg-white/5 backdrop-blur-2xl rounded-[3rem] border-2 border-white/10 hover:border-white/30 transition-all group cursor-pointer overflow-hidden"
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-3xl`}
              />
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className={`relative w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-${feature.color}-500/50`}
              >
                <feature.icon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-black mb-4">{feature.title}</h3>
              <p className="text-xl text-gray-300 font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* PRICING - NEON CARDS */}
      <div className="relative z-40 container mx-auto px-6 py-32">
        <motion.h2
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-5xl md:text-7xl font-black text-center mb-8"
        >
          <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Choisis ton POWER
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl text-center text-gray-400 mb-20 font-semibold"
        >
          Commence gratuit. Upgrade quand t'es CHAUD 🔥
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => router.push('/dashboard?plan=free')}
            className="relative p-10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-2xl rounded-[3rem] border-2 border-gray-600/50 hover:border-gray-400/80 transition-all cursor-pointer overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
            
            <h3 className="text-3xl font-black mb-3">FREE</h3>
            <div className="text-6xl font-black mb-8">$0<span className="text-2xl text-gray-400">/mois</span></div>
            
            <ul className="space-y-4 mb-10">
              {['2 scans/jour', 'Calories', 'Historique 7j'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xl">
                  <span className="text-2xl">✨</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-lg transition">
              START FREE
            </button>
          </motion.div>

          {/* PRO - HIGHLIGHTED */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08, y: -15, rotateY: 5 }}
            onClick={() => router.push('/dashboard?plan=pro')}
            className="relative p-10 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 backdrop-blur-2xl rounded-[3rem] border-4 border-cyan-400/60 hover:border-cyan-400 transition-all cursor-pointer overflow-hidden group shadow-2xl shadow-cyan-500/50"
            style={{ perspective: 1000 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-2xl"
            />
            
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-black shadow-2xl"
            >
              🔥 POPULAIRE
            </motion.div>
            
            <h3 className="text-3xl font-black mb-3 mt-4">PRO</h3>
            <div className="text-6xl font-black mb-8">$4.99<span className="text-2xl text-gray-300">/mois</span></div>
            
            <ul className="space-y-4 mb-10">
              {['10 scans/jour', 'Macros complets', 'Historique 90j', 'Analytics'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xl">
                  <span className="text-2xl">✅</span>
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-black text-xl shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/80 transition"
            >
              UPGRADE PRO
            </motion.button>
          </motion.div>

          {/* FITNESS */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => router.push('/dashboard?plan=fitness')}
            className="relative p-10 bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-2xl rounded-[3rem] border-2 border-purple-400/60 hover:border-purple-400 transition-all cursor-pointer overflow-hidden group shadow-2xl shadow-purple-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition" />
            
            <h3 className="text-3xl font-black mb-3">FITNESS</h3>
            <div className="text-6xl font-black mb-8">$9.99<span className="text-2xl text-gray-300">/mois</span></div>
            
            <ul className="space-y-4 mb-10">
              {['40 scans/jour', 'TOUT!', 'Illimité', 'Coach IA', 'Strava sync'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xl">
                  <span className="text-2xl">🚀</span>
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 rounded-2xl font-black text-xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition">
              GO FITNESS
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-40 border-t border-white/10 mt-32">
        <div className="container mx-auto px-6 py-12 text-center">
          <motion.p
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            © 2025 PhotoCalories. Fait avec ❤️ et beaucoup de café ☕
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
