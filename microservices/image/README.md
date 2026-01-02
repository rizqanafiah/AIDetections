# Image Deepfake Detection Microservice

FastAPI microservice for detecting deepfakes in images using the ComVis model.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

```bash
cd microservices/image
pip install -r requirements.txt
```

### Running the Service

```bash
python main.py
```

The service will start on `http://localhost:5001`

### Alternative: Using Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 5001 --reload
```

## 📋 API Endpoints

### Health Check
```http
GET /health
```

Check if the model is loaded and service is healthy.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "Image Deepfake Detection"
}
```

---

### Detect Image (Base64)
```http
POST /detect
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

Send an image as base64 encoded string for detection.

**Response:**
```json
{
  "success": true,
  "is_deepfake": false,
  "confidence": {
    "real": 0.9234,
    "fake": 0.0766
  },
  "prediction": "REAL",
  "threshold": 0.5
}
```

---

### Detect Image (File Upload)
```http
POST /detect-file
Content-Type: multipart/form-data

[binary image file]
```

Upload an image file directly for detection.

**Response:**
```json
{
  "success": true,
  "is_deepfake": false,
  "confidence": {
    "real": 0.9234,
    "fake": 0.0766
  },
  "prediction": "REAL",
  "threshold": 0.5,
  "filename": "test.jpg"
}
```

---

## 📁 Project Structure

```
microservices/image/
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🔧 Technologies

- **FastAPI** - Modern web framework
- **TensorFlow/Keras** - Deep learning framework
- **Pillow** - Image processing
- **NumPy** - Numerical computing
- **OpenCV** - Computer vision library

## 🎯 Model Details

- **Model Name**: model_comvis.h5
- **Input Size**: 224x224 pixels
- **Output**: Binary classification (Real vs Deepfake)
- **Threshold**: 0.5

### Preprocessing

The service automatically:
1. Decodes base64 or reads file input
2. Resizes image to 224x224 pixels
3. Converts to RGB if needed
4. Normalizes pixel values (0-1 range)
5. Adds batch dimension for inference

## 🚀 Running with Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
COPY ../models/model_comvis.h5 ../models/

EXPOSE 5001

CMD ["python", "main.py"]
```

Build and run:

```bash
docker build -t deepfake-image-service .
docker run -p 5001:5001 deepfake-image-service
```

## 🔗 Integration

Used by the Express.js backend at:
```
POST http://localhost:5001/detect
```

## ⚙️ Configuration

Modify in `main.py`:
- **Model Path**: Update the path in `load_model()` function
- **Image Size**: Change `img_size` parameter in `preprocess_image()`
- **Threshold**: Modify `is_deepfake = fake_prob > 0.5` threshold
- **Port**: Change `port=5001` in main execution

## 📊 Performance Tips

1. **Batch Processing**: Send multiple images for better throughput
2. **Image Quality**: Better quality images lead to more accurate results
3. **Model Optimization**: Consider using TensorFlow Lite for faster inference
4. **GPU Support**: TensorFlow will automatically use GPU if available

## 🐛 Troubleshooting

### Model not found error
Ensure `model_comvis.h5` exists in `microservices/models/` directory

### Import errors
Make sure all dependencies are installed:
```bash
pip install -r requirements.txt --upgrade
```

### Port already in use
Change the port in the run command:
```bash
python main.py  # Will try different port
# or
uvicorn main:app --port 5010
```

## 📝 Error Responses

| Status | Message | Solution |
|--------|---------|----------|
| 400 | Failed to decode image | Ensure base64 is valid |
| 503 | Model not loaded | Check model file path |
| 500 | Detection failed | Check server logs |

## 📄 License

MIT
