# 🎬 Deepfake Detection System

A comprehensive system for detecting deepfakes in images and audio using machine learning. Built with React, Express.js, and FastAPI.

## 📋 Features

✅ **Image Deepfake Detection** - Detect manipulated images using ComVis model
✅ **Audio Deepfake Detection** - Identify synthetic audio using deep learning
✅ **Combined Detection** - Analyze both image and audio simultaneously
✅ **REST API** - Well-documented API endpoints
✅ **Real-time Processing** - Fast inference with confidence scores
✅ **Microservices Architecture** - Scalable and modular design

## 🏗️ Architecture

```
React Frontend
     ↓
Express.js Backend (Port 5000)
     ├→ FastAPI Image Service (Port 5001)
     │   └→ model_comvis.h5
     └→ FastAPI Audio Service (Port 5002)
         └→ deepfake_audio_model.h5
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (for backend)
- **Python** 3.8+ (for microservices)
- **npm** and **pip** package managers

### 1. Install Dependencies

**Option A: Using Windows batch script**
```bash
start-services.bat
# Select option 1
```

**Option B: Manual installation**

Backend:
```bash
cd backend
npm install
cd ..
```

Image Service:
```bash
cd microservices/image
pip install -r requirements.txt
cd ../..
```

Audio Service:
```bash
cd microservices/audio
pip install -r requirements.txt
cd ../..
```

### 2. Start Services

You'll need 3 terminal windows:

**Terminal 1 - Image Detection Service:**
```bash
cd microservices/image
python main.py
```

**Terminal 2 - Audio Detection Service:**
```bash
cd microservices/audio
python main.py
```

**Terminal 3 - Express Backend:**
```bash
cd backend
npm run dev
```

### 3. Verify Installation

```bash
curl http://localhost:5000/api/health
```

## 📚 Documentation

- **[Complete Setup Guide](SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Backend Documentation](backend/README.md)** - Express.js API documentation
- **[Image Service Documentation](microservices/image/README.md)** - Image detection details
- **[Audio Service Documentation](microservices/audio/README.md)** - Audio detection details

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Detect Image Deepfake
```http
POST /api/detect/image
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

### Detect Audio Deepfake
```http
POST /api/detect/audio
Content-Type: application/json

{
  "audio": "data:audio/wav;base64,..."
}
```

### Detect Both
```http
POST /api/detect/both
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "audio": "data:audio/wav;base64,..."
}
```

## 📁 Project Structure

```
deepfake-detection/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── AudioUpload.tsx
│       │   ├── ImageUpload.tsx
│       │   └── ResultCard.tsx
│       └── pages/
│           └── Detection.tsx
│
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── services/
│   │   │   └── detectionService.ts
│   │   └── routes/
│   │       ├── detection.routes.ts
│   │       └── health.routes.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── microservices/
│   ├── models/
│   │   ├── model_comvis.h5
│   │   └── deepfake_audio_model.h5
│   ├── image/
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── README.md
│   └── audio/
│       ├── main.py
│       ├── requirements.txt
│       └── README.md
│
├── SETUP_GUIDE.md
├── README.md (this file)
├── start-services.bat
├── start-services.sh
└── ...
```

## 🔧 Technologies

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui

### Backend
- Express.js
- TypeScript
- Axios (HTTP client)
- CORS middleware

### Microservices
- FastAPI (Python)
- TensorFlow/Keras
- Librosa (audio processing)
- Pillow (image processing)

## 📊 API Response Examples

### Successful Image Detection
```json
{
  "success": true,
  "type": "image",
  "data": {
    "success": true,
    "is_deepfake": false,
    "confidence": {
      "real": 0.9234,
      "fake": 0.0766
    },
    "prediction": "REAL",
    "threshold": 0.5
  }
}
```

### Successful Audio Detection
```json
{
  "success": true,
  "type": "audio",
  "data": {
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
}
```

## 🚀 Deployment

### Docker Compose (Recommended)

```bash
docker-compose up
```

### Individual Docker Containers

Image Service:
```bash
cd microservices/image
docker build -t deepfake-image .
docker run -p 5001:5001 deepfake-image
```

Audio Service:
```bash
cd microservices/audio
docker build -t deepfake-audio .
docker run -p 5002:5002 deepfake-audio
```

Backend:
```bash
cd backend
docker build -t deepfake-backend .
docker run -p 5000:5000 deepfake-backend
```

## 🔐 Security Considerations

1. **Input Validation** - Validates image and audio formats
2. **File Size Limits** - Default 50MB limit (configurable)
3. **CORS** - Configured for cross-origin requests
4. **Error Handling** - Safe error messages without exposing internals
5. **Model Security** - Keep model files secure in production

## 🐛 Troubleshooting

### Services Won't Start
1. Check port availability (`5000`, `5001`, `5002`)
2. Verify all dependencies are installed
3. Check Python/Node.js versions
4. Review service logs

### Model Not Found
Ensure these files exist:
- `microservices/models/model_comvis.h5`
- `microservices/models/deepfake_audio_model.h5`

### Connection Issues
1. Verify all services are running
2. Check URLs in `backend/.env`
3. Test with: `curl http://localhost:5000/api/health`

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed troubleshooting.

## 📈 Performance

- **Image Detection**: ~1-2 seconds per image
- **Audio Detection**: ~1-2 seconds per 5-second clip
- **Parallel Processing**: Handle both simultaneously
- **GPU Support**: Automatic TensorFlow GPU acceleration

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## ❓ FAQ

**Q: What formats are supported?**
A: Images (JPEG, PNG, BMP), Audio (WAV, MP3, OGG, FLAC)

**Q: How accurate are the models?**
A: Accuracy depends on model training. Test with your use case.

**Q: Can services run on different servers?**
A: Yes, update URLs in `backend/.env`

**Q: What's the maximum file size?**
A: Default 50MB, adjustable in server configuration

**Q: Can I replace the models?**
A: Yes, swap `.h5` files and update model loading code

## 📞 Support

For detailed help, check:
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions
2. [backend/README.md](backend/README.md) - Backend API details
3. [microservices/image/README.md](microservices/image/README.md) - Image service
4. [microservices/audio/README.md](microservices/audio/README.md) - Audio service

---

Made with ❤️ for deepfake detection
