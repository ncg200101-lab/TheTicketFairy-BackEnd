import { syncModels } from '../models/index.js';
import config from '../config/index.js';

const runMigrations = async () => {
  try {
    console.log('🚀 Running database migrations...');
    
    // Force sync in development (this will drop and recreate tables)
    const forceSync = process.env.NODE_ENV === 'development' && process.argv.includes('--force');
    
    await syncModels({ force: forceSync });
    
    console.log('✅ Database migrations completed successfully');
    
    if (config.server.nodeEnv === 'development') {
      console.log('💡 You can now seed the database with sample data');
    }

    // eslint-disable-next-line no-process-exit
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

runMigrations();
