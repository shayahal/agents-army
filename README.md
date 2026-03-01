# Agents-Army

Remote orchestration service for the 8-agent content creation pipeline on DigitalOcean Gradient.

## Overview

This service coordinates the execution of an 8-agent content creation workflow across DigitalOcean Gradient compute resources. It provides:

- **API Server**: REST API for triggering and monitoring agent executions
- **Orchestrator**: Manages workflow execution, state, and inter-agent communication
- **Job Queue**: Bull/Redis-based task queue for reliable job execution
- **SSH Coordination**: Remote execution and monitoring on Gradient
- **Sync Service**: Bidirectional vault and artifact synchronization

## Architecture

```
┌─────────────────────────────────────┐
│         API Server (Express)        │  Port 3000
├─────────────────────────────────────┤
│      Orchestration Layer            │
│  ┌──────────────────────────────┐   │
│  │  Job Queue (Bull + Redis)    │   │
│  │  Workflow State Management   │   │
│  └──────────────────────────────┘   │
├─────────────────────────────────────┤
│   SSH Execution + Remote Monitoring │
│   DigitalOcean Gradient (8 agents)  │
└─────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 18+
- Redis (for job queue)
- SSH access to DigitalOcean Gradient

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the server in watch mode on port 3000.

### Production

```bash
npm start
```

## Configuration

Configuration is managed via environment variables:

```bash
# Redis
REDIS_URL=redis://localhost:6379

# API
PORT=3000
NODE_ENV=production

# DigitalOcean Gradient
GRADIENT_HOST=your-gradient-host.com
GRADIENT_SSH_KEY_PATH=/path/to/private/key
GRADIENT_SSH_USER=root

# Vault Sync
VAULT_SYNC_ENABLED=true
VAULT_LOCAL_PATH=/path/to/vault
```

## Project Structure

```
agents-army/
├── src/
│   ├── api/              # Express routes and endpoints
│   ├── orchestrator/     # Workflow orchestration logic
│   ├── sync/             # Vault sync service
│   ├── ssh/              # SSH execution utilities
│   └── index.js          # Main entry point
├── tests/                # Test files
├── docs/
│   └── plans/            # Implementation plans
├── skills/
│   └── run-agents-force/ # Claude Code skill
├── package.json
├── .gitignore
└── README.md
```

## API Endpoints

### POST /workflows/create
Create a new workflow execution

### GET /workflows/:id
Get workflow status and results

### POST /jobs/:id/cancel
Cancel a running job

### GET /health
Health check endpoint

## Testing

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
```

## Deployment

This service is designed to run on DigitalOcean Gradient with:

1. Redis instance for job queuing
2. Node.js environment
3. SSH access to remote compute nodes
4. Vault sync capabilities

## Contributing

See CLAUDE.md for development conventions and patterns.

## License

MIT
