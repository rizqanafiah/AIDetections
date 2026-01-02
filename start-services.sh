#!/bin/bash

# Deepfake Detection System - Quick Start Script
# This script helps start all services

echo ""
echo "====================================="
echo "Deepfake Detection System - Quick Start"
echo "====================================="
echo ""

read -p "Choose an option: (1) Install Dependencies, (2) Start All Services, (3) Check Services: " choice

case $choice in
    1)
        echo ""
        echo "Installing Backend Dependencies..."
        cd backend
        npm install
        cd ..
        
        echo ""
        echo "Installing Image Service Dependencies..."
        cd microservices/image
        pip install -r requirements.txt
        cd ../..
        
        echo ""
        echo "Installing Audio Service Dependencies..."
        cd microservices/audio
        pip install -r requirements.txt
        cd ../..
        
        echo ""
        echo "✓ All dependencies installed!"
        echo "Run './start-services.sh 2' to start services"
        ;;
    
    2)
        echo ""
        echo "Starting all services..."
        echo ""
        
        if [ ! -f "backend/.env" ]; then
            echo "Creating backend .env file..."
            cp backend/.env.example backend/.env
        fi
        
        echo ""
        echo "Please run these commands in separate terminals:"
        echo ""
        echo "Terminal 1 - Image Service:"
        echo "  cd microservices/image"
        echo "  python main.py"
        echo ""
        echo "Terminal 2 - Audio Service:"
        echo "  cd microservices/audio"
        echo "  python main.py"
        echo ""
        echo "Terminal 3 - Backend:"
        echo "  cd backend"
        echo "  npm run dev"
        echo ""
        
        # Optional: Try to open terminals if on macOS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            read -p "Open terminals automatically? (y/n): " open_terminals
            if [ "$open_terminals" = "y" ]; then
                osascript -e "tell app \"Terminal\" to do script \"cd '$(pwd)/microservices/image' && python main.py\""
                osascript -e "tell app \"Terminal\" to do script \"cd '$(pwd)/microservices/audio' && python main.py\""
                osascript -e "tell app \"Terminal\" to do script \"cd '$(pwd)/backend' && npm run dev\""
                echo "✓ Terminals opened. Services are starting..."
            fi
        fi
        ;;
    
    3)
        echo ""
        echo "Checking services..."
        echo ""
        
        echo "Checking Backend (http://localhost:5000/api/health)..."
        if curl -s http://localhost:5000/api/health > /dev/null; then
            echo "✓ Backend is running"
            curl -s http://localhost:5000/api/health | python -m json.tool
        else
            echo "✗ Backend is not running"
        fi
        
        echo ""
        echo "Checking Image Service (http://localhost:5001/health)..."
        if curl -s http://localhost:5001/health > /dev/null; then
            echo "✓ Image Service is running"
            curl -s http://localhost:5001/health | python -m json.tool
        else
            echo "✗ Image Service is not running"
        fi
        
        echo ""
        echo "Checking Audio Service (http://localhost:5002/health)..."
        if curl -s http://localhost:5002/health > /dev/null; then
            echo "✓ Audio Service is running"
            curl -s http://localhost:5002/health | python -m json.tool
        else
            echo "✗ Audio Service is not running"
        fi
        
        echo ""
        ;;
    
    *)
        echo "Invalid choice. Please run again and select 1, 2, or 3."
        ;;
esac

echo ""
