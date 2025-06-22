import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from '../config/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express Base Project API',
      version: '1.0.0',
      description: 'A complete Node.js/Express base project template with PostgreSQL, Redis, MinIO, and modern development tools',
      contact: {
        name: 'API Development Team',
        email: 'dev@yourcompany.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.yourcompany.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ExampleItem: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Name of the item',
              example: 'Example Item',
            },
            description: {
              type: 'string',
              description: 'Description of the item',
              example: 'This is an example item',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
              description: 'Status of the item',
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            messageCode: {
              type: 'string',
              example: 'error.code',
            },
            error: {
              type: 'object',
              description: 'Error details',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success message',
            },
            messageCode: {
              type: 'string',
              example: 'success.code',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check and API information',
      },
      {
        name: 'Examples',
        description: 'Example CRUD operations template',
      },
      {
        name: 'Users',
        description: 'User management (template)',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
  ],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
