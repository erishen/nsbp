# NSBP 环境变量配置指南

## 快速开始

```bash
# 1. 复制环境变量模板
cp .env.example .env

# 2. 根据需要编辑 .env
nano .env

# 3. 开始开发或部署
pnpm run dev              # 本地开发
docker-compose up -d         # Docker 部署
```

---

## 配置文件说明

### 文件优先级

```
.env.local (最高优先级) → .env → docker-compose.yml 默认值
```

### 文件列表

| 文件名 | 说明 | 提交到 Git | 使用场景 |
|-------|------|-----------|---------|
| `.env.example` | 环境变量模板 | ✅ 提交 | 新项目初始化 |
| `.env` | 默认环境配置 | ❌ 不提交 | 日常开发/部署 |
| `.env.development` | 开发环境配置 | ❌ 不提交 | 切换到开发环境 |
| `.env.production` | 生产环境配置 | ❌ 不提交 | 切换到生产环境 |
| `.env.local` | 本地敏感信息 | ❌ 不提交 | 存储密钥、密码等 |

---

## 快速切换环境

### 使用 Makefile（推荐）

```bash
# 切换到开发环境
make env-dev

# 切换到生产环境
make env-prod

# 创建本地配置文件
make env-local

# 查看当前配置
make show-env
```

### 手动方式

```bash
# 切换到开发环境
cp .env.development .env

# 切换到生产环境
cp .env.production .env

# 创建本地配置
cp .env.example .env.local
```

---

## 环境变量说明

### 基础配置

```bash
# 运行环境
NODE_ENV=development        # 或 production

# 服务端口
PORT=3001

# 时区
TZ=Asia/Shanghai
```

### 安全配置

```bash
# 启用速率限制
ENABLE_RATE_LIMIT=1        # 1=启用，0=禁用
```

**建议：**
- ✅ 开发环境：`ENABLE_RATE_LIMIT=0`（不影响开发效率）
- ✅ 生产环境：`ENABLE_RATE_LIMIT=1`（防止 DDoS 攻击）

### 调试配置

```bash
# 启用详细日志
DEBUG=nsbp:*
```

---

## 使用场景

### 场景 1：新项目初始化

```bash
# 1. 克隆项目
git clone <repository-url>
cd nsbp

# 2. 复制环境变量模板
cp .env.example .env

# 3. 安装依赖
pnpm install

# 4. 启动开发环境
pnpm run dev
```

### 场景 2：日常开发

```bash
# 使用开发环境配置
make env-dev

# 启动开发环境
pnpm run dev
```

### 场景 3：Docker 部署

```bash
# 切换到生产环境
make env-prod

# 启动 Docker 容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 场景 4：敏感信息管理

```bash
# 1. 创建本地配置文件
make env-local

# 2. 编辑 .env.local 添加敏感信息
nano .env.local

# 添加内容：
# DATABASE_URL=postgresql://user:pass@localhost:5432/db
# API_SECRET=your-secret-key
# JWT_SECRET=jwt-secret-key

# .env.local 会自动覆盖 .env 中的同名变量
```

---

## 最佳实践

### ✅ 推荐做法

1. **始终使用 .env 文件**
   ```bash
   # 不要在代码中硬编码
   const PORT = process.env.PORT || 3001  # ✅
   const PORT = 3001  # ❌
   ```

2. **分离敏感信息**
   ```bash
   # .env - 非敏感配置（可以分享给团队）
   NODE_ENV=development
   PORT=3001
   ENABLE_RATE_LIMIT=0

   # .env.local - 敏感配置（个人使用）
   DATABASE_URL=postgresql://localhost/db
   API_KEY=secret-key-123
   ```

3. **提供 .env.example**
   ```bash
   # .env.example - 示例配置（提交到 Git）
   NODE_ENV=development
   PORT=3001
   ENABLE_RATE_LIMIT=0
   # API_KEY=your-api-key  # 提供示例，不包含真实值
   ```

4. **使用环境前缀**
   ```bash
   # 命名规范
   NSBP_NODE_ENV=development
   NSBP_PORT=3001
   NSBP_ENABLE_RATE_LIMIT=0
   ```

### ❌ 避免做法

1. **不要提交 .env 到 Git**
   ```bash
   # .gitignore 已包含
   .env
   .env.local
   .env.*.local
   ```

2. **不要在代码中硬编码敏感信息**
   ```javascript
   // ❌ 错误做法
   const dbPassword = "my-password-123"
   
   // ✅ 正确做法
   const dbPassword = process.env.DB_PASSWORD
   ```

3. **不要在 .env.example 中包含真实值**
   ```bash
   # .env.example - 只提供示例
   API_KEY=your-api-key-here  # ✅
   API_KEY=sk-1234567890abcdef  # ❌
   ```

---

## Docker Compose 集成

### 自动读取 .env

Docker Compose 会自动读取项目根目录下的 `.env` 文件：

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - PORT=${PORT:-3001}
      - ENABLE_RATE_LIMIT=${ENABLE_RATE_LIMIT:-1}
```

### 使用方式

```bash
# 1. 创建 .env 文件
cp .env.production .env

# 2. Docker Compose 自动读取
docker-compose up -d

# 3. 验证环境变量
docker-compose exec app env | grep NODE_ENV
```

---

## 故障排除

### 问题 1：环境变量未生效

**检查步骤：**
```bash
# 1. 检查 .env 文件是否存在
ls -la .env

# 2. 查看文件内容
cat .env

# 3. 验证格式（等号两边不要有空格）
NODE_ENV=development  # ✅
NODE_ENV = development  # ❌

# 4. 重启服务
docker-compose restart
```

### 问题 2：敏感信息泄露

**预防措施：**
```bash
# 1. 检查 .gitignore
cat .gitignore | grep .env

# 2. 验证文件未被提交
git ls-files | grep .env

# 3. 如果已提交，从历史记录中移除
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env'
```

### 问题 3：环境变量优先级混乱

**验证方法：**
```bash
# 1. 显示容器中的环境变量
docker-compose exec app env | sort

# 2. 查看实际生效的值
docker-compose exec app sh -c 'echo $NODE_ENV'

# 3. 检查 .env.local 是否覆盖了预期值
cat .env.local | grep NODE_ENV
```

---

## 常用命令速查

```bash
# 查看当前配置
make show-env

# 切换开发环境
make env-dev

# 切换生产环境
make env-prod

# 创建本地配置
make env-local

# 查看容器环境变量
docker-compose exec app env

# 验证特定变量
docker-compose exec app sh -c 'echo $ENABLE_RATE_LIMIT'
```

---

## 参考资源

- [Docker Compose 环境变量](https://docs.docker.com/compose/environment-variables/)
- [Node.js process.env](https://nodejs.org/api/process.html#process_process_env)
- [十二因子应用](https://12factor.net/)
