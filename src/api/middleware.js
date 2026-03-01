// src/api/middleware.js
import { API_KEY_HASH } from '../config.js';
import crypto from 'crypto';

export function apiKeyMiddleware(req, res, next) {
  // Health check doesn't need auth
  if (req.path === '/health') {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.body?.apiKey;

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  // Hash the provided key and compare
  const providedHash = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');

  if (providedHash !== API_KEY_HASH) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}
