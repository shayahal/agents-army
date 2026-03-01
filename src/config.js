// src/config.js
// All environment variables injected at deploy time by CI/CD pipeline

export const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
export const VAULT_SFTP_HOST = process.env.VAULT_SFTP_HOST || 'localhost';
export const VAULT_SFTP_USER = process.env.VAULT_SFTP_USER;
export const VAULT_SFTP_KEY = process.env.VAULT_SFTP_KEY;
export const VAULT_SFTP_PATH = '/Documents/Shay/Agents-Army';
export const API_KEY_HASH = process.env.API_KEY_HASH;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
export const MONTHLY_BUDGET = 10.00; // dollars
export const MAX_CONCURRENT_PIPELINES = 5;
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Token limits per agent (cost control)
export const TOKEN_LIMITS = {
  input_max: 4000,
  output_max: 2000,
};

// Claude API configuration
export const CLAUDE_MODEL = 'claude-3-5-haiku-20241022';
export const CLAUDE_TEMPERATURE = 0.7;

// Job queue configuration
export const QUEUE_SETTINGS = {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: false,
    removeOnFail: false,
  },
};

// Validate required environment variables on startup
export function validateConfig() {
  const required = [
    'CLAUDE_API_KEY',
    'VAULT_SFTP_USER',
    'VAULT_SFTP_KEY',
    'API_KEY_HASH',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
