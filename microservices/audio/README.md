# Audio Deepfake Detection Microservice

FastAPI microservice for detecting deepfakes in audio using deep learning models.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

```bash
cd microservices/audio
pip install -r requirements.txt
```

### Running the Service

```bash
python main.py
```

The service will start on `http://localhost:5002`

### Alternative: Using Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 5002 --reload
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
  "service": "Audio Deepfake Detection"
}
```

---

### Detect Audio (Base64)
```http
POST /detect
Content-Type: application/json

{
  "audio": "data:audio/wav;base64,UklGRi4..."
}
```

Send audio as base64 encoded string for detection. Supports WAV, MP3, and other common formats.

**Response:**
```json
{
  "success": true,
  "is_deepfake": false,
  "confidence": {
    "real": 0.8756,
    "fake": 0.1244
  },
  "prediction": "REAL",
  "threshold": 0.5,
  "sample_rate": 16000
}
```

---

### Detect Audio (File Upload)
```http
POST /detect-file
Content-Type: multipart/form-data

[binary audio file]
```

Upload an audio file directly for detection.

**Response:**
```json
{
  "success": true,
  "is_deepfake": false,
  "confidence": {
    "real": 0.8756,
    "fake": 0.1244
  },
  "prediction": "REAL",
  "threshold": 0.5,
  "filename": "test.wav",
  "sample_rate": 16000
}
```

---

## 📁 Project Structure

```
microservices/audio/
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🔧 Technologies

- **FastAPI** - Modern web framework
- **TensorFlow/Keras** - Deep learning framework
- **Librosa** - Audio analysis library
- **SoundFile** - Audio file I/O
- **NumPy** - Numerical computing
- **SciPy** - Scientific computing

## 🎯 Model Details

- **Model Name**: deepfake_audio_model.h5
- **Input**: Audio signal
- **Sample Rate**: 16000 Hz (16 kHz)
- **Feature Extraction**: MFCC (Mel-Frequency Cepstral Coefficients)
- **Output**: Binary classification (Real vs Deepfake)
- **Threshold**: 0.5

### Audio Processing Pipeline

1. **Decoding**: Converts base64 or reads file
2. **Resampling**: Normalizes sample rate to 16kHz
3. **Feature Extraction**: 
   - Computes 13 MFCC coefficients
   - Calculates mean and standard deviation
   - Creates feature vector of 26 dimensions
4. **Normalization**: Prepares for model inference
5. **Inference**: Outputs confidence scores

## 🚀 Running with Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
COPY ../models/deepfake_audio_model.h5 ../models/

EXPOSE 5002

CMD ["python", "main.py"]
```

Build and run:

```bash
docker build -t deepfake-audio-service .
docker run -p 5002:5002 deepfake-audio-service
```

## 🔗 Integration

Used by the Express.js backend at:
```
POST http://localhost:5002/detect
```

## ⚙️ Configuration

Modify in `main.py`:
- **Model Path**: Update path in `load_model()` function
- **Sample Rate**: Change `sr=16000` in feature extraction
- **MFCC Coefficients**: Modify `n_mfcc=13` parameter
- **Threshold**: Change `fake_prob > 0.5` threshold
- **Port**: Change `port=5002` in main execution

## 🎵 Supported Audio Formats

- WAV (.wav)
- MP3 (.mp3)
- OGG (.ogg)
- FLAC (.flac)
- And other formats supported by librosa

## 📊 Performance Tips

1. **Audio Duration**: Optimal results with 5-10 second clips
2. **Audio Quality**: Higher quality audio (44.1kHz+) preferred
3. **Noise Reduction**: Clean audio produces better results
4. **Batch Processing**: Consider batching requests
5. **GPU Support**: TensorFlow will use GPU if available

## 🐛 Troubleshooting

### Model not found error
Ensure `deepfake_audio_model.h5` exists in `microservices/models/` directory

### Librosa issues with audio format
Try installing additional codecs:
```bash
pip install audioread
```

### Import errors
Update all dependencies:
```bash
pip install -r requirements.txt --upgrade
```

### Port already in use
Change the port:
```bash
uvicorn main:app --port 5010
```

### Memory issues with large files
Audio is automatically limited by librosa's buffer size. For larger files, consider:
- Breaking audio into chunks
- Using audio file directly instead of base64
- Increasing available memory

## 📝 Error Responses

| Status | Message | Solution |
|--------|---------|----------|
| 400 | Failed to decode audio | Ensure base64 is valid |
| 503 | Model not loaded | Check model file path |
| 500 | Detection failed | Check server logs |

## 📄 License

MIT
