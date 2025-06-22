import { redisClient } from '../config/redis.js';
import loggerService from './loggerService.js';

class CacheService {
  get = async (key) => {
    try {
      const data = await redisClient.get(key);
      loggerService.logSystem('cache.get.success', `Cache retrieved for key: ${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      loggerService.logSystem('cache.get.failed', `Redis get error for key ${key}: ${error.message}`);
      return null;
    }
  };

  set = async (key, value, expirationInSeconds = 3600) => {
    try {
      await redisClient.setEx(key, expirationInSeconds, JSON.stringify(value));
      loggerService.logSystem('cache.set.success', `Cache set for key: ${key}, expires in: ${expirationInSeconds}s`);
      return true;
    } catch (error) {
      loggerService.logSystem('cache.set.failed', `Redis set error for key ${key}: ${error.message}`);
      return false;
    }
  };

  delete = async (key) => {
    try {
      await redisClient.del(key);
      loggerService.logSystem('cache.delete.success', `Cache deleted for key: ${key}`);
      return true;
    } catch (error) {
      loggerService.logSystem('cache.delete.failed', `Redis delete error for key ${key}: ${error.message}`);
      return false;
    }
  };

  deletePattern = async (pattern) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      loggerService.logSystem('cache.delete_pattern.success', `Cache pattern deleted: ${pattern}, count: ${keys.length}`);
      return true;
    } catch (error) {
      loggerService.logSystem('cache.delete_pattern.failed', `Redis delete pattern error for ${pattern}: ${error.message}`);
      return false;
    }
  };

  exists = async (key) => {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      loggerService.logSystem('cache.exists.failed', `Redis exists error for key ${key}: ${error.message}`);
      return false;
    }
  };

  expire = async (key, seconds) => {
    try {
      await redisClient.expire(key, seconds);
      loggerService.logSystem('cache.expire.success', `Cache expiration set for key: ${key}, seconds: ${seconds}`);
      return true;
    } catch (error) {
      loggerService.logSystem('cache.expire.failed', `Redis expire error for key ${key}: ${error.message}`);
      return false;
    }
  };

  flushAll = async () => {
    try {
      await redisClient.flushAll();
      loggerService.logSystem('cache.flush_all.success', 'All cache cleared');
      return true;
    } catch (error) {
      loggerService.logSystem('cache.flush_all.failed', `Redis flush all error: ${error.message}`);
      return false;
    }
  };

  // Helper methods for common cache patterns
  cacheUserSession = async (userId, sessionData, expirationInSeconds = 24 * 60 * 60) => {
    const key = `user_session:${userId}`;
    return await this.set(key, sessionData, expirationInSeconds);
  };

  getUserSession = async (userId) => {
    const key = `user_session:${userId}`;
    return await this.get(key);
  };

  deleteUserSession = async (userId) => {
    const key = `user_session:${userId}`;
    return await this.delete(key);
  };
}

export default new CacheService();
