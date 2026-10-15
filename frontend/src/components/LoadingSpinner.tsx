import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div
        className={`${sizeMap[size]} border-zinc-700 border-t-cyber-accent rounded-full animate-spin glow-green`}
      />
      {label && <p className="text-sm font-mono text-zinc-400 tracking-wider animate-pulse">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
