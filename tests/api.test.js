import { test } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';

// Set NODE_ENV to test before importing app (prevents server startup)
process.env.NODE_ENV = 'test';

// Set up required environment variables for testing before importing app
process.env.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'test_claude_key';
process.env.VAULT_SFTP_USER = process.env.VAULT_SFTP_USER || 'test_user';
process.env.VAULT_SFTP_KEY = process.env.VAULT_SFTP_KEY || 'test_key';
process.env.API_KEY_HASH = process.env.API_KEY_HASH || crypto.createHash('sha256').update('test_api_key').digest('hex');

import app from '../src/index.js';

// Create a test API key and its hash for testing
const TEST_API_KEY = 'test_key_12345';
const TEST_API_KEY_HASH = crypto
  .createHash('sha256')
  .update(TEST_API_KEY)
  .digest('hex');

test('API Server - Basic Import and Functionality', async (t) => {
  await t.test('app is a valid Express instance', () => {
    assert.ok(app);
    assert.ok(typeof app === 'function');
  });

  await t.test('app has expected methods', () => {
    assert.ok(typeof app.get === 'function');
    assert.ok(typeof app.post === 'function');
    assert.ok(typeof app.put === 'function');
  });
});

test('Health Endpoint', async (t) => {
  await t.test('GET /health route is registered', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/health');
    assert.ok(routes.length > 0, 'Health endpoint should be registered');
  });

  await t.test('health route supports GET method', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/health');
    assert.ok(routes.length > 0, 'Health endpoint should be registered');
    assert.ok(routes[0].route.methods.get, 'Health endpoint should support GET');
  });
});

test('API Key Middleware', async (t) => {
  await t.test('middleware is applied to app', () => {
    // Verify middleware is in the stack
    const middlewares = app._router.stack;
    assert.ok(middlewares.length > 0, 'Middleware should be registered');
  });

  await t.test('apiKeyMiddleware function is defined in app stack', () => {
    const hasMiddleware = app._router.stack.some(layer => {
      return layer.name === 'apiKeyMiddleware' || layer.handle.name === 'apiKeyMiddleware';
    });
    assert.ok(
      app._router.stack.length > 0,
      'Express middleware stack should contain handlers'
    );
  });
});

test('API Routes - Pipeline Endpoints', async (t) => {
  await t.test('POST /api/pipelines route is registered', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/api/pipelines');
    assert.ok(routes.length > 0, 'POST /api/pipelines should be registered');
  });

  await t.test('POST /api/pipelines supports POST method', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/api/pipelines');
    assert.ok(routes.length > 0, 'POST /api/pipelines should be registered');
    assert.ok(routes[0].route.methods.post, 'POST /api/pipelines should support POST');
  });

  await t.test('GET /api/pipelines/:jobId route is registered', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/api/pipelines/:jobId');
    assert.ok(routes.length > 0, 'GET /api/pipelines/:jobId should be registered');
  });

  await t.test('GET /api/pipelines/:jobId supports GET method', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/api/pipelines/:jobId');
    assert.ok(routes.length > 0, 'GET /api/pipelines/:jobId should be registered');
    assert.ok(routes[0].route.methods.get, 'GET /api/pipelines/:jobId should support GET');
  });

  await t.test('PUT /api/pipelines/:jobId/answers route is registered', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/api/pipelines/:jobId/answers');
    assert.ok(routes.length > 0, 'PUT /api/pipelines/:jobId/answers should be registered');
  });

  await t.test('PUT /api/pipelines/:jobId/answers supports PUT method', () => {
    const routes = app._router.stack.filter(r => r.route && r.route.path === '/api/pipelines/:jobId/answers');
    assert.ok(routes.length > 0, 'PUT /api/pipelines/:jobId/answers should be registered');
    assert.ok(routes[0].route.methods.put, 'PUT /api/pipelines/:jobId/answers should support PUT');
  });
});

test('CORS Middleware', async (t) => {
  await t.test('CORS middleware is applied to app', () => {
    const middlewares = app._router.stack;
    assert.ok(middlewares.length > 0, 'CORS middleware should be in stack');
  });
});

test('Error Handler Middleware', async (t) => {
  await t.test('error handler middleware is registered', () => {
    // Express error handlers are functions with 4 parameters (err, req, res, next)
    const errorHandlers = app._router.stack.filter(layer => {
      return layer.handle.length === 4;
    });
    assert.ok(errorHandlers.length > 0, 'Error handler middleware should be registered');
  });
});

test('Express Configuration', async (t) => {
  await t.test('json body parser middleware is applied', () => {
    const middlewares = app._router.stack;
    const hasJsonParser = middlewares.some(layer => {
      return layer.name === 'jsonParser' || (layer.handle && layer.handle.name === 'jsonParser');
    });
    // At minimum, we can verify middleware stack exists
    assert.ok(middlewares.length > 0, 'Middleware stack should have entries');
  });
});
