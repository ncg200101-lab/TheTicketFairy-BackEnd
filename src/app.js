import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// Config imports
import config from './config/index.js';
import { testConnection } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { initializeMinio } from './config/minio.js';

// Model imports
import { syncModels } from './models/index.js';

// Route imports
import routes from './routes/index.js';

// Swagger imports
import { specs, swaggerUi } from './docs/swagger.js';

// Middleware imports
import { generalLimiter } from './middlewares/rateLimiter.js';
import responseHandler from './middlewares/responseHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();

// Initialize services
const initializeServices = async () => {
  try {
    console.log('🚀 Initializing services...');
    
    // Test database connection
    await testConnection();
    
    // Connect to Redis
    await connectRedis();
    
    // Initialize MinIO
    await initializeMinio();
    
    // Sync database models
    await syncModels();
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting (apply to all routes)
app.use(generalLimiter);

// Response handler middleware (add res.success and res.error)
app.use(responseHandler);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TheTickerFairy API Documentation',
}));

// Routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🔄 Received ${signal}. Graceful shutdown...`);
  
  const server = global.server;
  if (server) {
    server.close(() => {
      console.log('💤 HTTP server closed.');
      
      // Close database connections, Redis, etc.
      // eslint-disable-next-line no-process-exit
      process.exit(0);
    });
    
    // Force close server after 10s
    setTimeout(() => {
      console.error('🔴 Could not close connections in time, forcefully shutting down');
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }, 10000);
  } else {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Initialize services and start server
const startServer = async () => {
  try {
    await initializeServices();
    
    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(`🚀 Server running on http://${config.server.host}:${config.server.port}`);
      console.log(`📖 Environment: ${config.server.nodeEnv}`);
      console.log(`📊 Health check: http://${config.server.host}:${config.server.port}/health`);
    });

    // Make server available for graceful shutdown
    global.server = server;
    
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default app;
