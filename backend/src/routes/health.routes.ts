import { Router, Request, Response } from 'express';
import { healthCheckServices } from '../services/detectionService.js';

const router = Router();

/**
 * GET /api/health
 * Check backend and microservices health status
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const servicesHealth = await healthCheckServices();

    res.json({
      success: true,
      backend: 'ok',
      services: servicesHealth,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error,
    });
  }
});

export default router;
