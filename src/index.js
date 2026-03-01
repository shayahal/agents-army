// src/index.js
import express from 'express';
import { PORT, validateConfig } from './config.js';
import { apiKeyMiddleware } from './api/middleware.js';
import { setupRoutes } from './api/routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(apiKeyMiddleware);

// CORS: Wildcard per team convention
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
setupRoutes(app);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

export default app;

// Start server only if this file is run directly, not when imported as a module
if (import.meta.url === `file://${process.argv[1]}`) {
  validateConfig(); // Call validation only when starting server
  app.listen(PORT, () => {
    console.log(`Agents-Army service listening on port ${PORT}`);
  });
}
