# NSBP CLI

Command-line interface for creating NSBP (Node React SSR by Webpack) projects.

## Local Usage

The CLI is located in the `cli/` directory of the NSBP project. Run it locally:

```bash
# Navigate to CLI directory
cd cli

# Show help
node ./bin/nsbp.js --help

# Show NSBP information
node ./bin/nsbp.js info

# Create a new project
node ./bin/nsbp.js create my-app

# Skip npm install
node ./bin/nsbp.js create my-app --skip-install
```

## Global Installation

To use `nsbp` command globally from anywhere:

```bash
# Navigate to CLI directory
cd cli

# Install globally
npm link

# Now you can use from anywhere
nsbp create my-app
nsbp info
```

## Usage

### Create a new project

```bash
# Basic usage
node ./bin/nsbp.js create my-app

# Or after npm link
nsbp create my-app

# Skip npm install
node ./bin/nsbp.js create my-app --skip-install
# or
nsbp create my-app --skip-install

# Specify template (currently only basic is available)
nsbp create my-app --template basic
```

### Display information

```bash
# Show NSBP framework information
nsbp info
# or
node ./bin/nsbp.js info
```

### Help

```bash
# Show all commands
nsbp --help
# or
node ./bin/nsbp.js --help

# Show create command help
nsbp create --help
```

## Templates

- **basic**: Default template with core NSBP features (currently available)
- **blog**: Blog-focused template with article layouts (coming soon)
- **ecommerce**: E-commerce template with product pages (coming soon)

## How it works

The CLI copies the NSBP project structure from templates/basic/ to your target directory and creates a new `package.json` with the appropriate dependencies. You get a fully functional NSBP project ready for development.

## Template Synchronization

The CLI includes a synchronization script that keeps the built-in templates up-to-date with the main NSBP project code.

### Sync Script
Location: `cli/scripts/sync-template.js`

### Usage
```bash
# From the CLI directory
cd /path/to/nsbp/cli

# Run the sync script
npm run sync-template

# Or use the update shortcut
npm run update
```

### Features
- **Smart copying**: Copies only source code and configuration files
- **Build artifact filtering**: Automatically excludes .js.map, .css.map, .txt, .json, and .LICENSE.txt files from public directory
- **Template transformation**: Converts main project's package.json to template format (name: "nsbp-template")
- **Integrity verification**: Checks for required files like src/Routers.tsx, scripts/start.js, and package.json

### What gets synchronized
- `src/` - React components and routing
- `public/` - Static assets (images, favicon.ico)
- `scripts/` - Startup and utility scripts
- `webpack.*.js` - Webpack configuration files
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - Project configuration (automatically templatized)
- `.gitignore`, `.prettierrc`, `.prettierignore`, `README.md`

## Development

To work on the CLI locally:

```bash
cd cli
pnpm install
# or
npm install
node ./bin/nsbp.js create test-app
```

## Package Information

- **Package Name**: `nsbp-cli`
- **Bin Command**: `nsbp`
- **Dependencies**: chalk, commander, fs-extra, inquirer
- **Package Manager**: Supports both npm and pnpm


## License

ISC