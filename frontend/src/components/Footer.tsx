import React from 'react';
import { Shield, Heart, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950/80 py-8 px-6 text-zinc-500 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-accent" />
          <span className="font-semibold text-zinc-300">Account Knocker</span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">v1.0.0</span>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-cyber-red fill-current inline mx-0.5" />
          <span>for personal cybersecurity and digital autonomy</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Engines Operational
          </span>
          <a
            href="https://github.com/Likethan/Account-Knocker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <Terminal className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
