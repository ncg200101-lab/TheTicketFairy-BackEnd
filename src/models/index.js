import { sequelize } from '../config/database.js';
import ExampleModel from './ExampleModel.js';

// Import your models here
// import UserModel from './UserModel.js';
// import ProductModel from './ProductModel.js';

// Define associations
// Example:
// UserModel.hasMany(ProductModel, { foreignKey: 'userId', as: 'products' });
// ProductModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

// Function to sync all models
export const syncModels = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ All models synchronized successfully');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
    throw error;
  }
};

// Export models and sequelize
export {
  sequelize,
  ExampleModel,
  // Add your models here:
  // UserModel,
  // ProductModel,
};
