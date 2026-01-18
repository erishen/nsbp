# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 完整的测试框架集成（Jest + React Testing Library + Playwright）
- 单元测试和集成测试支持
- E2E 测试支持（Playwright）
- 测试覆盖率配置和报告
- 测试工具和辅助函数
- 核心组件单元测试（Loading、Header）
- Redux store 测试
- 完整的测试文档

### Changed
- 现代化 tsconfig.json 配置（moduleResolution: bundler）
- 移除弃用的 baseUrl 配置

## [1.0.0] - 2026-01-16

### Added
- First stable release
- Full SSR support with Express 5.2.1
- Complete CLI tool (`nsbp-cli@0.2.35`)
- Multi-environment configuration (development, production)
- Hot reload support for development
- Production-ready Docker deployment
- Security middleware (Helmet, rate limiting)
- Static file serving with cache optimization
- Multiple template support (basic template)

### Features
- React Router DOM 7.12.0 for routing
- Redux Toolkit 2.11.2 for state management
- Framer Motion 12.25.0 for animations
- Axios 1.7.0 for HTTP requests
- Comprehensive documentation
- Makefile for easy Docker operations

### Security
- Content Security Policy (CSP) for XSS prevention
- X-Frame-Options for clickjacking prevention
- Strict-Transport-Security for HTTPS enforcement
- Rate limiting (optional, 15 minutes / 100 requests)
- Request body size limiting (10MB)
- Environment variable protection

### Performance
- Code splitting with loadable components
- Static asset caching (1 year)
- Optimized webpack bundles
- Tree shaking for unused code elimination

### Documentation
- Complete README with Chinese documentation
- Environment variable configuration guide
- Docker deployment guide
- Security features documentation
- Development setup instructions
- Code style and conventions guide

## [0.2.35] - 2026-01-16 (CLI)

### Added
- CLI tool for project scaffolding
- Basic template with full NSBP stack
- Template synchronization script
- Docker support in template
- Interactive project creation

### CLI Features
- `nsbp create <app-name>` - Create new project
- `nsbp info` - Display framework information
- `nsbp --version` - Show CLI version
- Auto package manager detection (pnpm preferred)
- Template transformation logic
- Build artifact filtering

## Future Plans

### [Upcoming]
- [ ] Add E2E tests with Playwright
- [ ] Add unit tests with Jest
- [ ] Create English documentation
- [ ] Add performance benchmarks
- [ ] Create example projects (blog, ecommerce)
- [ ] Add plugin system
- [ ] Create official documentation website
- [ ] Improve error messages
- [ ] Add development CLI commands
- [ ] Enhance template system
