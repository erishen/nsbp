# Husky 和 ESLint 配置总结

> **Husky 9.x 升级说明**：Husky 9.x 简化了安装方式，无需手动运行 `husky install`。Hooks 在 `pnpm install` 时自动创建。

## ✅ 已完成的配置

### 1. 创建的配置文件

#### ESLint 配置
- **`.eslintrc.js`** - ESLint 主配置文件
  - TypeScript 支持（@typescript-eslint/parser）
  - React 支持（eslint-plugin-react）
  - React Hooks 支持（eslint-plugin-react-hooks）
  - Prettier 集成（eslint-config-prettier）

- **`.eslintignore`** - ESLint 忽略规则
  - 忽略构建产物（build, dist, public）
  - 忽略缓存（.temp_cache）
  - 忽略 Webpack 配置文件

#### Prettier 配置
- **`.prettierrc.js`** - Prettier 格式化配置
  - 2 空格缩进
  - 单引号
  - 无分号
  - 100 字符换行
  - Unix 换行符
  - import 组织（prettier-plugin-organize-imports）

#### Husky Git Hooks
- **`.husky/pre-commit`** - 提交前钩子
  - 运行 `pnpm run lint-staged`
  - 自动修复和格式化暂存文件

- **`.husky/pre-push`** - 推送前钩子
  - 运行完整 lint 检查
  - 防止推送有问题的代码

- **`.husky/commit-msg`** - 提交信息验证
  - 验证 Conventional Commits 格式
  - 支持的类型：feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert

- **`.husky/README.md`** - Git hooks 使用说明

#### VSCode 配置
- **`.vscode/settings.json`** - 编辑器设置
  - 保存时自动格式化
  - 保存时自动修复 ESLint 问题
  - 配置 Prettier 作为默认格式化器
  - TypeScript 和 React 文件支持

- **`.vscode/extensions.json`** - 推荐扩展
  - ESLint
  - Prettier
  - TypeScript Importer
  - Error Lens

- **`.vscode/.gitignore`** - Git 忽略规则
  - 允许提交 settings.json 和扩展配置
  - 忽略 workspace 配置

### 2. 更新的文件

#### package.json
- **添加的依赖**:
  ```json
  {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier-plugin-organize-imports": "^4.0.0"
  }
  ```

- **添加的脚本**:
  ```json
  {
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx --fix",
    "prepare": "husky"
  }
  ```

- **添加的 lint-staged 配置**:
  ```json
  {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,less,scss}": [
      "prettier --write"
    ]
  }
  ```

#### .gitignore
- 添加了 `.husky/_` 忽略规则（Husky 内部文件）

#### README.md
- 添加了快速开始部分
- 添加了开发工具说明
- 添加了文档链接

### 3. 创建的文档

- **`docs/ESLINT_AND_PRETTIER.md`** - ESLint 和 Prettier 详细配置说明
- **`docs/SETUP_GIT_HOOKS.md`** - Git hooks 配置和使用说明
- **`docs/DEVELOPMENT_GUIDE.md`** - 完整开发指南
- **`docs/HUSKY_ESLINT_SETUP.md`** - 本文档

### 4. 创建的辅助脚本

- **`scripts/setup-husky.js`** - Husky 初始化脚本（备用）

## 📦 依赖版本

| 包名 | 版本 | 用途 |
|------|------|------|
| eslint | ^9.0.0 | 代码质量检查 |
| eslint-config-prettier | ^9.0.0 | Prettier 集成 |
| eslint-plugin-react | ^7.37.0 | React 规则 |
| eslint-plugin-react-hooks | ^5.0.0 | React Hooks 规则 |
| @typescript-eslint/eslint-plugin | ^8.0.0 | TypeScript 规则 |
| @typescript-eslint/parser | ^8.0.0 | TypeScript 解析 |
| prettier | ^3.3.0 | 代码格式化 |
| prettier-plugin-organize-imports | ^4.0.0 | import 排序 |
| husky | ^9.0.0 | Git hooks |
| lint-staged | ^15.0.0 | 暂存文件处理 |

## 🔧 ESLint 规则配置

### 主要规则

```javascript
{
  'prettier/prettier': 'error',                    // Prettier 冲突报错
  'react/react-in-jsx-scope': 'off',           // 不需要 React 导入
  'react/prop-types': 'off',                    // 使用 TypeScript
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',  // 允许 any
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'react-hooks/rules-of-hooks': 'error',           // Hooks 规则
  'react-hooks/exhaustive-deps': 'warn',       // 依赖检查
  'no-console': ['warn', { allow: ['warn', 'error'] }] // 允许 console
}
```

## 🎨 Prettier 配置

```javascript
{
  semi: false,                 // 不使用分号
  singleQuote: true,             // 使用单引号
  tabWidth: 2,                  // 2 空格缩进
  trailingComma: 'es5',         // ES5 尾部逗号
  printWidth: 100,              // 100 字符换行
  arrowParens: 'always',        // 箭头函数加括号
  endOfLine: 'lf',              // Unix 换行符
  plugins: ['prettier-plugin-organize-imports'],
  importOrder: ['^react', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
```

## 🔄 Git Hooks 工作流程

### 提交前（pre-commit）

1. `lint-staged` 检测暂存文件
2. 对 TypeScript/JS 文件运行 `eslint --fix`
3. 对所有文件运行 `prettier --write`
4. 重新暂存修复后的文件
5. 如果有错误，阻止提交

### 推送前（pre-push）

1. 运行完整 `pnpm run lint`
2. 如果有错误，阻止推送

### 提交信息验证（commit-msg）

1. 检查提交信息格式：`<type>(<scope>): <subject>`
2. 支持的类型：feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert
3. 如果格式不正确，阻止提交并显示帮助信息

## 📝 提交信息示例

```bash
# 功能
git commit -m "feat(core): add SSR data preloading support"

# Bug 修复
git commit -m "fix(client): resolve hydration mismatch error"

# 文档
git commit -m "docs(readme): update installation instructions"

# 样式
git commit -m "style: format code with prettier"

# 重构
git commit -m "refactor(components): simplify layout component"

# 测试
git commit -m "test(add): add unit tests for utils"

# 构建
git commit -m "build(webpack): optimize production bundle"

# CI
git commit -m "ci(github): update workflow configuration"
```

## 🚀 使用方法

### 初始化（首次使用）

```bash
# 1. 安装依赖
pnpm install

# 2. 初始化 Git hooks（会自动运行 prepare 脚本）
pnpm run prepare

# 3. 验证 hooks 安装
ls .husky
# 应该看到: pre-commit, pre-push, commit-msg
```

### 日常开发

```bash
# 开发
pnpm run dev

# 修改代码...

# 提交（hooks 自动运行）
git add .
git commit -m "feat: add new feature"
# pre-commit 自动运行: eslint --fix + prettier --write

# 如果有错误
pnpm run lint:fix
git add .
git commit --amend
```

### 跳过 hooks（不推荐）

```bash
# 跳过 pre-commit
git commit --no-verify -m "message"

# 跳过 pre-push
git push --no-verify
```

⚠️ **警告**: 仅在紧急情况下使用！

## 📚 相关文档

- [README.md](../README.md) - 项目总览
- [ESLINT_AND_PRETTIER.md](./ESLINT_AND_PRETTIER.md) - ESLint 和 Prettier 详细配置
- [SETUP_GIT_HOOKS.md](./SETUP_GIT_HOOKS.md) - Git hooks 使用说明
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - 完整开发指南

## ✨ 特性

- ✅ TypeScript + React 完整支持
- ✅ 自动代码格式化（保存时自动运行）
- ✅ 提交前自动 lint 和格式化
- ✅ 提交信息格式验证
- ✅ VSCode 集成（自动格式化 + 修复）
- ✅ import 自动排序
- ✅ 支持 Conventional Commits
- ✅ React Hooks 规则检查

## 🎯 下一步建议

- [ ] 添加单元测试框架（Jest 或 Vitest）
- [ ] 配置 CI/CD 流程
- [ ] 添加代码覆盖率报告
- [ ] 配置自动化部署
- [ ] 添加 Commitlint 更严格的提交规范
- [ ] 配置 Release Please 自动化版本发布
