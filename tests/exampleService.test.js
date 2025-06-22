import { jest, describe, it, expect, afterEach } from '@jest/globals';
import { ExampleModel } from '../src/models/index.js';
import exampleService from '../src/services/exampleService.js';

// Mock the database and logger
jest.mock('../src/models/index.js');
jest.mock('../src/services/loggerService.js', () => ({
  default: {
    logSystem: jest.fn(),
    logError: jest.fn(),
    logRequest: jest.fn()
  }
}));

describe('ExampleService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return paginated examples successfully', async () => {
      const result = await exampleService.getAll({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('page', 1);
      expect(result.pagination).toHaveProperty('limit', 10);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should filter examples by search term', async () => {
      const result = await exampleService.getAll({ search: 'Example Item 1' });

      expect(result).toHaveProperty('data');
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should return example by ID successfully', async () => {
      const result = await exampleService.getById(1);

      expect(result).toBeTruthy();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name');
    });

    it('should return null for non-existent ID', async () => {
      const result = await exampleService.getById(999);

      expect(result).toBeNull();
    });

    it('should throw error for missing ID', async () => {
      await expect(exampleService.getById()).rejects.toThrow('ID is required');
    });
  });

  describe('create', () => {
    it('should create a new example successfully', async () => {
      const exampleData = {
        name: 'Test Example',
        description: 'Test description'
      };

      const result = await exampleService.create(exampleData);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'Test Example');
      expect(result).toHaveProperty('description', 'Test description');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw error for empty data', async () => {
      await expect(exampleService.create({})).rejects.toThrow('Data is required');
      await expect(exampleService.create(null)).rejects.toThrow('Data is required');
    });
  });

  describe('update', () => {
    it('should update example successfully', async () => {
      const updateData = {
        name: 'Updated Example',
        description: 'Updated description'
      };

      const result = await exampleService.update(1, updateData);

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'Updated Example');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should return null for non-existent ID', async () => {
      const result = await exampleService.update(999, { name: 'Test' });

      expect(result).toBeNull();
    });

    it('should throw error for missing parameters', async () => {
      await expect(exampleService.update()).rejects.toThrow('ID is required');
      await expect(exampleService.update(1, {})).rejects.toThrow('Data is required');
    });
  });

  describe('delete', () => {
    it('should delete example successfully', async () => {
      const result = await exampleService.delete(1);

      expect(result).toBe(true);
    });

    it('should return false for non-existent ID', async () => {
      const result = await exampleService.delete(999);

      expect(result).toBe(false);
    });

    it('should throw error for missing ID', async () => {
      await expect(exampleService.delete()).rejects.toThrow('ID is required');
    });
  });
});