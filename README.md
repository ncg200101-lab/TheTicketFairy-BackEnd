# TheTicketFairy BackEnd Project
🚀 Node.js Express Base Project

A complete, production-ready Node.js/Express base project template with PostgreSQL, Redis, MinIO, and modern development tools. Use this as a starting point for any backend API project.

## ✨ Features

- **Node.js 20+** with ES Modules
- **Express.js** framework with clean MVC architecture
- **PostgreSQL 15** with Sequelize ORM and CLI migrations
- **Redis** for caching and session storage
- **MinIO** for object storage (file upload/download)
- **Swagger/OpenAPI 3** for API documentation
- **Internationalization (i18n)** - Multi-language support
- **Docker & Docker Compose** for containerization
- **Makefile** for task automation
- **GitHub Actions** CI/CD pipeline
- **ESLint & Prettier** for code quality
- **Jest** for testing
- **Rate limiting** and security middleware
- **Comprehensive logging** system
- **Input validation** and error handling

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database, Redis, MinIO configuration
│   ├── controllers/     # Request handlers
│   ├── database/        # Migrations and seeders
│   │   ├── migrations/  # Database migrations
│   │   └── seeders/     # Database seeders
│   ├── docs/            # API documentation (Swagger)
│   ├── i18n/            # Internationalization files
│   ├── middlewares/     # Middlewares (auth, validation, etc.)
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic layer
│   ├── scripts/         # Utility scripts
│   └── app.js           # Main application file
├── tests/               # Test files
├── .github/workflows/   # GitHub Actions
├── docker-compose.yml   # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Dockerfile
└── README.md
```

## 🛠️ System Requirements

- **Node.js 20+**
- **Docker & Docker Compose**
- **PostgreSQL 15** (if running locally)
- **Redis** (if running locally)
- **MinIO** (if running locally)

## 🚀 Quick Start

### 1. Using Docker Compose (Recommended)

#### Development setup:
```bash
# Clone repository
git clone <your-repository-url>
cd backend

# Copy and configure environment variables
cp .env.example .env
# Edit .env according to your needs

# Start all services (development mode)
make docker-up-dev

# View logs
make docker-logs

# Stop services
make docker-down
```

#### Production setup:
```bash
# Start production setup
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env for your local environment

# Start PostgreSQL, Redis, MinIO with Docker
docker-compose up -d postgres redis minio

# Run database migrations
make migrate

# Seed database with sample data (optional)
make seed

# Start development server
make dev
```

### 3. Using Makefile Commands

```bash
# View all available commands
make help

# Setup project from scratch
make setup

# Start development server
make dev

# Run database migrations
make migrate

# Create new migration
make migration-create NAME=create-users

# Create new seeder
make seeder-create NAME=demo-users

# Run tests
make test

# Lint and format code
make lint
```

## 🗄️ Database Management

### Database Migrations

This project uses Sequelize CLI for database migrations and seeders.

#### Creating Migrations
```bash
# Create new migration
make migration-create NAME=create-users
make migration-create NAME=add-user-avatar
make migration-create NAME=create-products

# Create new seeder
make seeder-create NAME=demo-users
make seeder-create NAME=demo-products
```

#### Running Migrations
```bash
# Run all pending migrations
make migrate
# or
npm run migrate

# Rollback last migration
make migrate-undo
# or
npm run migrate:undo

# Check migration status
make db-status
```

#### Seeding Database
```bash
# Run all seeders
make seed
# or
npm run seed

# Rollback all seeders
make seed-undo
# or
npm run seed:undo
```

### Example Database Schema

The project includes example models and migrations for reference:

**`example_items` table:**
- `id` (INTEGER, AUTO INCREMENT, PRIMARY KEY)
- `name` (STRING, NOT NULL)
- `description` (TEXT)
- `status` (ENUM: 'active', 'inactive', 'draft')
- `metadata` (JSONB)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## 📝 API Documentation

API Documentation is automatically generated using Swagger/OpenAPI 3.

### Accessing Documentation
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Interactive API Testing**: Test endpoints directly in Swagger UI

### Core Endpoints
- `GET /health` - Health check endpoint
- `GET /ping` - Simple ping test
- `GET /api/v1/examples` - Get all examples (with pagination)
- `POST /api/v1/examples` - Create new example
- `GET /api/v1/examples/:id` - Get example by ID
- `PUT /api/v1/examples/:id` - Update example
- `DELETE /api/v1/examples/:id` - Delete example

### Internationalization (i18n)

The API supports multiple languages through the `Accept-Language` header:

```bash
# English responses
curl -H "Accept-Language: en" http://localhost:3000/api/v1/examples

# Vietnamese responses  
curl -H "Accept-Language: vi" http://localhost:3000/api/v1/examples
```

### Example Response Format
```json
{
  "success": true,
  "message": "Examples retrieved successfully.",
  "messageCode": "example.get_all.success",
  "data": [...],
  "error": null
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Using Makefile
make test
make test-coverage
```

## 🔧 Development Tools

### Code Quality
```bash
# Run ESLint
npm run lint
make lint

# Fix ESLint errors automatically
npm run lint:fix
make lint-fix

# Check Prettier formatting
npm run format:check
make format-check

# Format code with Prettier
npm run format
make format
```

### Development Database Tools

When running with `docker-compose.dev.yml`, you can access:

- **Adminer** (PostgreSQL Admin): http://localhost:8080
- **Redis Commander**: http://localhost:8081  
- **MinIO Console**: http://localhost:9001

## 🌍 Environment Variables

Create a `.env` file and configure the following variables:

```env
# Server
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=app-files
MINIO_USE_SSL=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# API
API_VERSION=v1
API_PREFIX=/api

# Internationalization
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,vi
```

## 🚢 Deployment

### GitHub Actions CI/CD

The project uses GitHub Actions to automatically:
1. Run tests and linting
2. Build Docker image
3. Security scanning
4. Deploy (configure secrets as needed)

### Docker Hub

To push images to Docker Hub, configure these secrets in GitHub:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### Production Deployment

1. **Server Setup:**
   ```bash
   # On production server
   git clone <your-repository-url>
   cd backend
   
   # Configure production environment
   cp .env.example .env.production
   # Edit .env.production with production values
   
   # Start production stack
   docker-compose up -d
   ```

2. **Database Setup:**
   ```bash
   # Run migrations on production
   docker-compose exec backend npm run migrate
   ```

3. **SSL/HTTPS Setup:**
   - Use reverse proxy (Nginx/Traefik)
   - Configure SSL certificates (Let's Encrypt recommended)

## 📊 Monitoring

### Health Checks
- Application: `GET /health`
- Database: Checked in health endpoint
- Redis: Checked in health endpoint  
- MinIO: Checked in health endpoint

### Logs
```bash
# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

## 🔐 Security Features

- **Helmet.js** for security headers
- **Rate limiting** for API endpoints
- **CORS** configuration
- **Input validation** with middleware
- **File upload** restrictions and validation
- **Environment-based configuration**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Create a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write tests for new features
- Follow conventional commit messages
- Update documentation when needed
- Ensure all tests pass before submitting PR

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection error:**
   ```bash
   # Check PostgreSQL container
   docker-compose ps postgres
   docker-compose logs postgres
   ```

2. **Redis connection error:**
   ```bash
   # Check Redis container
   docker-compose ps redis
   docker-compose logs redis
   ```

3. **MinIO connection error:**
   ```bash
   # Check MinIO container
   docker-compose ps minio
   docker-compose logs minio
   ```

4. **Port already in use:**
   ```bash
   # Find process using port
   lsof -i :3000
   # Or change PORT in .env file
   ```

### Debug Mode

```bash
# Run with debug logs
DEBUG=* npm run dev

# Run tests with debug
DEBUG=* npm test
```

## 📞 Support

- GitHub Issues: [Create an issue](https://github.com/your-username/your-repo/issues)
- Documentation: [Project Wiki](https://github.com/your-username/your-repo/wiki)
- Email: your-email@example.com

---

## 🎯 Using This Template

This is a base project template. To use it for your specific project:

1. **Clone the repository**
2. **Update project name** in `package.json` and README
3. **Configure environment variables** for your needs
4. **Modify example models/controllers** to match your domain
5. **Add your business logic** to services and controllers
6. **Update i18n messages** for your application
7. **Configure deployment** settings for your infrastructure

The template provides a solid foundation with best practices, security, testing, and deployment ready to go!
