import os
import base64
from io import BytesIO
from typing import Optional
import numpy as np
import tensorflow as tf
import librosa
import soundfile as sf
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Audio Deepfake Detection Service", version="1.0.0")

# Global model
model = None

class AudioDetectionRequest(BaseModel):
    audio: str  # base64 encoded audio

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    service: str

def load_model():
    """Load the deepfake audio detection model"""
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'deepfake_audio_model.h5')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        
        model = tf.keras.models.load_model(model_path)
        print(f"✓ Audio detection model loaded from {model_path}")
    except Exception as e:
        print(f"✗ Failed to load model: {e}")
        model = None

def extract_audio_features(audio_data: np.ndarray, sr: int = 16000) -> np.ndarray:
    """Extract MFCC features from audio"""
    try:
        # Extract MFCC features (13 coefficients is standard, but adjust as needed)
        mfcc = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=13)
        
        # Calculate statistics
        mfcc_mean = np.mean(mfcc, axis=1)
        mfcc_std = np.std(mfcc, axis=1)
        
        # Combine features
        features = np.concatenate([mfcc_mean, mfcc_std])
        
        # Add batch dimension
        features = np.expand_dims(features, axis=0)
        
        return features
    except Exception as e:
        raise ValueError(f"Feature extraction failed: {e}")

def decode_base64_audio(base64_str: str) -> tuple[np.ndarray, int]:
    """Decode base64 string to audio array"""
    try:
        # Remove data URI prefix if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        
        audio_data = base64.b64decode(base64_str)
        audio_io = BytesIO(audio_data)
        
        # Load audio with librosa
        y, sr = librosa.load(audio_io, sr=16000)
        
        return y, sr
    except Exception as e:
        raise ValueError(f"Failed to decode audio: {e}")

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if model is not None else "unhealthy",
        model_loaded=model is not None,
        service="Audio Deepfake Detection"
    )

@app.post("/detect")
async def detect_deepfake(request: AudioDetectionRequest):
    """
    Detect deepfake in audio
    
    Args:
        request: AudioDetectionRequest with base64 encoded audio
    
    Returns:
        Detection result with confidence scores
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Decode audio
        audio_data, sr = decode_base64_audio(request.audio)
        
        # Extract features
        features = extract_audio_features(audio_data, sr)
        
        # Inference
        prediction = model.predict(features, verbose=0)
        
        # Assuming binary classification [real_prob, fake_prob]
        if len(prediction[0]) == 2:
            real_prob = float(prediction[0][0])
            fake_prob = float(prediction[0][1])
        else:
            # Single output, assume it's fake probability
            fake_prob = float(prediction[0][0])
            real_prob = 1.0 - fake_prob
        
        is_deepfake = fake_prob > 0.5
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "is_deepfake": is_deepfake,
                "confidence": {
                    "real": round(real_prob, 4),
                    "fake": round(fake_prob, 4)
                },
                "prediction": "DEEPFAKE" if is_deepfake else "REAL",
                "threshold": 0.5,
                "sample_rate": sr
            }
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.post("/detect-file")
async def detect_deepfake_file(file: UploadFile = File(...)):
    """
    Detect deepfake in audio file
    
    Args:
        file: Audio file upload (WAV, MP3, etc.)
    
    Returns:
        Detection result with confidence scores
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read file
        contents = await file.read()
        audio_io = BytesIO(contents)
        
        # Load audio with librosa
        audio_data, sr = librosa.load(audio_io, sr=16000)
        
        # Extract features
        features = extract_audio_features(audio_data, sr)
        
        # Inference
        prediction = model.predict(features, verbose=0)
        
        # Assuming binary classification [real_prob, fake_prob]
        if len(prediction[0]) == 2:
            real_prob = float(prediction[0][0])
            fake_prob = float(prediction[0][1])
        else:
            # Single output, assume it's fake probability
            fake_prob = float(prediction[0][0])
            real_prob = 1.0 - fake_prob
        
        is_deepfake = fake_prob > 0.5
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "is_deepfake": is_deepfake,
                "confidence": {
                    "real": round(real_prob, 4),
                    "fake": round(fake_prob, 4)
                },
                "prediction": "DEEPFAKE" if is_deepfake else "REAL",
                "threshold": 0.5,
                "filename": file.filename,
                "sample_rate": sr
            }
        )
    
    except Exception as e:
        print(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Audio Deepfake Detection Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "detect": "/detect (POST)",
            "detect_file": "/detect-file (POST)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)
