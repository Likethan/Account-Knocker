import React, { useState } from 'react';
import { ShieldAlert, Search, CheckCircle, AlertTriangle, Key } from 'lucide-react';

export const BreachChecker: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulated probe
    setTimeout(() => {
      const isKnown = email.toLowerCase().includes('leak') || email.toLowerCase().includes('test');
      if (isKnown) {
        setResult({
          breached: true,
          count: 2,
          incidents: ['Collection #1 Database Exposure (2019)', 'Third-Party SaaS Leak (2022)'],
          advice: 'Change master passwords and enable 2FA on all associated platforms immediately.'
        });
      } else {
        setResult({
          breached: false,
          count: 0,
          incidents: [],
          advice: 'No publicly disclosed exposure incidents associated with this address.'
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="w-8 h-8 text-cyber-accent" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Data Breach Intelligence</h1>
          <p className="text-zinc-400 text-sm">Query your email to detect known public credential leaks.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="email"
          placeholder="Enter email to scan..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyber-accent"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-cyber-accent text-black font-semibold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Scanning...' : 'Scan Now'}
        </button>
      </form>

      {result && (
        <div className={`p-6 rounded-xl border backdrop-blur-md ${result.breached ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
          <div className="flex items-center gap-3 mb-4">
            {result.breached ? (
              <AlertTriangle className="w-6 h-6 text-red-400" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            )}
            <h2 className="text-lg font-semibold text-white">
              {result.breached ? `Compromised in ${result.count} Known Breaches` : 'Clean Record Detected'}
            </h2>
          </div>

          <p className="text-zinc-300 text-sm mb-4">{result.advice}</p>

          {result.incidents.length > 0 && (
            <ul className="space-y-2">
              {result.incidents.map((incident: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-xs font-mono text-red-300 bg-red-950/40 px-3 py-2 rounded">
                  <Key className="w-3.5 h-3.5" />
                  {incident}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BreachChecker;
