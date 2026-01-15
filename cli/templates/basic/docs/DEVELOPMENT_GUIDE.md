# NSBP 开发指南

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm（Husky hooks 自动创建）
pnpm install
```

⚠️ **注意**：Husky 9.x 会自动创建 Git hooks，无需运行 `pnpm run prepare`。

### 2. 启动开发环境

```bash
# 开发模式（带热重载）
pnpm run dev

# 或分步启动
pnpm run dev:init      # 初始化构建
pnpm run dev:build:*  # 监听文件变化
pnpm run dev:build:start # 启动服务器
```

### 3. 访问应用

- **客户端渲染**: http://localhost:3001/
- **服务端渲染**: http://localhost:3001/?seo=1
- **BrowserSync**: http://localhost:3000/

## 📝 开发工作流

### 提交代码

```bash
# 1. 创建功能分支
git checkout -b feat/your-feature

# 2. 开发并测试
# ...

# 3. 格式化代码
pnpm run format

# 4. Lint 检查
pnpm run lint

# 5. 提交（Git hooks 自动运行 lint-staged）
git add .
git commit -m "feat: add new feature"

# 6. 推送（Git hooks 自动运行 lint）
git push origin feat/your-feature
```

### 提交信息格式

遵循 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构（非功能或 Bug）
- `test`: 测试相关
- `chore`: 构建/工具链相关
- `perf`: 性能优化
- `ci`: CI 配置变更

**示例**:
```bash
git commit -m "feat(core): add SSR data preloading support"
git commit -m "fix(client): resolve hydration mismatch error"
git commit -m "docs(readme): update installation guide"
```

## 🛠️ 常用命令

### 开发命令

```bash
pnpm run dev              # 完整开发环境
pnpm run dev:init        # 初始化构建
pnpm run dev:build:*     # 监听文件变化
pnpm run dev:build:start  # 启动开发服务器
```

### 构建命令

```bash
pnpm run build            # 生产构建
pnpm run build:server     # 构建服务端
pnpm run build:client     # 构建客户端
pnpm run start            # 启动生产服务器
```

### 代码质量

```bash
pnpm run lint            # ESLint 检查
pnpm run lint:fix        # ESLint 自动修复
pnpm run format          # Prettier 格式化
pnpm run lint-staged     # 对暂存文件运行 lint（Git 钩子自动执行）
```

### 清理命令

```bash
pnpm run clean           # 清理构建产物和缓存
rm -rf .temp_cache      # 清理 Webpack 缓存
rm -rf node_modules      # 清理依赖
pnpm install            # 重新安装依赖
```

### Docker 命令

```bash
# 生产环境
make build              # 构建镜像
make prod               # 启动生产环境
make logs               # 查看日志
make restart            # 重启容器
make shell              # 进入容器
make down               # 停止容器
make clean              # 完全清理

# 开发环境
make dev                # 启动开发环境
make logs-dev           # 查看开发日志
make rebuild-dev        # 重新构建并启动
```

## 📂 项目结构

```
nsbp/
├── cli/                   # CLI 工具和模板
│   ├── bin/             # CLI 二进制文件
│   ├── templates/        # 项目模板
│   └── scripts/          # 构建脚本
├── config/               # Webpack 配置
│   ├── webpack.base.js    # 基础配置
│   ├── webpack.client.js  # 客户端配置
│   └── webpack.server.js  # 服务端配置
├── public/              # 静态资源输出目录
├── src/                 # 源代码目录
│   ├── client/          # 客户端入口
│   ├── server/          # 服务端代码
│   ├── containers/      # 页面组件
│   ├── component/       # 公共组件
│   ├── styled/          # 样式组件
│   ├── services/        # API 服务
│   ├── reducers/        # Redux reducers
│   ├── store/           # Redux store
│   └── utils/           # 工具函数
├── scripts/             # Node.js 脚本
├── docker/              # Docker 配置
├── docs/                # 文档
└── .husky/              # Git hooks
```

## 🔍 代码检查工具

### ESLint

- **配置文件**: `.eslintrc.js`
- **忽略文件**: `.eslintignore`
- **用途**: TypeScript + React 代码质量检查

**规则**:
- TypeScript: 类型检查、未使用变量警告
- React: Hooks 规则、组件最佳实践
- Prettier: 代码风格一致性

### Prettier

- **配置文件**: `.prettierrc.js`
- **用途**: 自动格式化代码

**配置**:
- 2 空格缩进
- 单引号
- 无分号
- 100 字符换行

### Husky

- **配置目录**: `.husky/`
- **用途**: Git 钩子自动化

**钩子**:
- `pre-commit`: 提交前 lint 暂存文件
- `pre-push`: 推送前全量 lint
- `commit-msg`: 验证提交信息格式

## 🐛 常见问题

### Webpack 缓存错误

**问题**:
```
Cannot find module 'xxx'
Restoring failed for ResolverCachePlugin
```

**解决方案**:
```bash
# 清理缓存
pnpm run clean
rm -rf .temp_cache

# 重新构建
pnpm run dev
```

### Git 钩子失败

**问题**:
```
husky - pre-commit hook failed
```

**解决方案**:
```bash
# 查看错误
pnpm run lint

# 自动修复
pnpm run lint:fix

# 重新提交
git add .
git commit -m "style: resolve linting issues"
```

### TypeScript 类型错误

**问题**: 编辑器显示类型错误，但项目能编译

**解决方案**:
```bash
# 重启 TypeScript 服务器
# VSCode: Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# 确保项目已编译
pnpm run build:server
```

### Docker 权限错误

**问题**:
```
EACCES: permission denied
```

**解决方案**:
Docker 已在 `entrypoint.sh` 中自动修复权限，无需手动处理。

## 📚 相关文档

- [ESLINT_AND_PRETTIER.md](./ESLINT_AND_PRETTIER.md) - 代码风格配置
- [SETUP_GIT_HOOKS.md](./SETUP_GIT_HOOKS.md) - Git hooks 配置
- [README.md](../README.md) - 项目总览

## 💡 最佳实践

1. **提交前**: 总是运行 `pnpm run format` 和 `pnpm run lint:fix`
2. **分支管理**: 使用功能分支，不直接在 main/master 分支开发
3. **提交信息**: 遵循 Conventional Commits 规范
4. **代码审查**: 提交 PR 前自查代码质量和格式
5. **定期清理**: 定期运行 `pnpm run clean` 清理缓存
6. **依赖更新**: 使用 `pnpm update` 而不是手动修改版本号

## 🎯 下一步

- [ ] 配置 CI/CD 流程
- [ ] 添加单元测试
- [ ] 添加 E2E 测试
- [ ] 配置代码覆盖率
- [ ] 设置自动化部署
