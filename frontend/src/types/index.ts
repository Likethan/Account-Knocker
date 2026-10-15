export type RiskLevel = 'Safe' | 'Good' | 'Medium' | 'Critical';

export type PlatformType = 'google' | 'spotify' | 'discord' | 'github' | 'system';

export type AccountStatus = 'connected' | 'warning' | 'risk' | 'disconnected';

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface ConnectedAccount {
  id: number;
  platform: string;
  status: AccountStatus;
  username?: string;
  connected_at: string;
  last_audited?: string;
}

export interface RiskItem {
  type: 'critical' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface Recommendation {
  id: string;
  platform: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  fixed: boolean;
}

export interface SecurityScoreReport {
  score: number;
  risk_level: RiskLevel;
  risks: RiskItem[];
  recommendations: Recommendation[];
  audited_at: string;
}

export interface ChatMessage {
  id?: number;
  sender: 'user' | 'assistant';
  message: string;
  timestamp?: string;
}
