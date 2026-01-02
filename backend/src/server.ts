import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import detectionRoutes from './routes/detection.routes.js';
import healthRoutes from './routes/health.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Deepfake Detection Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      detect_image: 'POST /api/detect/image',
      detect_audio: 'POST /api/detect/audio',
      detect_both: 'POST /api/detect/both',
    },
    services: {
      image_service: process.env.IMAGE_SERVICE_URL,
      audio_service: process.env.AUDIO_SERVICE_URL,
    },
  });
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/detect', detectionRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📸 Image service: ${process.env.IMAGE_SERVICE_URL}`);
  console.log(`🔊 Audio service: ${process.env.AUDIO_SERVICE_URL}`);
});
