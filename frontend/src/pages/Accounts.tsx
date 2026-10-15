import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AccountCard from '../components/AccountCard';
import { accountService } from '../services/api';
import type { ConnectedAccount } from '../services/api';
import { Key, HelpCircle, Loader2 } from 'lucide-react';

export default function Accounts() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (e) {
      console.error('Failed to load accounts:', e);
      // Mock defaults for development
      setAccounts([
        { id: 1, platform: 'google', status: 'connected', connected_date: '', last_checked: new Date().toISOString() },
        { id: 2, platform: 'spotify', status: 'connected', connected_date: '', last_checked: new Date().toISOString() },
        { id: 3, platform: 'discord', status: 'disconnected', connected_date: '', last_checked: '' },
        { id: 4, platform: 'github', status: 'disconnected', connected_date: '', last_checked: '' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();

    // Check URL parameters for OAuth status callbacks
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      setToast({ message: 'Successfully connected account!', type: 'success' });
      // Remove query parameters from URL without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('error')) {
      const errorMsg = params.get('error') === 'invalid_session' 
        ? 'OAuth session could not be verified. Please try again.'
        : 'Failed to connect account via OAuth.';
      setToast({ message: errorMsg, type: 'error' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnect = async (platform: string) => {
    setActioning(platform);
    try {
      const data = await accountService.getOAuthUrl(platform);
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        await accountService.mockConnect(platform);
        await loadAccounts();
      }
    } catch (e) {
      console.error('OAuth url fetch failed, trying mockConnect fallback:', e);
      try {
        await accountService.mockConnect(platform);
        await loadAccounts();
      } catch (err) {
        console.error('Mock connect failed, trying fallback updates:', err);
        // Local fallback simulation
        setAccounts(prev => prev.map(acc => 
          acc.platform === platform 
            ? { ...acc, status: 'connected', last_checked: new Date().toISOString() } 
            : acc
        ));
      }
    } finally {
      setActioning(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    setActioning(platform);
    try {
      await accountService.disconnectPlatform(platform);
      await loadAccounts();
    } catch (e) {
      console.error('Disconnect failed, fallback updates:', e);
      // Local fallback simulation
      setAccounts(prev => prev.map(acc => 
        acc.platform === platform 
          ? { ...acc, status: 'disconnected', last_checked: '' } 
          : acc
      ));
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Connected Accounts</h2>
            <p className="text-xs text-zinc-400 mt-1">Manage linked social, email, and developer platforms</p>
          </div>

          {toast && (
            <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-cyber-accent' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              <span className="flex items-center gap-2">
                {toast.type === 'success' ? '✔' : '⚠️'} {toast.message}
              </span>
              <button 
                onClick={() => setToast(null)}
                className="text-zinc-500 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Alert panel regarding security permissions */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-zinc-900/30 flex gap-4">
            <div className="p-3 rounded-xl bg-cyber-blue/10 text-cyber-blue shrink-0 h-fit">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Authorization Details</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Account Knocker uses standard OAuth to authenticate. We do not obtain your passwords. 
                Our API only scans settings configurations (e.g. MFA toggle state, third-party apps with high authorizations, recovery contacts) 
                to determine score factors. You can revoke credentials at any time.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-zinc-500 font-mono text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyber-blue" />
              <span>Fetching connected credentials...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accounts.map(acc => (
                <div key={acc.platform} className="relative">
                  {actioning === acc.platform && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-xl z-20 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-cyber-accent" />
                    </div>
                  )}
                  <AccountCard 
                    account={acc}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Future roadmap card */}
          <div className="border border-dashed border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <HelpCircle className="w-8 h-8 text-zinc-600 mb-3" />
            <h4 className="text-sm font-semibold text-zinc-300">More Platforms Coming Soon</h4>
            <p className="text-[11px] text-zinc-500 max-w-sm mt-1 leading-relaxed">
              We are working to support Microsoft, Slack, LinkedIn, banking integrations, and AWS console audits.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
