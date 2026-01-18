# NSBP CLI Changelog

All notable changes to the NSBP CLI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [0.2.39] - 2026-01-18

### Other Changes

- chore: update cli template

---

## [0.2.38] - 2026-01-18

### Other Changes

- chore: update cli template

---

## [0.2.36] - 2026-01-17

### Features

- update

### Other Changes

- chore: update cli template

---

## [0.2.35] - 2026-01-16

### Other Changes

- chore: update cli template

---

## [0.2.34] - 2026-01-15

### Other Changes

- chore: update cli template

---

## [0.2.33] - 2026-01-15

### Other Changes

- chore: update cli template

---

## [0.2.32] - 2026-01-15

### Other Changes

- chore: update cli template

---

## [0.2.31] - 2026-01-15

### Other Changes

- chore: update cli template

---

## [0.2.30] - 2026-01-15

### Other Changes

- chore: update cli template

---

## [0.2.28] - 2026-01-15

### Features

- update cli templates
- add husky, eslint

---

## [0.2.27] - 2026-01-14

### Features

- use alias

---

## [0.2.26] - 2026-01-14

### Features

- add alias

---

## [0.2.25] - 2026-01-14

### Other Changes

- chore: update cli template

---

## [0.2.24] - 2026-01-14

### Features

- update favicon
- upgrade dictionary

---

## [0.2.22] - 2026-01-14

### Other Changes

- chore: update cli template

---

## [0.2.21] - 2026-01-13

### Other Changes

- chore: update cli template

---

## [0.2.20] - 2026-01-13

### Other Changes

- chore: update cli template

---

## [0.2.19] - 2026-01-13

### Other Changes

- chore: update cli template

---

## [0.2.18] - 2026-01-13

### Other Changes

- chore: bump version to v0.2.17
- chore: bump version to v0.2.16
- chore: update cli template
- chore: bump version to v0.2.15

---

## [0.2.16] - 2026-01-13

### Other Changes

- chore: update cli template

---

## [0.2.15] - 2026-01-13

### Fixes

- include .gitignore in npm package by renaming to gitignore

### Other Changes

- chore: update cli template

---

## [0.2.14] - 2026-01-13

### Other Changes

- chore: update cli template

---

## [0.2.12] - 2026-01-13

### Other Changes

- chore: update cli template

---

## [0.2.10] - 2026-01-13

### Features

- update nsbp.erishen.cn
- update Makefile

### Other Changes

- chore: update cli template

---

## [0.2.9] - 2026-01-12

### Other Changes

- chore: update cli template

---

## [0.2.7] - 2026-01-12

### Features

- integrate conventional-changelog for automatic changelog generation
- integrate README and CHANGELOG updates into make publish-cli

### Other Changes

- chore: update cli template
- docs: update version in README to 0.2.5 and add changelog entry

---

## [0.2.6] - 2026-01-12

### Features

- integrate conventional-changelog for automatic changelog generation
- integrate README and CHANGELOG updates into make publish-cli

### Other Changes

- docs: update version in README to 0.2.5 and add changelog entry

---

## [0.1.0] - 2026-01-09

### Added
- **Initial release**: CLI tool for creating NSBP (Node React SSR by Webpack) projects
- **Create command**: `nsbp create <project-name>` to scaffold new projects
- **Template system**: Built-in templates (basic, blog, ecommerce support planned)
- **Interactive prompts**: Confirmation for overwriting existing directories
- **Template synchronization**: Smart sync script (`scripts/sync-template.js`) to update CLI templates from main NSBP project

### Changed
- **Package.json handling**: Automatic template name transformation ("nsbp-template" → user project name)
- **Build artifact filtering**: Exclude .js.map, .css.map, .txt, .json, .LICENSE.txt files from public directory during sync

### Features
- **Skip installation option**: `--skip-install` flag to skip npm install
- **Template selection**: `--template <template>` option (currently basic only)
- **Help system**: Comprehensive help with `--help` flag
- **Version info**: `--version` flag to display CLI version
- **Project info**: `nsbp info` command to display framework information

### Technical Details
- **Dependencies**:
  - `commander` for CLI argument parsing
  - `chalk` for colored console output
  - `inquirer` for interactive prompts
  - `fs-extra` for enhanced file operations
- **Built-in templates**: Located in `cli/templates/basic/`
- **Sync script**: Located in `cli/scripts/sync-template.js`

### Usage

#### Installation
```bash
# Install globally
npm install -g nsbp

# Or use with npx (no installation required)
npx nsbp create my-app
```

#### Create a new project
```bash
# Basic usage
nsbp create my-app

# Skip npm install
nsbp create my-app --skip-install

# Specify template (currently basic only)
nsbp create my-app --template basic
```

#### Update CLI templates
```bash
# Run from CLI directory
cd /path/to/nsbp/cli
npm run sync-template

# Or use the update shortcut
npm run update
```

#### Display information
```bash
# Show NSBP framework information
nsbp info

# Show CLI version
nsbp --version

# Show help
nsbp --help
```

### Notes
- This is the initial release of NSBP CLI
- The CLI currently supports the "basic" template only
- Blog and ecommerce templates are planned for future releases
- The sync script automatically filters out build artifacts to keep templates clean
- All templates are built-in; no external downloads required

---

## Future Plans
- **Template expansion**: Add blog and ecommerce templates
- **Advanced configuration**: Custom webpack and TypeScript configuration options
- **Plugin system**: Support for third-party templates and plugins
- **CI/CD integration**: Automated testing and deployment workflows
- **Internationalization**: Multi-language support for CLI output

## Contributing
Contributions are welcome! Please see the main NSBP project repository for contribution guidelines.

## License
MIT © Erishen Sun
