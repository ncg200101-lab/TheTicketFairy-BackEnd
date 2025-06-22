/**
 * Script khởi tạo MinIO bucket cho lần đầu setup
 * Chạy: node src/scripts/init-minio.js
 */

import { minioClient } from '../config/minio.js';
import config from '../config/index.js';
import loggerService from '../services/loggerService.js';

const initializeMinIO = async () => {
  try {
    console.log('🚀 Initializing MinIO...');
    
    const bucketName = config.minio.bucketName;
    
    // Kiểm tra bucket đã tồn tại chưa
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (bucketExists) {
      console.log(`✅ Bucket '${bucketName}' already exists`);
      loggerService.logSystem('minio.bucket.exists', `Bucket ${bucketName} already exists`);
    } else {
      // Tạo bucket mới
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ Bucket '${bucketName}' created successfully`);
      loggerService.logSystem('minio.bucket.created', `Bucket ${bucketName} created successfully`);
    }
    
    // Set bucket policy (public read cho development)
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    
    try {
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      console.log(`✅ Bucket policy set for '${bucketName}'`);
    } catch (policyError) {
      console.log(`⚠️  Could not set bucket policy: ${policyError.message}`);
    }
    
    // Test connection by just creating the stream
    minioClient.listObjects(bucketName, '', false);
    console.log(`✅ MinIO connection test successful`);
    
    console.log('🎉 MinIO initialization completed!');
    console.log(`📦 Bucket: ${bucketName}`);
    console.log(`🌐 Endpoint: http://${config.minio.endPoint}:${config.minio.port}`);
    console.log(`🔑 Access Key: ${config.minio.accessKey}`);
    
  } catch (error) {
    console.error('❌ MinIO initialization failed:', error.message);
    loggerService.logSystem('minio.init.failed', `MinIO initialization failed: ${error.message}`);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

// Chạy script nếu được gọi trực tiếp
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeMinIO();
}

export default initializeMinIO;
