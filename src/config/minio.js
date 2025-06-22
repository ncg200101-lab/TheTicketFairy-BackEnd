import * as Minio from 'minio';
import config from './index.js';

const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

const initializeMinio = async () => {
  try {
    // Check if bucket exists, create if not
    const bucketExists = await minioClient.bucketExists(config.minio.bucketName);
    
    if (!bucketExists) {
      await minioClient.makeBucket(config.minio.bucketName, 'us-east-1');
      console.log(`✅ MinIO bucket '${config.minio.bucketName}' created successfully`);
    } else {
      console.log(`✅ MinIO bucket '${config.minio.bucketName}' already exists`);
    }

    // Set bucket policy to allow public read access for downloaded files
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${config.minio.bucketName}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(config.minio.bucketName, JSON.stringify(policy));
    console.log('✅ MinIO bucket policy set successfully');

  } catch (error) {
    console.error('❌ MinIO initialization failed:', error);
    throw error;
  }
};

export { minioClient, initializeMinio };
