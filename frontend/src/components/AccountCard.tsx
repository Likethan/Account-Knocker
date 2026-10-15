import { ShieldCheck, ShieldAlert, ShieldAlert as ShieldWarning, Link2Off, ArrowUpRight } from 'lucide-react';
import type { ConnectedAccount } from '../services/api';

interface AccountCardProps {
  account: ConnectedAccount;
  onDisconnect?: (platform: string) => void;
  onConnect?: (platform: string) => void;
}

export default function AccountCard({ account, onDisconnect, onConnect }: AccountCardProps) {
  const { platform, status, last_checked } = account;

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: ShieldCheck,
          color: 'text-cyber-accent bg-emerald-500/10 border-emerald-500/20',
          label: 'Safe',
          dot: 'bg-cyber-accent'
        };
      case 'warning':
        return {
          icon: ShieldWarning,
          color: 'text-cyber-warning bg-amber-500/10 border-amber-500/20',
          label: 'Warning',
          dot: 'bg-cyber-warning'
        };
      case 'risk':
        return {
          icon: ShieldAlert,
          color: 'text-cyber-danger bg-red-500/10 border-red-500/20',
          label: 'Critical Risk',
          dot: 'bg-cyber-danger'
        };
      default:
        return {
          icon: Link2Off,
          color: 'text-zinc-500 bg-zinc-500/10 border-white/5',
          label: 'Disconnected',
          dot: 'bg-zinc-500'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="glass-panel p-5 rounded-xl border border-white/5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-base font-bold text-white capitalize">{platform}</h4>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
            Checked: {last_checked ? new Date(last_checked).toLocaleDateString() : 'Never'}
          </p>
        </div>
        
        {/* Status Badge */}
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${config.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
          {config.label}
        </span>
      </div>

      <div className="flex justify-between items-center mt-6">
        {status !== 'disconnected' ? (
          <>
            <span className="text-xs text-emerald-400/80 flex items-center gap-1">
              <StatusIcon className="w-3.5 h-3.5" />
              Connected
            </span>
            <button
              onClick={() => onDisconnect && onDisconnect(platform)}
              className="text-xs font-mono text-zinc-500 hover:text-cyber-danger transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={() => onConnect && onConnect(platform)}
            className="w-full py-2 bg-zinc-900 border border-white/10 hover:border-cyber-blue hover:text-cyber-blue text-xs text-zinc-400 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all group-hover:bg-zinc-800"
          >
            Connect Account
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
