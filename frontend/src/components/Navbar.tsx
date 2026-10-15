import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="w-8 h-8 text-cyber-accent transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-cyber-accent/20 blur-lg rounded-full animate-cyber-pulse" />
          </div>
          <span className="font-sans font-bold text-lg tracking-wider bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ACCOUNT KNOCKER
          </span>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-6">
          {/* Status Alert Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM SAFE
          </div>

          {/* User Profile & Badge */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-cyber-text">{user.name}</p>
              <p className="text-xs font-mono text-cyber-accent">{user.defense_level || 'Beginner Defender'}</p>
            </div>
            
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyber-accent to-cyber-blue flex items-center justify-center font-bold text-black shadow-inner">
              {user.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout}
              className="p-2 rounded-lg text-zinc-400 hover:text-cyber-danger hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {!user && (
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-cyber-accent hover:text-black transition-all font-semibold hover:shadow-lg hover:shadow-emerald-500/20">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
