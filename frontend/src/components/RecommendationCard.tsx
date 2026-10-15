import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { Recommendation } from '../services/api';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onFix?: (id: string) => Promise<void>;
}

export default function RecommendationCard({ recommendation, onFix }: RecommendationCardProps) {
  const { id, platform, title, description, priority, fixed } = recommendation;
  const [fixing, setFixing] = useState(false);
  const [isDone, setIsDone] = useState(fixed);

  const getPriorityStyle = () => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-500/10 border-red-500/20 text-red-400',
          dot: 'bg-red-500'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          dot: 'bg-amber-500'
        };
      case 'low':
        return {
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          dot: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-zinc-500/10 border-white/5 text-zinc-400',
          dot: 'bg-zinc-500'
        };
    }
  };

  const handleFixClick = async () => {
    if (!onFix || isDone) return;
    setFixing(true);
    try {
      await onFix(id);
      setIsDone(true);
    } catch (e) {
      console.error('Error applying remediation:', e);
    } finally {
      setFixing(false);
    }
  };

  const pStyle = getPriorityStyle();

  return (
    <div className={`glass-panel p-5 rounded-xl border transition-all duration-300 ${
      isDone ? 'border-emerald-500/20 bg-emerald-500/[0.02] opacity-70' : 'border-white/5 hover:border-white/10'
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Platform tag */}
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono capitalize text-zinc-300">
            {platform}
          </span>
          {/* Priority indicator */}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border uppercase tracking-wider ${pStyle.bg}`}>
            <span className={`h-1 w-1 rounded-full ${pStyle.dot}`} />
            {priority} priority
          </span>
        </div>

        {isDone && (
          <span className="flex items-center gap-1 text-xs text-cyber-accent font-mono">
            <Check className="w-4 h-4" /> Resolved
          </span>
        )}
      </div>

      <h4 className={`text-sm font-bold ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>{title}</h4>
      <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{description}</p>

      {!isDone && onFix && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleFixClick}
            disabled={fixing}
            className="px-3.5 py-1.5 bg-zinc-900 border border-white/10 hover:border-cyber-accent hover:text-cyber-accent text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {fixing ? 'Applying...' : 'Lock Down Account'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
