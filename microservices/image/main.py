import os
import base64
from io import BytesIO
from typing import Optional
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Image Deepfake Detection Service", version="1.0.0")

# Global model
model = None

class ImageDetectionRequest(BaseModel):
    image: str  # base64 encoded image

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    service: str

def load_model():
    """Load the ComVis deepfake detection model"""
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'model_comvis.h5')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        
        model = tf.keras.models.load_model(model_path)
        print(f"✓ Image detection model loaded from {model_path}")
    except Exception as e:
        print(f"✗ Failed to load model: {e}")
        model = None

def preprocess_image(img: Image.Image, img_size: tuple = (224, 224)) -> np.ndarray:
    """Preprocess image for model inference"""
    # Resize image
    img = img.resize(img_size)
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Convert to array and normalize
    img_array = np.array(img, dtype=np.float32)
    img_array = img_array / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def decode_base64_image(base64_str: str) -> Image.Image:
    """Decode base64 string to PIL Image"""
    try:
        # Remove data URI prefix if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        
        img_data = base64.b64decode(base64_str)
        img = Image.open(BytesIO(img_data))
        return img
    except Exception as e:
        raise ValueError(f"Failed to decode image: {e}")

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
        service="Image Deepfake Detection"
    )

@app.post("/detect")
async def detect_deepfake(request: ImageDetectionRequest):
    """
    Detect deepfake in image
    
    Args:
        request: ImageDetectionRequest with base64 encoded image
    
    Returns:
        Detection result with confidence scores
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Decode image
        img = decode_base64_image(request.image)
        
        # Preprocess
        img_array = preprocess_image(img)
        
        # Inference
        prediction = model.predict(img_array, verbose=0)
        
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
                "threshold": 0.5
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
    Detect deepfake in image file
    
    Args:
        file: Image file upload
    
    Returns:
        Detection result with confidence scores
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read file
        contents = await file.read()
        img = Image.open(BytesIO(contents))
        
        # Preprocess
        img_array = preprocess_image(img)
        
        # Inference
        prediction = model.predict(img_array, verbose=0)
        
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
                "filename": file.filename
            }
        )
    
    except Exception as e:
        print(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Image Deepfake Detection Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "detect": "/detect (POST)",
            "detect_file": "/detect-file (POST)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
