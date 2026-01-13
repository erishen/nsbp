# NSBP CLI

Command-line interface for creating NSBP (Node React SSR by Webpack) projects.

🌐 **Online Demo**: [https://nsbp.erishen.cn/](https://nsbp.erishen.cn/)

📦 **Published on npm**: [https://www.npmjs.com/package/nsbp-cli](https://www.npmjs.com/package/nsbp-cli)

## Installation

### Global Installation (npm)
```bash
npm install -g nsbp-cli
```

### Using npx (No Installation)
```bash
npx nsbp-cli create my-app
```

### Verify Installation
```bash
nsbp --version
```

## Quick Start

Create a new NSBP project with a single command:

```bash
nsbp create my-app
cd my-app
pnpm install  # NSBP CLI uses pnpm as package manager
pnpm run dev
```

For development with Docker (recommended):
```bash
cd my-app
make dev  # Starts development environment with hot reload
```

## Command Reference

### Create a New Project
```bash
nsbp create <app-name> [options]

# Examples
nsbp create my-app
nsbp create my-app --skip-install  # Skip npm install
nsbp create my-app --template basic  # Specify template (basic is default)
```

### Display Framework Information
```bash
nsbp info
```

### Help
```bash
nsbp --help          # Show all commands
nsbp create --help   # Show create command options
```

## Templates

The CLI provides project templates to get started quickly:

- **basic** (default) - Complete NSBP stack with React SSR, TypeScript, and Webpack
  - Includes full Docker support for development and production
  - Pre-configured with Makefile for easy Docker operations
  - Ready-to-use project structure

- **blog** - Blog-focused template with article layouts (coming soon)
- **ecommerce** - E-commerce template with product pages (coming soon)

## Docker Support

The **basic** template includes comprehensive Docker configuration:

### Docker Files Included
- `.dockerignore` - Docker build ignore rules
- `docker-compose.yml` - Production environment configuration
- `docker-compose.dev.yml` - Development environment with hot reload
- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development build
- `Makefile` - Convenient Docker commands

### Available Make Commands
```bash
make dev      # Start development environment (hot reload)
make prod     # Start production environment
make rebuild  # Rebuild and restart production containers
make logs     # View container logs
make down     # Stop and remove containers
make shell    # Open shell in production container
make shell-dev # Open shell in development container
```

## How It Works

The CLI copies the NSBP project structure from `templates/basic/` to your target directory and creates a new `package.json` with appropriate dependencies. You get a fully functional NSBP project ready for development, including complete Docker support.

## Template Synchronization

The CLI includes a synchronization script that keeps built-in templates up-to-date with the main NSBP project code.

### Sync Script
Location: `cli/scripts/sync-template.js`

### Usage
```bash
cd cli
pnpm run update  # CLI项目使用pnpm，运行同步脚本
# 或者使用 npm run update（兼容）
```

### Features
- **Smart copying** - Copies only source code and configuration files
- **Build artifact filtering** - Automatically excludes build artifacts from the public directory
- **Template transformation** - Converts main project's package.json to template format
- **Integrity verification** - Checks for required files before synchronization

### Synchronized Files
- `src/` - React components and routing
- `public/` - Static assets
- `scripts/` - Startup and utility scripts
- `webpack.*.js` - Webpack configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - Project configuration (templatized)
- `.gitignore`, `.prettierrc`, `.prettierignore`, `README.md`
- **Docker files**: `.dockerignore`, `docker-compose.yml`, `docker-compose.dev.yml`, `Dockerfile`, `Dockerfile.dev`, `Makefile`

## Development

To work on the CLI locally:

```bash
cd cli
pnpm install  # CLI项目使用pnpm作为包管理器
node ./bin/nsbp.js --help  # Test CLI locally
```

## Package Information

- **Package Name**: `nsbp-cli`
- **Bin Command**: `nsbp` (install globally and run `nsbp --help`)
- **Version**: `0.2.12`
- **Dependencies**: chalk, commander, fs-extra, inquirer
- **Package Manager**: Uses pnpm (also compatible with npm)
- **Node Version**: >=16.0.0

## License

ISC