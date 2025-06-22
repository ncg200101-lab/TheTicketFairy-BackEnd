import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

/**
 * Example Model - Template for other models
 * Copy this file and modify for your specific use case
 */
const ExampleModel = sequelize.define('ExampleModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Primary key',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty',
      },
      len: {
        args: [2, 255],
        msg: 'Name must be between 2 and 255 characters',
      },
    },
    comment: 'Name of the item',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of the item',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Status of the item',
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Additional metadata in JSON format',
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'User ID who created this record',
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'User ID who last updated this record',
  },
}, {
  tableName: 'example_items',
  timestamps: true, // createdAt, updatedAt
  paranoid: true,   // deletedAt (soft delete)
  underscored: true, // snake_case column names
  indexes: [
    {
      fields: ['name'],
      name: 'idx_example_name',
    },
    {
      fields: ['status'],
      name: 'idx_example_status',
    },
    {
      fields: ['created_at'],
      name: 'idx_example_created_at',
    },
  ],
  comment: 'Example model table - template for other models',
});

// Instance methods
ExampleModel.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Hide sensitive fields if needed
  // delete values.password;
  
  return values;
};

// Class methods
ExampleModel.findActive = function(options = {}) {
  return this.findAll({
    where: {
      status: 'active',
      ...options.where,
    },
    ...options,
  });
};

ExampleModel.findByName = function(name, options = {}) {
  return this.findOne({
    where: {
      name,
      ...options.where,
    },
    ...options,
  });
};

// Hooks (lifecycle events)
ExampleModel.beforeCreate((item, options) => {
  // Add logic before creating
  if (options.userId) {
    item.createdBy = options.userId;
  }
});

ExampleModel.beforeUpdate((item, options) => {
  // Add logic before updating
  if (options.userId) {
    item.updatedBy = options.userId;
  }
});

export default ExampleModel;
