# Docker 快速启动指南

🌐 **Online Demo**: [https://nsbp.erishen.cn/](https://nsbp.erishen.cn/)

## 5 分钟快速开始

### 生产环境（推荐用于生产部署）

```bash
# 1. 构建并启动
docker-compose up -d

# 2. 查看状态
docker-compose ps

# 3. 查看日志（可选）
docker-compose logs -f

# 4. 访问应用
open http://localhost:3001
```

完成！🎉

### 开发环境（推荐用于开发）

```bash
# 1. 构建并启动（前台运行，可查看构建日志）
docker-compose -f docker-compose.dev.yml up --build

# 2. 等待看到 "Server listening on port 3001"
# （首次启动需要 1-3 分钟进行构建）

# 3. 访问应用
open http://localhost:3001

# 4. 修改代码，自动热重载
```

**提示：** 如果想在后台运行：
```bash
docker-compose -f docker-compose.dev.yml up -d --build
docker-compose -f docker-compose.dev.yml logs -f
```

## 常用命令

### 生产环境
```bash
make prod         # 启动
make logs         # 查看日志
make restart      # 重启
make down         # 停止
make clean        # 完全清理
```

### 开发环境
```bash
make dev          # 启动（带热重载）
make logs-dev     # 查看日志
make restart-dev   # 重启
```

### 通用
```bash
make help         # 查看所有命令
make shell        # 进入生产容器
make shell-dev    # 进入开发容器
```

## 验证安装

检查 Docker 是否正确安装：
```bash
docker --version
docker-compose --version
```

测试配置：
```bash
./scripts/verify-dev.sh
```

## 遇到问题？

- 查看 README.md 中的 Docker 部署章节
- 运行 `./scripts/verify-dev.sh` 验证开发环境状态
- 确保 Docker 守护进程正在运行

## 目录说明

- `Dockerfile` - 生产环境镜像
- `Dockerfile.dev` - 开发环境镜像
- `docker-compose.yml` - 生产环境配置
- `docker-compose.dev.yml` - 开发环境配置
- `Makefile` - 快捷命令
- `scripts/verify-dev.sh` - 开发环境验证脚本
- `README.md` - 完整文档
- `QUICKSTART.md` - 本文档
