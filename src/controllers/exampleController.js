import exampleService from '../services/exampleService.js';
import loggerService from '../services/loggerService.js';

/**
 * Example Controller - Template for other controllers
 * Copy this file and modify for your specific use case
 */
class ExampleController {
  /**
   * Get all items with pagination
   */
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      loggerService.logRequest(req, 'example.get_all.attempt');
      
      const result = await exampleService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
      });

      loggerService.logRequest(req, 'example.get_all.success', { count: result.data.length });

      return res.success({
        messageCode: 'example.get_all.success',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      loggerService.logError(req, 'example.get_all.error', error);
      return next(error);
    }
  };

  /**
   * Get item by ID
   */
  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      loggerService.logRequest(req, 'example.get_by_id.attempt', { id });
      
      const item = await exampleService.getById(id);

      if (!item) {
        return res.error({
          status: 404,
          messageCode: 'example.not_found',
        });
      }

      loggerService.logRequest(req, 'example.get_by_id.success', { id });

      return res.success({
        messageCode: 'example.get_by_id.success',
        data: item,
      });
    } catch (error) {
      loggerService.logError(req, 'example.get_by_id.error', error);
      return next(error);
    }
  };

  /**
   * Create new item
   */
  create = async (req, res, next) => {
    try {
      const data = req.body;
      
      loggerService.logRequest(req, 'example.create.attempt', { data });
      
      const newItem = await exampleService.create(data);

      loggerService.logRequest(req, 'example.create.success', { id: newItem.id });

      return res.success({
        messageCode: 'example.create.success',
        data: newItem,
        status: 201,
      });
    } catch (error) {
      loggerService.logError(req, 'example.create.error', error);
      return next(error);
    }
  };

  /**
   * Update item by ID
   */
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      
      loggerService.logRequest(req, 'example.update.attempt', { id, data });
      
      const updatedItem = await exampleService.update(id, data);

      if (!updatedItem) {
        return res.error({
          status: 404,
          messageCode: 'example.not_found',
        });
      }

      loggerService.logRequest(req, 'example.update.success', { id });

      return res.success({
        messageCode: 'example.update.success',
        data: updatedItem,
      });
    } catch (error) {
      loggerService.logError(req, 'example.update.error', error);
      return next(error);
    }
  };

  /**
   * Delete item by ID
   */
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      loggerService.logRequest(req, 'example.delete.attempt', { id });
      
      const deleted = await exampleService.delete(id);

      if (!deleted) {
        return res.error({
          status: 404,
          messageCode: 'example.not_found',
        });
      }

      loggerService.logRequest(req, 'example.delete.success', { id });

      return res.success({
        messageCode: 'example.delete.success',
      });
    } catch (error) {
      loggerService.logError(req, 'example.delete.error', error);
      return next(error);
    }
  };
}

export default new ExampleController();
