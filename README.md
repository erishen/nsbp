# 开发
- npm run dev   (开发运行)
- npm run build (生产编译)
- npm start     (生产运行)

客户端渲染
http://localhost:3001/

服务端渲染
http://localhost:3001/?seo=1

服务端渲染不成功，改为客户端渲染
http://localhost:3001/?seo=1&from=link

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

### CLI 发布

从项目根目录发布 CLI 到 npm 注册表：

```bash
make publish-cli  # 同步模板、更新版本、发布到 npm
```

注意：此命令仅在项目根目录可用，生成的 NSBP 项目不包含此目标。