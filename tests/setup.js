// Test setup and configuration
import { jest } from '@jest/globals';

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'ktx_test_db';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.JWT_SECRET = 'test-secret';

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock external services for tests
jest.mock('../src/config/database.js', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
  },
  testConnection: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/config/redis.js', () => ({
  redisClient: {
    connect: jest.fn().mockResolvedValue(true),
    isOpen: true,
  },
  connectRedis: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/config/minio.js', () => ({
  minioClient: {
    bucketExists: jest.fn().mockResolvedValue(true),
    makeBucket: jest.fn().mockResolvedValue(true),
    setBucketPolicy: jest.fn().mockResolvedValue(true),
  },
  initializeMinio: jest.fn().mockResolvedValue(true),
}));
