# Makefile cho KTX Backend Project
.PHONY: help dev migrate lint test swagger clean install docker-up docker-down

# Colors for output
GREEN=\033[0;32m
YELLOW=\033[0;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Default target
help: ## Hiển thị trợ giúp
	@echo "$(GREEN)KTX Backend Project - Available commands:$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Cài đặt dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm ci

dev: ## Chạy ứng dụng development với nodemon
	@echo "$(GREEN)Starting development server...$(NC)"
	npm run dev

migrate: ## Chạy database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	npm run migrate

migrate-undo: ## Rollback migration cuối cùng
	@echo "$(YELLOW)Rolling back last migration...$(NC)"
	npm run migrate:undo

seed: ## Chạy database seeders
	@echo "$(GREEN)Running database seeders...$(NC)"
	npm run seed

seed-undo: ## Rollback tất cả seeders
	@echo "$(YELLOW)Rolling back all seeders...$(NC)"
	npm run seed:undo

lint: ## Chạy ESLint check
	@echo "$(GREEN)Running ESLint...$(NC)"
	npm run lint

lint-fix: ## Tự động fix ESLint errors
	@echo "$(GREEN)Fixing ESLint errors...$(NC)"
	npm run lint:fix

format: ## Format code với Prettier
	@echo "$(GREEN)Formatting code with Prettier...$(NC)"
	npm run format

format-check: ## Kiểm tra Prettier formatting
	@echo "$(GREEN)Checking Prettier formatting...$(NC)"
	npm run format:check

test: ## Chạy tests
	@echo "$(GREEN)Running tests...$(NC)"
	npm test

test-watch: ## Chạy tests với watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	npm run test:watch

test-coverage: ## Chạy tests với coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	npm test -- --coverage

swagger: ## Build lại Swagger documentation
	@echo "$(GREEN)Swagger documentation is auto-generated from code comments$(NC)"
	@echo "$(YELLOW)Visit http://localhost:3000/api-docs when server is running$(NC)"

docker-up: ## Chạy Docker containers (production)
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	docker-compose up -d

docker-up-dev: ## Chạy Docker containers cho development
	@echo "$(GREEN)Starting Docker containers for development...$(NC)"
	docker-compose -f docker-compose.dev.yml up -d

docker-down: ## Dừng Docker containers (development)
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose -f docker-compose.dev.yml down

docker-logs: ## Xem Docker logs (development)
	@echo "$(GREEN)Showing Docker logs...$(NC)"
	docker-compose -f docker-compose.dev.yml logs -f

docker-rebuild: ## Rebuild và restart Docker containers (development)
	@echo "$(GREEN)Rebuilding Docker containers...$(NC)"
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.dev.yml build --no-cache
	docker-compose -f docker-compose.dev.yml up -d

docker-cleanup: ## Cleanup tất cả Docker containers và networks
	@echo "$(YELLOW)Cleaning up Docker containers...$(NC)"
	npm run docker:cleanup

clean: ## Dọn dẹp node_modules và cache
	@echo "$(YELLOW)Cleaning up...$(NC)"
	rm -rf node_modules
	rm -rf coverage
	rm -rf .nyc_output
	npm cache clean --force

setup: install validate-env migrate seed ## Thiết lập dự án từ đầu
	@echo "$(GREEN)Project setup completed!$(NC)"

validate-env: ## Kiểm tra biến môi trường
	@echo "$(GREEN)Validating environment variables...$(NC)"
	npm run validate:env

reset-db: ## Reset database (rollback và migrate lại)
	@echo "$(YELLOW)Resetting database...$(NC)"
	npm run seed:undo
	npm run migrate:undo
	npm run migrate
	npm run seed
	@echo "$(GREEN)Database reset completed!$(NC)"

check: lint format-check test ## Chạy tất cả checks (lint, format, test)
	@echo "$(GREEN)All checks completed!$(NC)"

start: ## Chạy production server
	@echo "$(GREEN)Starting production server...$(NC)"
	npm start

# Development workflow targets
dev-setup: clean install migrate seed ## Thiết lập môi trường development
	@echo "$(GREEN)Development environment setup completed!$(NC)"
	@echo "$(YELLOW)Run 'make dev' to start the development server$(NC)"

prod-setup: install migrate ## Thiết lập môi trường production
	@echo "$(GREEN)Production environment setup completed!$(NC)"
	@echo "$(YELLOW)Run 'make start' to start the production server$(NC)"

# Database operations
migration-create: ## Tạo migration mới - Usage: make migration-create NAME=create-users
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)Error: Vui lòng cung cấp tên migration$(NC)"; \
		echo "$(YELLOW)Usage: make migration-create NAME=create-users$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Creating migration: $(NAME)...$(NC)"
	npx sequelize-cli migration:generate --name $(NAME)

seeder-create: ## Tạo seeder mới - Usage: make seeder-create NAME=demo-users
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)Error: Vui lòng cung cấp tên seeder$(NC)"; \
		echo "$(YELLOW)Usage: make seeder-create NAME=demo-users$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Creating seeder: $(NAME)...$(NC)"
	npx sequelize-cli seed:generate --name $(NAME)

db-status: ## Kiểm tra trạng thái database
	@echo "$(GREEN)Checking database status...$(NC)"
	npx sequelize-cli db:migrate:status

db-create: ## Tạo database
	@echo "$(GREEN)Creating database...$(NC)"
	npx sequelize-cli db:create

db-drop: ## Xóa database
	@echo "$(RED)Dropping database...$(NC)"
	npx sequelize-cli db:drop

# Utility targets
logs: ## Xem application logs (nếu có)
	@echo "$(GREEN)Showing application logs...$(NC)"
	tail -f logs/*.log 2>/dev/null || echo "$(YELLOW)No log files found$(NC)"

health: ## Kiểm tra health của ứng dụng
	@echo "$(GREEN)Checking application health...$(NC)"
	curl -f http://localhost:3000/health || echo "$(RED)Application is not running$(NC)"

info: ## Hiển thị thông tin dự án
	@echo "$(GREEN)Project Information:$(NC)"
	@echo "$(YELLOW)Node version:$(NC) $$(node --version)"
	@echo "$(YELLOW)NPM version:$(NC) $$(npm --version)"
	@echo "$(YELLOW)Docker version:$(NC) $$(docker --version 2>/dev/null || echo 'Not installed')"
	@echo "$(YELLOW)Docker Compose version:$(NC) $$(docker-compose --version 2>/dev/null || echo 'Not installed')"
