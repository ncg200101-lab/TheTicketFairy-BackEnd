class HealthController {
  getHealthStatus = async (req, res) => {
    try {
      const healthStatus = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        },
        services: {
          database: 'Connected', // TODO: Add actual database health check
          redis: 'Connected',     // TODO: Add actual Redis health check
          minio: 'Connected',     // TODO: Add actual MinIO health check
        },
      };

      return res.success({
        messageCode: 'health.status.ok',
        data: healthStatus,
      });
    } catch (error) {
      return res.error({
        status: 500,
        messageCode: 'system.internal_error',
        error,
      });
    }
  };

  getApiInfo = async (req, res) => {
    try {
      const apiInfo = {
        name: 'KTX Backend API',
        version: process.env.npm_package_version || '1.0.0',
        description: 'Backend API for KTX management system',
        environment: process.env.NODE_ENV,
        documentation: '/api-docs',
      };

      return res.success({
        messageCode: 'health.info.success',
        data: apiInfo,
      });
    } catch (error) {
      return res.error({
        status: 500,
        messageCode: 'system.internal_error',
        error,
      });
    }
  };
}

export default new HealthController();
