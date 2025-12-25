'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      id: 1,
      icon: '📸',
      title: 'AI Photo Recognition',
      description: 'Identify foods instantly with advanced computer vision technology',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      icon: '📊',
      title: 'Nutrition Tracking',
      description: 'Track calories, macros, and micronutrients with precision',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      icon: '💪',
      title: 'Fitness Integration',
      description: 'Sync with your fitness data and set personalized goals',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 4,
      icon: '📈',
      title: 'Progress Analytics',
      description: 'Visualize your health journey with detailed analytics',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-gradient { animation: gradient-shift 3s ease infinite; background-size: 200% 200%; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-delay { animation: fadeIn 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-fade-in-delay-2 { animation: fadeIn 0.8s ease-out 0.4s forwards; opacity: 0; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            <span className="text-3xl">🍽️</span> PhotoCalories
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-slate-300 hover:text-white transition-colors">Stats</a>
            <a href="#cta" className="text-slate-300 hover:text-white transition-colors">Get Started</a>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20">
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6 inline-block animate-fade-in">
            <span className="text-sm font-semibold text-cyan-400 bg-cyan-400/10 px-4 py-2 rounded-full border border-cyan-400/30">
              ✨ AI-Powered Nutrition Tracking
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Transform Food Photos Into
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Nutritional Insights
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
            Simply snap a photo of your meal and get instant nutritional analysis powered by advanced AI technology. Track your health journey effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <button className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 relative overflow-hidden">
              <span className="relative z-10">Start Scanning 📸</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            <button className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:border-cyan-300 hover:text-cyan-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 animate-fade-in">
              Powerful Features at Your Fingertips
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto animate-fade-in-delay">
              Everything you need for comprehensive nutrition tracking and health management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="group relative h-full animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card border glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-all duration-300`}></div>

                {/* Card */}
                <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 h-full flex flex-col hover:shadow-2xl hover:shadow-cyan-500/20">
                  {/* Icon */}
                  <div className={`text-5xl mb-4 transition-all duration-300 transform ${hoveredCard === feature.id ? 'scale-125 animate-float' : 'scale-100'}`}>
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {/* Bottom accent */}
                  <div className={`mt-6 h-1 bg-gradient-to-r ${feature.color} rounded-full transform origin-left transition-all duration-300 ${hoveredCard === feature.id ? 'scale-x-100' : 'scale-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500K+', label: 'Foods Recognized' },
              { number: '1M+', label: 'Users Tracked' },
              { number: '99.9%', label: 'Accuracy Rate' },
              { number: '24/7', label: 'AI Support' },
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Take a Photo', desc: 'Snap a picture of your food', icon: '📸' },
              { step: 2, title: 'AI Analyzes', desc: 'Advanced AI identifies and analyzes', icon: '🤖' },
              { step: 3, title: 'Get Insights', desc: 'Receive detailed nutritional data', icon: '✨' },
            ].map((item, i) => (
              <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-cyan-400/50 transition-all duration-300">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-5xl font-bold text-cyan-400 mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-6 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-slate-400 mb-8 animate-fade-in-delay">
            Join thousands of users who are tracking their nutrition with AI precision
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50">
              Start Free Trial
            </button>
            <button className="border-2 border-slate-400 hover:border-white text-slate-300 hover:text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PhotoCalories</h3>
              <p className="text-slate-400 text-sm">AI-powered nutrition tracking</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 PhotoCalories. All rights reserved. Built with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
