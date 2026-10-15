import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface SecurityCardProps {
  score: number;
}

export default function SecurityCard({ score }: SecurityCardProps) {
  // Determine status color and label
  let statusColor = 'text-cyber-accent';
  let strokeColor = '#00ff88';
  let statusText = 'Excellent';
  let statusDesc = 'Your digital defenses are solid.';
  let Icon = ShieldCheck;

  if (score < 50) {
    statusColor = 'text-cyber-danger';
    strokeColor = '#ff4444';
    statusText = 'Critical Risk';
    statusDesc = 'Immediate action required.';
    Icon = ShieldAlert;
  } else if (score < 80) {
    statusColor = 'text-cyber-warning';
    strokeColor = '#ffbb00';
    statusText = 'Medium Exposure';
    statusDesc = 'Several improvements recommended.';
    Icon = Shield;
  }

  // Circle calculations
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-accent to-cyber-blue" />
      
      <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider mb-6">Digital Safety Score</h3>
      
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            className="text-zinc-900"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight">{score}</span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">of 100</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className={`w-5 h-5 ${statusColor}`} />
          <span className={`text-lg font-bold ${statusColor}`}>{statusText}</span>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs">{statusDesc}</p>
      </div>
    </div>
  );
}
