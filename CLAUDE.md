# Agents-Army Service - Claude Development Guide

## Project Overview

Remote orchestration service for the 8-agent content creation pipeline. Coordinates execution on DigitalOcean Gradient with job queuing, SSH coordination, and vault synchronization.

## Development Commands

### Setup
```bash
npm install
```

### Running
```bash
npm run dev          # Development with --watch
npm start            # Production
```

### Testing
```bash
npm test             # Run all tests once
npm run test:watch   # Watch mode
```

## Project Structure & Key Files

### Core Entry Points
- `src/index.js` - Server initialization and configuration
- `src/api/` - Express routes (health, workflows, jobs)
- `src/orchestrator/` - Workflow execution and state management
- `src/sync/` - Vault synchronization service
- `src/ssh/` - DigitalOcean Gradient remote execution

### Configuration
- Environment variables injected at startup (no .env files checked in)
- Key config constants in `src/config.js`
- Database/API patterns defined in parent CLAUDE.md

### Testing
- Tests in `tests/` directory using Node.js built-in test runner
- Pattern: `tests/**/*.test.js` glob
- No external test framework - use built-in `node:test`

## Architecture Patterns

### Job Queue (Bull + Redis)
- Queue for reliable job execution
- Handles retries, failures, and monitoring
- Redis connection via `REDIS_URL` environment variable

### SSH Coordination
- `ssh2` library for DigitalOcean Gradient access
- Private key auth (no passwords)
- Async execution with stdout/stderr capture

### Vault Sync
- Bidirectional sync between local vault and remote
- Triggered on workflow completion
- Handles file conflicts and checksums

### API Design
- Express.js with standard middleware
- Bearer JWT tokens for auth
- CORS enabled (wildcard - multiple first-party SPAs)
- No cookies, stateless authentication

## Non-Obvious Gotchas

1. **SSH Key Path**: Must be absolute path, relative paths fail
2. **Redis Connection**: Service won't start if Redis unavailable
3. **Gradient SSH**: Root user required by default
4. **Vault Sync**: Large files may timeout - implement chunking
5. **Job Retries**: Bull defaults to 3 retries - adjust in config

## Code Style & Conventions

- ES modules (type: "module" in package.json)
- Standard naming: camelCase for variables/functions
- Comment blocks for complex logic
- Error handling with try/catch
- Async/await for async operations

## Phase 0 Status

Initial repository structure complete:
- [ ] API endpoints implemented
- [ ] Orchestrator core logic
- [ ] SSH execution utilities
- [ ] Redis/Bull queue setup
- [ ] Vault sync service
- [ ] Integration tests

Next phase: Implement API server and orchestration layer.

## Related Documentation

- Parent conventions: `/Users/shayyahal/CLAUDE.md`
- Implementation plan: `docs/plans/` directory
- DigitalOcean Gradient docs: [link to be added]
