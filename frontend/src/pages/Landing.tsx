import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Key, CheckCircle, Smartphone, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const partners = [
    { name: 'Google', icon: Shield, desc: 'OAuth Security Verification' },
    { name: 'Spotify', icon: Key, desc: 'App Permission Audit' },
    { name: 'Discord', icon: Smartphone, desc: 'MFA Status & Tokens' },
    { name: 'GitHub', icon: GithubIcon, desc: 'OAuth & Access Revocation' }
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden cyber-grid">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyber-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyber-blue/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Animated Badge */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyber-accent text-xs font-mono mb-8 glow-green"
          >
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            POWERED BY GEMINI 2.5 FLASH
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent max-w-4xl leading-tight"
          >
            Your Personal AI <br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-blue bg-clip-text text-transparent">
              Cybersecurity Guardian
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
          >
            Monitor, analyze and improve your digital safety with Knock AI. Scan your connected platforms, pinpoint vulnerability patterns, and lock down your web footprint.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-cyber-accent transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              Start Security Scan
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-white/15 text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              Connect Accounts
            </Link>
          </motion.div>

          {/* Core Feature Section: How It Works */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl"
          >
            <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-accent/5 rounded-full blur-2xl group-hover:bg-cyber-accent/10 transition-all" />
              <div className="w-12 h-12 rounded-lg bg-cyber-accent/15 flex items-center justify-center text-cyber-accent mb-4">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">1. Connect Accounts</h3>
              <p className="text-sm text-zinc-400">
                Securely grant access credentials via industry-standard OAuth authentication protocols. No password sharing required.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/5 rounded-full blur-2xl group-hover:bg-cyber-blue/10 transition-all" />
              <div className="w-12 h-12 rounded-lg bg-cyber-blue/15 flex items-center justify-center text-cyber-blue mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">2. Analyze Posture</h3>
              <p className="text-sm text-zinc-400">
                Our rule-based engine scores security postures, flags missing MFA setups, lists stale permissions, and maps vulnerabilities.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
              <div className="w-12 h-12 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">3. Converse with Knock AI</h3>
              <p className="text-sm text-zinc-400">
                Get real-time insights, interactive step-by-step mitigation plans, and personalized guidance from your security coach.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Supported Platforms Section */}
      <div className="border-t border-white/5 bg-zinc-950/60 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Supported Platforms</h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-12">
            Securely auditable configurations are available for primary productivity and developer environments.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {partners.map((partner) => (
              <div key={partner.name} className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center">
                <partner.icon className="w-8 h-8 text-zinc-400 mb-3" />
                <span className="text-sm font-semibold">{partner.name}</span>
                <span className="text-[10px] font-mono text-zinc-500 mt-1">{partner.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Scoring Visual Section */}
      <div className="border-t border-white/5 bg-zinc-900/40 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-cyber-blue text-xs font-mono rounded-full w-fit mb-6">
              REAL-TIME INSIGHTS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Advanced Risk Scoring & Mitigation Plans
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-6">
              Account Knocker evaluates key safety markers to determine your digital threat exposure. Our algorithm measures factors like:
            </p>
            <ul className="space-y-3 font-medium text-sm">
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle className="w-4 h-4 text-cyber-accent" /> Multi-factor Authentication status
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle className="w-4 h-4 text-cyber-accent" /> Expiring and obsolete app permissions
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <CheckCircle className="w-4 h-4 text-cyber-accent" /> Insecure legacy authentication methods
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center glow-blue">
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#00ff88" strokeWidth="8" fill="transparent"
                  strokeDasharray="251.2" strokeDashoffset="45" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold tracking-tight">82</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Good Status</span>
              </div>
            </div>
            <div className="w-full border-t border-white/5 pt-4 flex justify-between text-xs font-mono text-zinc-400">
              <div>Critical Risks: <span className="text-red-400">0</span></div>
              <div>Medium Risks: <span className="text-yellow-400">2</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 bg-zinc-950 text-center relative z-10 text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Account Knocker. All rights reserved.</p>
          <p className="font-mono text-[10px]">KNOW YOUR DIGITAL SECURITY BEFORE ATTACKERS DO.</p>
        </div>
      </footer>
    </div>
  );
}
