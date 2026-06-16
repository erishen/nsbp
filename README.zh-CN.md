# NSBP

<div align="center">

![npm version](https://img.shields.io/npm/v/nsbp-cli?style=flat-square&logo=npm)
![License](https://img.shields.io/github/license/erishen/nsbp?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js->=18.0-brightgreen?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Downloads](https://img.shields.io/npm/dm/nsbp-cli?style=flat-square)
[![GitHub Issues](https://img.shields.io/github/issues/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/issues)
[![GitHub Forks](https://img.shields.io/github/forks/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/network/members)
[![GitHub Stars](https://img.shields.io/github/stars/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/erishen/nsbp?style=flat-square&logo=github)](https://github.com/erishen/nsbp/commits/main)
[![Maintenance](https://img.shields.io/maintenance/yes/2025?style=flat-square)](https://github.com/erishen/nsbp)

🌐 **Online Demo**: [https://nsbp.erishen.cn/](https://nsbp.erishen.cn/)

[![Star on GitHub](https://img.shields.io/badge/Star-⭐-gold?style=flat-square)](https://github.com/erishen/nsbp)

</div>

## 📚 文档

- [更新日志](./CHANGELOG.md) - 查看版本更新记录
- [贡献指南](./CONTRIBUTING.md) - 如何参与贡献
- [行为准则](./CODE_OF_CONDUCT.md) - 社区行为规范

</div>

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 初始化 Git hooks（代码质量检查）
pnpm run prepare

# 3. 配置环境变量
cp .env.example .env

# 4. 启动开发环境
pnpm run dev
```

## 📝 开发工具

本项目配置了完整的代码质量检查工具：

- **ESLint**: TypeScript + React 代码质量检查
- **Prettier**: 自动代码格式化
- **Husky**: Git hooks 自动化

### 代码检查命令

```bash
pnpm run lint        # Lint 检查
pnpm run lint:fix    # Lint 自动修复
pnpm run format      # 格式化代码
```

### Git Hooks

- `pre-commit`: 提交前自动 lint 和格式化
- `pre-push`: 推送前运行完整 lint 检查
- `commit-msg`: 验证提交信息格式（Conventional Commits）

详细配置请查看：
- [docs/ESLINT_AND_PRETTIER.md](./docs/ESLINT_AND_PRETTIER.md) - ESLint 和 Prettier 配置
- [docs/SETUP_GIT_HOOKS.md](./docs/SETUP_GIT_HOOKS.md) - Git hooks 配置
- [docs/DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md) - 完整开发指南

## 环境变量配置

### 快速开始

```bash
# 1. 复制环境变量模板
cp .env.example .env

# 2. 根据需要编辑 .env 文件
# 编辑 NODE_ENV、PORT、ENABLE_RATE_LIMIT 等

# 3. 开始开发或部署
pnpm run dev              # 本地开发
docker-compose up -d         # Docker 部署
```

### 环境变量说明

| 变量名 | 默认值 | 说明 | 推荐环境 |
|-------|--------|------|---------|
| `NODE_ENV` | development | 运行环境 (development/production) | 全部 |
| `PORT` | 3001 | 服务端口 | 全部 |
| `ENABLE_RATE_LIMIT` | 0 | 启用速率限制 (1=启用, 0=禁用) | 生产环境 |
| `DEBUG` | - | 启用调试日志 | 开发环境 |
| `TZ` | Asia/Shanghai | 时区配置 | 生产环境 |

### 配置文件说明

- **`.env.example`** - 环境变量模板（提交到 Git）
- **`.env`** - 本地开发配置（不提交到 Git）
- **`.env.production`** - 生产环境配置（不提交到 Git）
- **`.env.development`** - 开发环境配置（不提交到 Git）
- **`.env.local`** - 本地敏感信息（最高优先级，不提交到 Git）

### 配置优先级

```
.env.local > .env > docker-compose.yml 默认值
```

### 本地开发配置

```bash
# 复制开发环境配置
cp .env.development .env

# 或手动创建 .env 文件
cat > .env << EOF
NODE_ENV=development
PORT=3001
ENABLE_RATE_LIMIT=0
EOF

# 启动开发环境
pnpm run dev
```

### Docker 部署配置

```bash
# 生产环境配置
cp .env.production .env

# Docker Compose 会自动读取 .env 文件
docker-compose up -d

# 查看环境变量是否生效
docker-compose exec app env | grep NODE_ENV
```

### 敏感信息管理

**重要：**
- ✅ `.env.example` 可以提交到 Git（模板文件）
- ❌ `.env`、`.env.local` 不要提交到 Git（已在 .gitignore 中）
- ✅ 敏感信息（密钥、数据库密码）放在 `.env.local` 中
- ✅ `.env.local` 会覆盖其他配置，优先级最高

## 开发
- pnpm run dev   (开发运行)
- pnpm run build (生产编译)
- pnpm start     (生产运行)

### 本地访问

**服务端渲染**（默认，对 SEO 友好）
```
http://localhost:3001/
```

**客户端渲染**（禁用 SSR）
```
http://localhost:3001/?nsbp=0
```

**服务端渲染回退**（如果 SSR 失败，自动回退到客户端渲染）
```
http://localhost:3001/?nsbp=1&from=link
```

> **参数说明**：`nsbp` 参数控制渲染模式
> - `nsbp=1` 或省略：服务端渲染（SSR，默认）
> - `nsbp=0`：客户端渲染（CSR）

## Docker 部署

**权限问题已修复！** 详细说明见下面的开发环境说明。

### 生产环境

使用 Makefile (推荐):

```bash
# 构建并启动
make prod

# 或分步执行
make build
make prod

# 查看日志
make logs

# 重启
make restart

# 进入容器
make shell

# 停止
make down

# 完全清理（删除镜像和卷）
make clean
```

或直接使用 Docker Compose:

```bash
# 构建镜像
docker-compose build

# 启动服务（后台运行）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问: http://localhost:3001

### 开发环境

⚠️ **重要提示**:
1. 首次启动开发环境需要等待构建完成，期间可能看到 `Cannot find module` 错误，这是正常的
2. 开发环境使用 volume 挂载，遇到权限问题时会自动修复
3. 如果遇到权限错误（EACCES），容器会自动修复权限（通过 entrypoint.sh）

```bash
# 启动开发环境（带热重载）
make dev

# 查看日志
make logs-dev

# 进入容器
make shell-dev

# 重启开发环境
make restart-dev

# 重新构建并启动
make rebuild-dev
```

或直接使用 Docker Compose:

```bash
# 构建并启动开发环境
docker-compose -f docker-compose.dev.yml up --build

# 后台运行
docker-compose -f docker-compose.dev.yml up -d --build

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止
docker-compose -f docker-compose.dev.yml down
```

### Docker 命令速查

```bash
# 查看所有可用命令
make help

# 生产环境
make build         # 构建镜像
make prod          # 启动生产环境
make logs          # 查看日志
make restart       # 重启容器
make shell         # 进入容器
make down          # 停止容器

# 开发环境
make build-dev     # 构建开发镜像
make dev           # 启动开发环境
make logs-dev      # 查看开发日志
make restart-dev   # 重启开发容器
make shell-dev     # 进入开发容器

# 通用命令
make clean         # 清理所有资源（镜像、卷等）
make rebuild       # 重新构建并启动生产环境
make rebuild-dev   # 重新构建并启动开发环境
```

### 环境变量

可在 `docker-compose.yml` 或 `docker-compose.dev.yml` 中配置环境变量：

- `NODE_ENV`: 运行环境 (production/development)
- `PORT`: 服务端口 (默认 3001)
- `ENABLE_RATE_LIMIT`: 启用速率限制 (1=启用，0=禁用，默认禁用)

## 安全特性

NSBP 内置了多层安全防护，默认启用生产级安全配置：

### 已启用的安全措施

#### 1. **HTTP 头部安全 (Helmet)**
- Content Security Policy (CSP): 防止 XSS 攻击
- X-Frame-Options: 防止点击劫持
- X-Content-Type-Options: 防止 MIME 类型嗅探
- Strict-Transport-Security: 强制 HTTPS
- X-XSS-Protection: XSS 保护
- Referrer-Policy: 控制引用信息

#### 2. **静态文件安全**
- ✅ 禁止访问 `.env`、`.git` 等敏感文件
- ✅ 静态资源缓存优化（1 年缓存）
- ✅ 请求体大小限制（10MB）

#### 3. **技术栈隐藏**
- ✅ 移除 `X-Powered-By` 头部
- ✅ 不暴露 Express 版本信息

#### 4. **速率限制 (可选)**
- ✅ 15 分钟内最多 100 次请求
- ✅ 自动限流恶意 IP
- ✅ 可通过环境变量启用/禁用

### 启用速率限制

在生产环境中，建议启用速率限制以防止 DDoS 攻击：

**Docker 方式：**
```bash
# docker-compose.yml 中添加
environment:
  - ENABLE_RATE_LIMIT=1
```

**本地开发方式：**
```bash
# .env 文件
ENABLE_RATE_LIMIT=1

# 或命令行
ENABLE_RATE_LIMIT=1 pnpm start
```

### 安全最佳实践

#### 生产环境建议
1. ✅ **启用 HTTPS**: 使用反向代理（Nginx/Apache）配置 SSL
2. ✅ **启用速率限制**: 防止暴力攻击和 DDoS
3. ✅ **设置强密码**: 数据库、API 密钥等
4. ✅ **定期更新依赖**: `pnpm update`
5. ✅ **配置防火墙**: 限制入站流量

#### 开发环境
- ✅ 默认配置已足够
- ❌ 不建议启用速率限制（影响开发效率）
- ✅ 保留详细错误日志便于调试

### 安全检查清单

部署前请确认：
- [ ] 已安装最新依赖 (`pnpm install`)
- [ ] 环境变量已配置（NODE_ENV=production）
- [ ] HTTPS 已配置
- [ ] 敏感信息（密钥、数据库密码）已移出代码库
- [ ] 速率限制已启用（生产环境）
- [ ] 静态文件访问已测试
- [ ] CSP 策略已测试（检查控制台错误）

### CLI 发布

从项目根目录发布 CLI 到 npm 注册表：

```bash
make publish-cli  # 同步模板、更新版本、发布到 npm
```

注意：此命令仅在项目根目录可用，生成的 NSBP 项目不包含此目标。