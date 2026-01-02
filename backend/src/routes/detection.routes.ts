import { Router, Request, Response } from 'express';
import { detectImageDeepfake, detectAudioDeepfake } from '../services/detectionService.js';

const router = Router();

interface DetectionRequest extends Request {
  body: {
    image?: string;
    audio?: string;
  };
}

/**
 * POST /api/detect/image
 * Detect deepfake in image
 * Body: { image: base64_string }
 */
router.post('/image', async (req: DetectionRequest, res: Response) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required',
      });
    }

    console.log('Processing image detection...');
    const result = await detectImageDeepfake(image);

    res.json({
      success: true,
      data: result,
      type: 'image',
    });
  } catch (error: any) {
    console.error('Image detection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image detection failed',
      type: 'image',
    });
  }
});

/**
 * POST /api/detect/audio
 * Detect deepfake in audio
 * Body: { audio: base64_string }
 */
router.post('/audio', async (req: DetectionRequest, res: Response) => {
  try {
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({
        success: false,
        message: 'Audio data is required',
      });
    }

    console.log('Processing audio detection...');
    const result = await detectAudioDeepfake(audio);

    res.json({
      success: true,
      data: result,
      type: 'audio',
    });
  } catch (error: any) {
    console.error('Audio detection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Audio detection failed',
      type: 'audio',
    });
  }
});

/**
 * POST /api/detect/both
 * Detect deepfake in both image and audio
 * Body: { image: base64_string, audio: base64_string }
 */
router.post('/both', async (req: DetectionRequest, res: Response) => {
  try {
    const { image, audio } = req.body;

    if (!image || !audio) {
      return res.status(400).json({
        success: false,
        message: 'Both image and audio data are required',
      });
    }

    console.log('Processing both image and audio detection...');
    const [imageResult, audioResult] = await Promise.all([
      detectImageDeepfake(image),
      detectAudioDeepfake(audio),
    ]);

    res.json({
      success: true,
      data: {
        image: imageResult,
        audio: audioResult,
      },
      type: 'both',
    });
  } catch (error: any) {
    console.error('Detection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Detection failed',
      type: 'both',
    });
  }
});

export default router;
