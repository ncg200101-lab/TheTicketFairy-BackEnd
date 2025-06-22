import { Router } from 'express';
import healthController from '../controllers/healthController.js';

const router = Router();

// Health check routes
router.get('/health', healthController.getHealthStatus);
router.get('/info', healthController.getApiInfo);

export default router;
