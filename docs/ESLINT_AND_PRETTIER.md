# ESLint & Prettier 配置指南

本项目使用 ESLint + Prettier 进行代码风格检查和格式化。

## 📦 已安装的包

```json
{
  "eslint": "^9.0.0",
  "eslint-config-prettier": "^9.0.0",
  "eslint-plugin-react": "^7.37.0",
  "eslint-plugin-react-hooks": "^5.0.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.0.0",
  "prettier": "^3.3.0",
  "prettier-plugin-organize-imports": "^4.0.0",
  "@typescript-eslint/eslint-plugin": "^8.0.0",
  "@typescript-eslint/parser": "^8.0.0"
}
```

## 🔧 配置文件

### ESLint
- `.eslintrc.js` - ESLint 配置
- `.eslintignore` - ESLint 忽略规则

### Prettier
- `.prettierrc.js` - Prettier 配置

### Husky
- `.husky/pre-commit` - 提交前钩子
- `.husky/pre-push` - 推送前钩子
- `.husky/commit-msg` - 提交信息验证

## 📝 可用命令

```bash
# Lint 检查（不修复）
pnpm run lint

# Lint 检查并自动修复
pnpm run lint:fix

# 格式化代码
pnpm run format

# 同时 lint 和格式化（Git 钩子自动执行）
pnpm run lint-staged
```

## 🔍 ESLint 规则

### TypeScript 规则
- `@typescript-eslint/no-explicit-any`: 警告 - 允许 `any` 类型
- `@typescript-eslint/no-unused-vars`: 警告 - 未使用的变量（允许 `_` 开头）

### React 规则
- `react/react-in-jsx-scope`: 关闭 - 不需要显式 React 导入
- `react/prop-types`: 关闭 - 使用 TypeScript 类型系统
- `react-hooks/rules-of-hooks`: 错误 - 遵循 React Hooks 规则
- `react-hooks/exhaustive-deps`: 警告 - Hooks 依赖项检查

### 其他规则
- `prettier/prettier`: 错误 - 代码风格必须符合 Prettier 配置
- `no-console`: 警告 - 允许 `console.warn` 和 `console.error`

## 🎨 Prettier 配置

```javascript
{
  semi: false,              // 不使用分号
  singleQuote: true,        // 使用单引号
  tabWidth: 2,             // 2 空格缩进
  trailingComma: 'es5',    // ES5 尾部逗号
  printWidth: 100,         // 每行最多 100 字符
  arrowParens: 'always',   // 箭头函数总是加括号
  endOfLine: 'lf',         // Unix 换行符
}
```

## 📁 忽略的文件

ESLint 会忽略以下目录和文件：

- `node_modules/`
- `build/`
- `dist/`
- `.temp_cache/`
- `public/js/`
- `public/css/`
- `*.bundle.js`
- `loadable-stats.json`
- `coverage/`
- Webpack 配置文件（`*.config.js`）

## 🚨 常见问题

### 1. Git 钩子阻止提交

**问题**：提交代码时，Git 钩子失败

**解决方案**：
```bash
# 查看错误信息
pnpm run lint

# 自动修复
pnpm run lint:fix

# 重新提交
git add .
git commit -m "fix: resolve linting issues"
```

### 2. TypeScript 类型错误

**问题**：ESLint 报告类型错误

**解决方案**：
- 确保项目已编译：`pnpm run build:server`
- 重启 TypeScript 服务器（TS Language Server）

### 3. Prettier 格式冲突

**问题**：手动格式化后，ESLint 仍然报错

**解决方案**：
```bash
# 使用 Prettier 重新格式化
pnpm run format

# 确保编辑器使用 Prettier
# VSCode: 安装 Prettier 插件，启用 "Format on Save"
```

### 4. 跳过 Git 钩子（不推荐）

```bash
git commit --no-verify -m "your commit message"
git push --no-verify
```

⚠️ **警告**：仅在紧急情况下使用！

## 🎯 编辑器配置

### VSCode

推荐安装扩展：
- ESLint
- Prettier - Code formatter
- TypeScript Importer

项目根目录创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## 📚 参考资料

- [ESlint 文档](https://eslint.org/docs/latest/)
- [Prettier 文档](https://prettier.io/docs/en/options)
- [React Hooks 规则](https://react-hooks.vercel.app/)
- [Conventional Commits](https://www.conventionalcommits.org/)
