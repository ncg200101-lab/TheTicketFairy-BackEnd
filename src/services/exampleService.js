import loggerService from './loggerService.js';
import cacheService from './cacheService.js';
// import { ExampleModel } from '../models/index.js'; // Uncomment when you have models

/**
 * Example Service - Template for other services
 * Copy this file and modify for your specific use case
 */
class ExampleService {
  constructor() {
    this.cachePrefix = 'example';
    this.cacheTTL = 3600; // 1 hour
  }

  /**
   * Get all items with pagination and search
   */
  getAll = async (options = {}) => {
    try {
      const { page = 1, limit = 10, search } = options;
      const offset = (page - 1) * limit;
      
      // Create cache key
      const cacheKey = `${this.cachePrefix}:all:${page}:${limit}:${search || 'all'}`;
      
      // Try to get from cache first
      let result = await cacheService.get(cacheKey);
      if (result) {
        loggerService.logSystem('example.cache.hit', `Cache hit for key: ${cacheKey}`);
        return result;
      }

      // TODO: Replace with actual database query
      // const { rows: data, count: total } = await ExampleModel.findAndCountAll({
      //   where: search ? {
      //     name: { [Op.iLike]: `%${search}%` }
      //   } : {},
      //   limit,
      //   offset,
      //   order: [['createdAt', 'DESC']]
      // });

      // Mock data for template
      const mockData = [
        { id: 1, name: 'Example Item 1', createdAt: new Date() },
        { id: 2, name: 'Example Item 2', createdAt: new Date() },
      ];
      const total = search ? mockData.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      ).length : mockData.length;

      result = {
        data: search ? mockData.filter(item => 
          item.name.toLowerCase().includes(search.toLowerCase())
        ).slice(offset, offset + limit) : mockData.slice(offset, offset + limit),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };

      // Cache the result
      await cacheService.set(cacheKey, result, this.cacheTTL);
      
      loggerService.logSystem('example.get_all.success', `Retrieved ${result.data.length} items`);
      
      return result;
    } catch (error) {
      loggerService.logError(null, 'example.get_all.error', error);
      throw error;
    }
  };

  /**
   * Get item by ID
   */
  getById = async (id) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      // Try cache first
      const cacheKey = `${this.cachePrefix}:${id}`;
      let item = await cacheService.get(cacheKey);
      
      if (item) {
        loggerService.logSystem('example.cache.hit', `Cache hit for item ${id}`);
        return item;
      }

      // TODO: Replace with actual database query
      // item = await ExampleModel.findByPk(id);

      // Mock data for template
      item = id == 1 ? { id: 1, name: 'Example Item 1', createdAt: new Date() } : null;

      if (item) {
        // Cache the result
        await cacheService.set(cacheKey, item, this.cacheTTL);
        loggerService.logSystem('example.get_by_id.success', `Found item ${id}`);
      }

      return item;
    } catch (error) {
      loggerService.logError(null, 'example.get_by_id.error', error);
      throw error;
    }
  };

  /**
   * Create new item
   */
  create = async (data) => {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Data is required');
      }

      // TODO: Replace with actual database query
      // const newItem = await ExampleModel.create(data);

      // Mock data for template
      const newItem = {
        id: Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Invalidate related cache
      await this.invalidateCache();
      
      loggerService.logSystem('example.create.success', `Created item ${newItem.id}`);
      
      return newItem;
    } catch (error) {
      loggerService.logError(null, 'example.create.error', error);
      throw error;
    }
  };

  /**
   * Update item by ID
   */
  update = async (id, data) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Data is required');
      }

      // TODO: Replace with actual database query
      // const [affectedRows] = await ExampleModel.update(data, {
      //   where: { id }
      // });
      // if (affectedRows === 0) return null;
      // const updatedItem = await ExampleModel.findByPk(id);

      // Mock data for template
      const updatedItem = id == 1 ? {
        id: parseInt(id),
        ...data,
        updatedAt: new Date(),
      } : null;

      if (updatedItem) {
        // Invalidate cache
        await this.invalidateCache(id);
        loggerService.logSystem('example.update.success', `Updated item ${id}`);
      }

      return updatedItem;
    } catch (error) {
      loggerService.logError(null, 'example.update.error', error);
      throw error;
    }
  };

  /**
   * Delete item by ID
   */
  delete = async (id) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      // TODO: Replace with actual database query
      // const deletedRows = await ExampleModel.destroy({
      //   where: { id }
      // });

      // Mock data for template
      const deletedRows = id == 1 ? 1 : 0;

      if (deletedRows > 0) {
        // Invalidate cache
        await this.invalidateCache(id);
        loggerService.logSystem('example.delete.success', `Deleted item ${id}`);
        return true;
      }

      return false;
    } catch (error) {
      loggerService.logError(null, 'example.delete.error', error);
      throw error;
    }
  };

  /**
   * Invalidate cache for this service
   */
  invalidateCache = async (id = null) => {
    try {
      if (id) {
        // Invalidate specific item cache
        await cacheService.delete(`${this.cachePrefix}:${id}`);
      }
      
      // Invalidate list cache (all pages)
      const pattern = `${this.cachePrefix}:all:*`;
      await cacheService.deletePattern(pattern);
      
      loggerService.logSystem('example.cache.invalidated', `Invalidated cache ${id ? `for item ${id}` : 'for all items'}`);
    } catch (error) {
      loggerService.logError(null, 'example.cache.invalidate.error', error);
    }
  };
}

export default new ExampleService();
