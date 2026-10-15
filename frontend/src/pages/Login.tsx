import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative cyber-grid">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-cyber-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 relative">
            <Shield className="w-8 h-8 text-cyber-accent" />
            <div className="absolute inset-0 bg-cyber-accent/20 blur-md rounded-2xl" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="text-sm text-zinc-400 mt-2">Sign in to monitor your digital safety score</p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyber-accent text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyber-accent text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 bg-white text-black hover:bg-cyber-accent transition-colors font-semibold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Session...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyber-accent hover:underline">
              Create one for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
