
interface RiskBadgeProps {
  level: 'critical' | 'medium' | 'low';
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const getBadgeStyle = () => {
    switch (level) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default:
        return 'bg-zinc-500/10 border-white/5 text-zinc-400';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border uppercase tracking-wider ${getBadgeStyle()}`}>
      {level}
    </span>
  );
}
