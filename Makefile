.PHONY: help build dev prod down clean logs restart publish-cli

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
	$(COMPOSE) build

build-dev: ## Build Docker images for development
	$(COMPOSE) -f docker-compose.dev.yml build

dev: ## Start development environment (removes orphan containers)
	$(COMPOSE) -f docker-compose.dev.yml up --build --remove-orphans

prod: ## Start production environment (removes orphan containers)
	$(COMPOSE) up -d --remove-orphans

down: ## Stop and remove containers (including orphan containers)
	$(COMPOSE) down --remove-orphans
	$(COMPOSE) -f docker-compose.dev.yml down --remove-orphans

clean: ## Stop containers, remove images and volumes (including orphan containers)
	$(COMPOSE) down -v --rmi all --remove-orphans
	$(COMPOSE) -f docker-compose.dev.yml down -v --rmi all --remove-orphans

logs: ## View logs
	$(COMPOSE) logs -f

logs-dev: ## View development logs
	$(COMPOSE) -f docker-compose.dev.yml logs -f

restart: ## Restart production containers
	$(COMPOSE) restart

restart-dev: ## Restart development containers
	$(COMPOSE) -f docker-compose.dev.yml restart

rebuild: ## Rebuild and restart production containers (removes orphan containers)
	$(COMPOSE) up -d --build --remove-orphans

rebuild-dev: ## Rebuild and restart development containers (removes orphan containers)
	$(COMPOSE) -f docker-compose.dev.yml up -d --build --remove-orphans

shell: ## Open shell in production container
	$(COMPOSE) exec app sh

shell-dev: ## Open shell in development container
	$(COMPOSE) -f docker-compose.dev.yml exec app sh

test: ## Run tests (if configured)
	$(COMPOSE) exec app $(PM) test

publish-cli: ## Publish CLI to npm registry
	@echo "🚀 Starting CLI publish process..."
	cd cli && $(PM) run update
	@echo "📦 Template updated, committing changes..."
	git add .
	git diff --quiet && git diff --cached --quiet || git commit -m "chore: update cli template"
	@echo "🔖 Updating version..."
	cd cli && npm version patch --no-git-tag-version
	@echo "🔄 Updating README.md with new version..."
	@NEW_VERSION=$$(cd cli && node -p "require('./package.json').version") && cd cli && sed -i '' "s/- \*\*Version\*\*: .*/- \*\*Version\*\*: \`$$NEW_VERSION\`/" README.md
	@echo "📝 Generating changelog from commit history..."
	cd cli && $(PM) run update-changelog
	@echo "📦 Committing version bump, README and CHANGELOG updates..."
	git add cli/package.json cli/README.md cli/CHANGELOG.md
	git commit -m "chore: bump version to v$$(cd cli && node -p "require('./package.json').version")"
	@echo "🏷️  Creating git tag..."
	git tag -a "v$$(cd cli && node -p "require('./package.json').version")" -m "Version $$(cd cli && node -p "require('./package.json').version")"
	@echo "📤 Publishing to npm..."
	cd cli && npm publish
	@echo "📤 Pushing to git repository..."
	git push --follow-tags
	@echo "✅ CLI published successfully!"
