.PHONY: help build dev prod down clean logs restart env-dev env-prod env-local show-env

# Package manager detection
PNPM := $(shell which pnpm)
NPM := $(shell which npm)
ifeq ($(PNPM),)
	PM := npm
else
	PM := pnpm
endif

# Docker compose detection
COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images for production
	$(COMPOSE) -f docker/docker-compose.yml build

build-dev: ## Build Docker images for development
	$(COMPOSE) -f docker/docker-compose.dev.yml build

dev: ## Start development environment (removes orphan containers)
	$(COMPOSE) -f docker/docker-compose.dev.yml up --build --remove-orphans

prod: ## Start production environment (removes orphan containers)
	$(COMPOSE) -f docker/docker-compose.yml up -d --remove-orphans

down: ## Stop and remove containers (including orphan containers)
	$(COMPOSE) -f docker/docker-compose.yml down --remove-orphans
	$(COMPOSE) -f docker/docker-compose.dev.yml down --remove-orphans

clean: ## Stop containers, remove images and volumes (including orphan containers)
	$(COMPOSE) -f docker/docker-compose.yml down -v --rmi all --remove-orphans
	$(COMPOSE) -f docker/docker-compose.dev.yml down -v --rmi all --remove-orphans

logs: ## View logs
	$(COMPOSE) -f docker/docker-compose.yml logs -f

logs-dev: ## View development logs
	$(COMPOSE) -f docker/docker-compose.dev.yml logs -f

restart: ## Restart production containers
	$(COMPOSE) -f docker/docker-compose.yml restart

restart-dev: ## Restart development containers
	$(COMPOSE) -f docker/docker-compose.dev.yml restart

rebuild: ## Rebuild and restart production containers (removes orphan containers)
	$(COMPOSE) -f docker/docker-compose.yml up -d --build --remove-orphans

rebuild-dev: ## Rebuild and restart development containers (removes orphan containers)
	$(COMPOSE) -f docker/docker-compose.dev.yml up -d --build --remove-orphans

shell: ## Open shell in production container
	$(COMPOSE) -f docker/docker-compose.yml exec app sh

shell-dev: ## Open shell in development container
	$(COMPOSE) -f docker/docker-compose.dev.yml exec app sh

test: ## Run tests (if configured)
	$(COMPOSE) -f docker/docker-compose.yml exec app $(PM) test

env-dev: ## Set up development environment
	@if [ -f .env.development ]; then \
		cp .env.development .env && \
		echo -e "\033[0;32m✅ 开发环境已配置 (.env)\033[0m"; \
	else \
		echo -e "\033[0;33m⚠️  .env.development 不存在\033[0m"; \
	fi

env-prod: ## Set up production environment
	@if [ -f .env.production ]; then \
		cp .env.production .env && \
		echo -e "\033[0;32m✅ 生产环境已配置 (.env)\033[0m"; \
	else \
		echo -e "\033[0;33m⚠️  .env.production 不存在\033[0m"; \
	fi

env-local: ## Set up local environment with sensitive data
	@if [ ! -f .env.local ]; then \
		echo "# Local environment (contains sensitive data)" > .env.local && \
		echo "# DO NOT commit this file to Git" >> .env.local && \
		echo -e "\033[0;32m✅ .env.local 已创建\033[0m"; \
		echo "请编辑 .env.local 添加敏感信息"; \
	else \
		echo -e "\033[0;33m⚠️  .env.local 已存在\033[0m"; \
	fi

show-env: ## Show current environment variables
	@echo "========================================="
	@echo "当前环境变量配置"
	@echo "========================================="
	@echo ""
	@if [ -f .env ]; then \
		echo "📄 .env 文件内容："; \
		cat .env | grep -v "^#" | grep -v "^$$"; \
	else \
		echo "⚠️  .env 文件不存在"; \
	fi
	@echo ""
	@if [ -f .env.local ]; then \
		echo "📄 .env.local 文件存在（包含敏感信息）"; \
	fi