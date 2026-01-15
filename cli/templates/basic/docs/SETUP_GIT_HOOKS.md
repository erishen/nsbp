# Git Hooks Setup

This project uses **Husky** for managing Git hooks.

## Quick Setup

```bash
# Install dependencies
pnpm install

# Initialize Git hooks (optional, runs automatically on prepare)
pnpm run prepare
```

## How It Works

Husky automatically creates Git hooks in the `.husky` directory:

- **pre-commit**: Runs linting on staged files
- **pre-push**: Runs full lint check before pushing
- **commit-msg**: Validates commit message format

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>
```

### Type Options

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Maintenance tasks
- `build`: Changes that affect the build system
- `ci`: Changes to CI configuration files
- `perf`: Performance improvements
- `revert`: Reverts a previous commit

### Examples

```bash
# Feature
git commit -m "feat(core): add SSR data preloading support"

# Bug fix
git commit -m "fix(client): resolve hydration mismatch error"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style (formatting)
git commit -m "style: format code with prettier"
```

## Available Scripts

```bash
# Lint all files
pnpm run lint

# Lint and fix issues
pnpm run lint:fix

# Format code
pnpm run format

# Reinstall Git hooks
pnpm run prepare
```

## Troubleshooting

### Hooks not working?

1. Make sure hooks are executable:
   ```bash
   chmod +x .husky/*
   ```

2. Reinstall hooks:
   ```bash
   pnpm run prepare
   ```

3. Check `.git/config` for hooks path:
   ```bash
   git config core.hooksPath
   ```
   Should output: `.husky`

### Skip hooks (not recommended)

If you need to bypass hooks temporarily:

```bash
git commit --no-verify
git push --no-verify
```

⚠️ **Warning**: Use `--no-verify` only in emergencies!
