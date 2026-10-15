export const SUPPORTED_PLATFORMS = [
  {
    id: 'google',
    name: 'Google Account',
    description: 'Master account security, login geolocation, and password hygiene',
    color: '#EA4335'
  },
  {
    id: 'github',
    name: 'GitHub Developer',
    description: 'SSH key access, personal access tokens (PATs), and 2FA enforcement',
    color: '#24292e'
  },
  {
    id: 'discord',
    name: 'Discord Community',
    description: 'Bot token permissions, OAuth integrations, and authenticator app checks',
    color: '#5865F2'
  },
  {
    id: 'spotify',
    name: 'Spotify Music',
    description: 'Third-party connected apps and credential aging analysis',
    color: '#1DB954'
  }
];

export const SCORE_THRESHOLDS = {
  SAFE: 85,
  GOOD: 70,
  MEDIUM: 50,
  CRITICAL: 0
};
