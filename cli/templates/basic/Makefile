.PHONY: help build dev prod down clean logs restart publish-cli

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

publish-cli: ## Publish CLI to npm registry
	@echo "🚀 Starting CLI publish process..."
	cd cli && npm run update
	@echo "📦 Template updated, committing changes..."
	git add .
	git diff --quiet && git diff --cached --quiet || git commit -m "chore: update cli template"
	@echo "🔖 Updating version..."
	cd cli && npm version patch --no-git-tag-version
	@echo "📝 Committing version bump..."
	git add cli/package.json
	git commit -m "chore: bump version to v$$(cd cli && node -p "require('./package.json').version")"
	@echo "🏷️  Creating git tag..."
	git tag -a "v$$(cd cli && node -p "require('./package.json').version")" -m "Version $$(cd cli && node -p "require('./package.json').version")"
	@echo "📤 Publishing to npm..."
	cd cli && npm publish
	@echo "📤 Pushing to git repository..."
	git push --follow-tags
	@echo "✅ CLI published successfully!"
