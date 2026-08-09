# NSBP

<div align="center">

![npm version](https://img.shields.io/npm/v/nsbp-cli?style=flat-square&logo=npm)
![License](https://img.shields.io/github/license/erishen/nsbp?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js->=18.0-brightgreen?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Downloads](https://img.shields.io/npm/dm/nsbp-cli?style=flat-square)
[![GitHub Issues](https://img.shields.io/github/issues/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/issues)
[![GitHub Forks](https://img.shields.io/github/forks/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/network/members)
[![GitHub Stars](https://img.shields.io/github/stars/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/commits/main)
[![Maintenance](https://img.shields.io/maintenance/yes/2025?style=flat-square)](https://github.com/erishen/nsbp)

🌐 **Online Demo**: [https://nsbp.erishen.cn/](https://nsbp.erishen.cn/)

[![Star on GitHub](https://img.shields.io/badge/Star-⭐-gold?style=flat-square)](https://github.com/erishen/nsbp)

</div>

## 📚 Docs

- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize Git hooks
pnpm run prepare

# 3. Configure environment
cp .env.example .env

# 4. Start dev server
pnpm run dev
```

## 📝 Development Tools

The project includes a complete code quality toolchain:

- **ESLint**: TypeScript + React linting
- **Prettier**: Auto code formatting
- **Husky**: Automated Git hooks

### Lint Commands

```bash
pnpm run lint        # Lint check
pnpm run lint:fix    # Auto-fix
pnpm run format      # Format code
```

### Git Hooks

- `pre-commit`: Auto lint and format before commit
- `pre-push`: Full lint before push
- `commit-msg`: Validate commit message format (Conventional Commits)

Detailed guides:
- [ESLint & Prettier](./docs/ESLINT_AND_PRETTIER.md)
- [Git Hooks Setup](./docs/SETUP_GIT_HOOKS.md)
- [Development Guide](./docs/DEVELOPMENT_GUIDE.md)

## Environment Configuration

### Quick Start

```bash
# 1. Copy template
cp .env.example .env

# 2. Edit .env as needed
# Edit NODE_ENV, PORT, ENABLE_RATE_LIMIT, etc.

# 3. Start
pnpm run dev              # Local development
docker-compose up -d         # Docker deployment
```

### Variables

| Variable | Default | Description | Recommended |
|----------|---------|-------------|-------------|
| `NODE_ENV` | development | Environment (development/production) | All |
| `PORT` | 3001 | Service port | All |
| `ENABLE_RATE_LIMIT` | 0 | Enable rate limiting (1=on, 0=off) | Production |
| `DEBUG` | - | Enable debug logging | Development |
| `TZ` | Asia/Shanghai | Timezone | Production |

### Config Files

- **`.env.example`** — Template (committed to Git)
- **`.env`** — Local dev config (not committed)
- **`.env.production`** — Production config (not committed)
- **`.env.development`** — Dev config (not committed)
- **`.env.local`** — Local secrets (highest priority, not committed)

### Priority

```
.env.local > .env > docker-compose.yml defaults
```

### Local Development

```bash
cp .env.development .env
pnpm run dev
```

### Docker Deployment

```bash
cp .env.production .env
docker-compose up -d
```

### Sensitive Info

- ✅ `.env.example` — safe to commit (template)
- ❌ `.env`, `.env.local` — do not commit (in .gitignore)
- ✅ Put secrets (keys, passwords) in `.env.local`

## Development

- `pnpm run dev` — Development
- `pnpm run build` — Production build
- `pnpm start` — Production start

### Local Access

**Server-Side Rendering** (default, SEO-friendly)
```
http://localhost:3001/
```

**Client-Side Rendering** (SSR disabled)
```
http://localhost:3001/?nsbp=0
```

**SSR Fallback** (auto-fallback to CSR if SSR fails)
```
http://localhost:3001/?nsbp=1&from=link
```

> `nsbp` parameter controls render mode:
> - `nsbp=1` or omitted: SSR (default)
> - `nsbp=0`: CSR

## Docker Deployment

### Production

Using Makefile (recommended):

```bash
make prod            # Build & start
make logs            # View logs
make restart         # Restart
make shell           # Enter container
make down            # Stop
make clean           # Clean everything
```

Or directly with Docker Compose:

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f
docker-compose down
```

Access: http://localhost:3001

### Development

```bash
make dev             # Start dev (with hot reload)
make logs-dev        # View dev logs
make shell-dev       # Enter dev container
make restart-dev     # Restart dev
make rebuild-dev     # Rebuild & start
```

Or:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Docker Commands

```bash
# Production
make build         # Build image
make prod          # Start production
make logs          # View logs
make restart       # Restart
make shell         # Enter container
make down          # Stop

# Development
make build-dev     # Build dev image
make dev           # Start dev
make logs-dev      # View dev logs
make restart-dev   # Restart dev container
make shell-dev     # Enter dev container

# General
make clean         # Clean all resources
make rebuild       # Rebuild & start production
make rebuild-dev   # Rebuild & start development
```

## Security

NSBP includes multiple layers of security protection with production-grade defaults.

### HTTP Headers (Helmet)

- Content Security Policy (CSP): prevents XSS
- X-Frame-Options: prevents clickjacking
- X-Content-Type-Options: prevents MIME sniffing
- Strict-Transport-Security: enforces HTTPS
- X-XSS-Protection: XSS protection
- Referrer-Policy: referrer control

### Static File Security

- ✅ Blocks access to `.env`, `.git`, and other sensitive files
- ✅ Static asset cache optimization (1 year)
- ✅ Request body size limit (10MB)

### Tech Stack Hiding

- ✅ Removes `X-Powered-By` header
- ✅ No Express version disclosure

### Rate Limiting (Optional)

- ✅ Max 100 requests per 15 minutes
- ✅ Auto-block malicious IPs
- ✅ Toggle via environment variable

Enable in production:

```bash
# docker-compose.yml
environment:
  - ENABLE_RATE_LIMIT=1

# or .env
ENABLE_RATE_LIMIT=1
```

### Security Checklist

Before deployment:
- [ ] Latest dependencies installed (`pnpm install`)
- [ ] Environment configured (NODE_ENV=production)
- [ ] HTTPS configured
- [ ] Secrets removed from codebase
- [ ] Rate limiting enabled (production)
- [ ] Static file access tested
- [ ] CSP policy tested

### CLI Publishing

```bash
make publish-cli  # Sync templates, bump version, publish to npm
```

Note: This command is only available in the project root. Generated NSBP projects do not include this target.

---

## Related Articles

- English: [Production React SSR Framework](https://erishen.cn/building-production-react-ssr-framework/)
- 中文: [生产级 React SSR 框架](https://erishen.cn/building-production-react-ssr-framework-cn/)