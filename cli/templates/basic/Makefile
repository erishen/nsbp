.PHONY: help build dev prod down clean logs restart

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images for production
	docker-compose build

build-dev: ## Build Docker images for development
	docker-compose -f docker-compose.dev.yml build

dev: ## Start development environment (removes orphan containers)
	docker-compose -f docker-compose.dev.yml up --build --remove-orphans

prod: ## Start production environment (removes orphan containers)
	docker-compose up -d --remove-orphans

down: ## Stop and remove containers (including orphan containers)
	docker-compose down --remove-orphans
	docker-compose -f docker-compose.dev.yml down --remove-orphans

clean: ## Stop containers, remove images and volumes (including orphan containers)
	docker-compose down -v --rmi all --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans

logs: ## View logs
	docker-compose logs -f

logs-dev: ## View development logs
	docker-compose -f docker-compose.dev.yml logs -f

restart: ## Restart production containers
	docker-compose restart

restart-dev: ## Restart development containers
	docker-compose -f docker-compose.dev.yml restart

rebuild: ## Rebuild and restart production containers (removes orphan containers)
	docker-compose up -d --build --remove-orphans

rebuild-dev: ## Rebuild and restart development containers (removes orphan containers)
	docker-compose -f docker-compose.dev.yml up -d --build --remove-orphans

shell: ## Open shell in production container
	docker-compose exec app sh

shell-dev: ## Open shell in development container
	docker-compose -f docker-compose.dev.yml exec app sh

test: ## Run tests (if configured)
	docker-compose exec app npm test
