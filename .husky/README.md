# Husky Git Hooks

This directory contains Git hooks configured by Husky.

## Available Hooks

- **pre-commit**: Runs linting on staged files before commit
- **pre-push**: Runs full lint check before pushing
- **commit-msg**: Validates commit message format

## Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

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

### Example

```
feat(core): add SSR data preloading support

- Implement loadData in route config
- Add server-side data fetching utilities
- Update hydration logic

Closes #123
```
