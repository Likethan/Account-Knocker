import axios from 'axios';

// Base URL configuration - check if env variable is defined or default to local FastAPI dev port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired auth session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not on auth screens, we could redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  defense_level?: string;
  defense_score?: number;
}

export interface ConnectedAccount {
  id: number;
  platform: string;
  status: 'connected' | 'disconnected' | 'risk' | 'warning';
  connected_date: string;
  last_checked: string;
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

export interface SecurityReport {
  id: number;
  security_score: number;
  risk_level: 'Critical' | 'Medium' | 'Safe' | 'Good';
  issues_found: RiskItem[];
  recommendations: Recommendation[];
  created_at: string;
}

export interface SecurityTimelinePoint {
  month: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

// API Services
export const authService = {
  register: async (name: string, email: string, password: string) => {
    const res = await api.post('/api/register', { name, email, password });
    return res.data; // Expected: { token: string, user: User }
  },
  login: async (email: string, password: string) => {
    const res = await api.post('/api/login', { email, password });
    return res.data; // Expected: { token: string, user: User }
  },
  me: async () => {
    const res = await api.get<User>('/api/me');
    return res.data;
  }
};

export const accountService = {
  getAccounts: async () => {
    const res = await api.get<ConnectedAccount[]>('/api/accounts');
    return res.data;
  },
  connectPlatform: async (platform: string, details?: any) => {
    const res = await api.post(`/api/connect/${platform}`, details || {});
    return res.data;
  },
  getOAuthUrl: async (platform: string) => {
    const res = await api.get<{ url: string; demo_mode: boolean }>(`/api/oauth/${platform}/url`);
    return res.data;
  },
  mockConnect: async (platform: string) => {
    const res = await api.post('/api/accounts/mock-connect', { platform });
    return res.data;
  },
  disconnectPlatform: async (platform: string) => {
    const res = await api.delete(`/api/connect/${platform}`);
    return res.data;
  }
};

export const securityService = {
  analyze: async (accountsData?: any) => {
    const res = await api.post<SecurityReport>('/api/analyze', accountsData || {});
    return res.data;
  },
  getReports: async () => {
    const res = await api.get<SecurityReport[]>('/api/reports');
    return res.data;
  },
  getTimeline: async () => {
    const res = await api.get<SecurityTimelinePoint[]>('/api/score/history');
    return res.data;
  },
  resolveRecommendation: async (id: string) => {
    const res = await api.post<{ message: string }>(`/api/recommendations/${id}/resolve`);
    return res.data;
  }
};

export const chatService = {
  sendMessage: async (message: string) => {
    const res = await api.post<{ response: string }>('/api/chat', { message });
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get<ChatMessage[]>('/api/chat/history');
    return res.data;
  }
};
