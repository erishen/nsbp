#!/usr/bin/env node

/**
 * Setup Husky Git Hooks
 *
 * Note: Husky 9.x doesn't need manual installation.
 * Hooks are automatically created during pnpm install.
 */

console.log('🔧 Husky Git Hooks Setup\n')

console.log('ℹ️  Husky 9.x Information:')
console.log('   Hooks are automatically created during pnpm install')
console.log('   No manual setup required!\n')

console.log('📝 Configured Git Hooks:')
console.log('   • pre-commit  - Lint staged files before commit')
console.log('   • pre-push   - Run full lint check before push')
console.log('   • commit-msg - Validate commit message format\n')

console.log('💡 Commit message format: type(scope): description')
console.log('   Types: feat, fix, docs, style, refactor, test, chore, etc.\n')

console.log('✅ Setup complete! Git hooks are ready to use.\n')
