/**
 * Script kiểm tra tất cả services có hoạt động đúng không
 * Chạy: node src/scripts/health-check.js
 */

import { testConnection } from '../config/database.js';
import { redisClient, connectRedis } from '../config/redis.js';
import { minioClient } from '../config/minio.js';
import config from '../config/index.js';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const checkDatabase = async () => {
  try {
    await testConnection();
    log('✅ PostgreSQL: Connected', colors.green);
    return true;
  } catch (error) {
    log(`❌ PostgreSQL: Failed - ${error.message}`, colors.red);
    return false;
  }
};

const checkRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await connectRedis();
    }
    await redisClient.ping();
    log('✅ Redis: Connected', colors.green);
    return true;
  } catch (error) {
    log(`❌ Redis: Failed - ${error.message}`, colors.red);
    return false;
  }
};

const checkMinIO = async () => {
  try {
    const bucketName = config.minio.bucketName;
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (bucketExists) {
      log(`✅ MinIO: Connected (bucket: ${bucketName})`, colors.green);
      return true;
    } else {
      log(`⚠️  MinIO: Connected but bucket '${bucketName}' not found`, colors.yellow);
      log(`   Run: node src/scripts/init-minio.js`, colors.blue);
      return false;
    }
  } catch (error) {
    log(`❌ MinIO: Failed - ${error.message}`, colors.red);
    return false;
  }
};

const checkEnvironment = () => {
  log('\n🔍 Environment Check:', colors.blue);
  
  const requiredEnvs = [
    'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
    'REDIS_HOST', 'REDIS_PORT',
    'MINIO_ENDPOINT', 'MINIO_PORT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY', 'MINIO_BUCKET_NAME'
  ];
  
  let allSet = true;
  
  requiredEnvs.forEach(env => {
    if (process.env[env]) {
      log(`✅ ${env}: Set`, colors.green);
    } else {
      log(`❌ ${env}: Missing`, colors.red);
      allSet = false;
    }
  });
  
  return allSet;
};

const main = async () => {
  log('🏥 KTX Backend Health Check\n', colors.blue);
  
  // Check environment variables
  const envOk = checkEnvironment();
  
  log('\n🔌 Services Check:', colors.blue);
  
  // Check all services
  const [dbOk, redisOk, minioOk] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkMinIO()
  ]);
  
  log('\n📋 Summary:', colors.blue);
  
  const allOk = envOk && dbOk && redisOk && minioOk;
  
  if (allOk) {
    log('🎉 All systems operational!', colors.green);
    log('\n🚀 Ready to start development:', colors.blue);
    log('   npm run dev', colors.green);
  } else {
    log('❌ Some systems have issues', colors.red);
    log('\n🔧 Setup steps:', colors.blue);
    
    if (!envOk) {
      log('   1. Check .env file configuration', colors.yellow);
    }
    if (!dbOk) {
      log('   2. Start PostgreSQL: docker-compose -f docker-compose.dev.yml up postgres -d', colors.yellow);
    }
    if (!redisOk) {
      log('   3. Start Redis: docker-compose -f docker-compose.dev.yml up redis -d', colors.yellow);
    }
    if (!minioOk) {
      log('   4. Start MinIO and run: node src/scripts/init-minio.js', colors.yellow);
    }
  }
  
  // eslint-disable-next-line no-process-exit
  process.exit(allOk ? 0 : 1);
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Health check interrupted');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

main().catch(error => {
  log(`💥 Health check failed: ${error.message}`, colors.red);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
