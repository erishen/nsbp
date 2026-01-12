# NSBP CLI

Command-line interface for creating NSBP (Node React SSR by Webpack) projects.

📦 **Published on npm**: [https://www.npmjs.com/package/nsbp-cli](https://www.npmjs.com/package/nsbp-cli)

## Installation from npm

Install globally from npm registry:

\`\`\`bash
# Install globally
npm install -g nsbp-cli

# Or use npx (no installation required)
npx nsbp-cli create my-app

# Verify installation
nsbp-cli --version
\`\`\`

## Local Usage

The CLI is also located in \`cli/\` directory of the NSBP project. Run it locally for development:

\`\`\`bash
# Navigate to CLI directory
cd cli

# Show help
node ./bin/nsbp-cli.js --help

# Show NSBP information
node ./bin/nsbp-cli.js info

# Create a new project
node ./bin/nsbp-cli.js create my-app

# Skip npm install
node ./bin/nsbp-cli.js create my-app --skip-install
\`\`\`

## Usage

### Create a new project

\`\`\`bash
# From npm (after global install)
nsbp-cli create my-app

# From npx
npx nsbp-cli create my-app

# From local CLI directory
node ./bin/nsbp-cli.js create my-app

# Skip npm install
nsbp-cli create my-app --skip-install

# Specify template (currently only basic is available)
nsbp-cli create my-app --template basic
\`\`\`

### Display information

\`\`\`bash
# Show NSBP framework information
nsbp-cli info
\`\`\`

### Help

\`\`\`bash
# Show all commands
nsbp-cli --help

# Show create command help
nsbp-cli create --help
\`\`\`

## Templates

- **basic**: Default template with core NSBP features (currently available)
- **blog**: Blog-focused template with article layouts (coming soon)
- **ecommerce**: E-commerce template with product pages (coming soon)

## How it works

The CLI copies NSBP project structure from \`templates/basic/\` to your target directory and creates a new \`package.json\` with appropriate dependencies. You get a fully functional NSBP project ready for development.

## Template Synchronization

The CLI includes a synchronization script that keeps built-in templates up-to-date with the main NSBP project code.

### Sync Script
Location: \`cli/scripts/sync-template.js\`

### Usage
\`\`\`bash
# From CLI directory
cd /path/to/nsbp-cli/cli

# Run sync script
pnpm run sync-template
# or
npm run sync-template

# Or use to update shortcut
pnpm run update
# or
npm run update
\`\`\`

### Features
- **Smart copying**: Copies only source code and configuration files
- **Build artifact filtering**: Automatically excludes .js.map, .css.map, .txt, .json, and .LICENSE.txt files from the public directory
- **Template transformation**: Converts main project's package.json to template format (name: "nsbp-cli-template")
- **Integrity verification**: Checks for required files like src/Routers.tsx, scripts/start.js, and package.json

### What gets synchronized
- \`src/\` - React components and routing
- \`public/\` - Static assets (images, favicon.ico)
- \`scripts/\` - Startup and utility scripts
- \`webpack.*.js\` - Webpack configuration files
- \`tsconfig.json\` - TypeScript configuration
- \`postcss.config.js\` - PostCSS configuration
- \`package.json\` - Project configuration (automatically templatized)
- \`.gitignore\`, \`.prettierrc\`, \`.prettierignore\`, \`README.md\`

## Development

To work on the CLI locally:

\`\`\`bash
cd cli
pnpm install
# or
npm install
node ./bin/nsbp-cli.js create test-app
\`\`\`

## Package Information

- **Package Name**: \`nsbp-cli\`
- **Bin Command**: \`nsbp-cli\`
- **Version**: \`0.1.0\`
- **Dependencies**: chalk, commander, fs-extra, inquirer
- **Package Manager**: Supports both npm and pnpm

## License

ISC
