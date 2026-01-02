# Deepfake Detection Backend

Express.js backend server for coordinating deepfake detection requests to FastAPI microservices.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for microservices)

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
NODE_ENV=development
IMAGE_SERVICE_URL=http://localhost:5001
AUDIO_SERVICE_URL=http://localhost:5002
```

### Running Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Building for Production

```bash
npm run build
npm start
```

## 📋 API Endpoints

### Health Check
```http
GET /api/health
```

Returns the health status of the backend and microservices.

**Response:**
```json
{
  "success": true,
  "backend": "ok",
  "services": {
    "imageService": true,
    "audioService": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Detect Image Deepfake
```http
POST /api/detect/image
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
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

---

### Detect Audio Deepfake
```http
POST /api/detect/audio
Content-Type: application/json

{
  "audio": "data:audio/wav;base64,..."
}
```

**Response:**
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

---

### Detect Both Image and Audio
```http
POST /api/detect/both
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "audio": "data:audio/wav;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "type": "both",
  "data": {
    "image": {
      "success": true,
      "is_deepfake": false,
      "confidence": {
        "real": 0.9234,
        "fake": 0.0766
      },
      "prediction": "REAL",
      "threshold": 0.5
    },
    "audio": {
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
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts                 # Main Express server
│   ├── services/
│   │   └── detectionService.ts   # Detection service logic
│   └── routes/
│       ├── detection.routes.ts   # Detection endpoints
│       └── health.routes.ts      # Health check endpoints
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔧 Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling (for future use)

## 🤝 Integration

The backend expects the following microservices to be running:

1. **Image Detection Service** (FastAPI)
   - URL: `http://localhost:5001`
   - Health: `GET /health`
   - Detect: `POST /detect`

2. **Audio Detection Service** (FastAPI)
   - URL: `http://localhost:5002`
   - Health: `GET /health`
   - Detect: `POST /detect`

## 📝 Error Handling

All errors are returned with appropriate HTTP status codes:

- `400` - Bad Request (missing or invalid data)
- `500` - Internal Server Error
- `503` - Service Unavailable (microservices offline)

Example error response:
```json
{
  "success": false,
  "message": "Image detection failed: Connection refused",
  "type": "image"
}
```

## 🚀 Deployment

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

Build and run:

```bash
docker build -t deepfake-backend .
docker run -p 5000:5000 -e IMAGE_SERVICE_URL=http://image-service:5001 deepfake-backend
```

## 🤖 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment mode |
| IMAGE_SERVICE_URL | http://localhost:5001 | Image service URL |
| AUDIO_SERVICE_URL | http://localhost:5002 | Audio service URL |

## 📄 License

MIT
