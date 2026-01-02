import axios from 'axios';

const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL || 'http://localhost:5001';
const AUDIO_SERVICE_URL = process.env.AUDIO_SERVICE_URL || 'http://localhost:5002';

export async function detectImageDeepfake(imageBase64: string) {
  try {
    const response = await axios.post(
      `${IMAGE_SERVICE_URL}/detect`,
      { image: imageBase64 },
      { timeout: 30000 }
    );
    return response.data;
  } catch (error: any) {
    console.error('Image detection error:', error.message);
    throw new Error(`Image detection failed: ${error.message}`);
  }
}

export async function detectAudioDeepfake(audioBase64: string) {
  try {
    const response = await axios.post(
      `${AUDIO_SERVICE_URL}/detect`,
      { audio: audioBase64 },
      { timeout: 30000 }
    );
    return response.data;
  } catch (error: any) {
    console.error('Audio detection error:', error.message);
    throw new Error(`Audio detection failed: ${error.message}`);
  }
}

export async function healthCheckServices() {
  const results = {
    imageService: false,
    audioService: false,
  };

  try {
    await axios.get(`${IMAGE_SERVICE_URL}/health`, { timeout: 5000 });
    results.imageService = true;
  } catch (error) {
    console.warn('Image service unreachable');
  }

  try {
    await axios.get(`${AUDIO_SERVICE_URL}/health`, { timeout: 5000 });
    results.audioService = true;
  } catch (error) {
    console.warn('Audio service unreachable');
  }

  return results;
}
