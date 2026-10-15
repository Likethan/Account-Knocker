import { RiskLevel } from '../types';

/**
 * Returns tailored cyber color classes based on the risk level.
 */
export function getRiskColorClass(level: RiskLevel): string {
  switch (level) {
    case 'Safe':
      return 'text-cyber-accent border-cyber-accent/40 bg-cyber-accent/10';
    case 'Good':
      return 'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10';
    case 'Medium':
      return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
    case 'Critical':
      return 'text-cyber-red border-cyber-red/40 bg-cyber-red/10';
    default:
      return 'text-zinc-400 border-zinc-600 bg-zinc-800';
  }
}

/**
 * Formats ISO timestamps into human-readable relative time strings.
 */
export function formatTimestamp(isoString?: string): string {
  if (!isoString) return 'Just now';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Maps numeric score (0-100) to corresponding safety badge title.
 */
export function getScoreBadgeTitle(score: number): string {
  if (score >= 90) return 'Cyber Guardian';
  if (score >= 75) return 'Security Master';
  if (score >= 50) return 'Vigilant Defender';
  return 'Vulnerable Explorer';
}
