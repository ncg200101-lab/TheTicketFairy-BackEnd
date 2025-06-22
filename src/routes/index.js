import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import pingRoutes from './ping.route.js';
import exampleRoutes from './exampleRoutes.js';
import config from '../config/index.js';

const router = Router();

// API version prefix
const apiPrefix = config.server.apiPrefix;
const apiVersion = config.server.apiVersion;

// Mount routes
router.use('/', healthRoutes);
router.use('/', pingRoutes);

// API routes with versioning
router.use(`${apiPrefix}/${apiVersion}/examples`, exampleRoutes);

// Add your API routes here:
// router.use(`${apiPrefix}/${apiVersion}/users`, userRoutes);
// router.use(`${apiPrefix}/${apiVersion}/products`, productRoutes);

export default router;
