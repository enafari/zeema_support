#!/bin/bash

echo "🚀 Starting Zeema Chatbot Demo Server..."
echo "📍 Server will be available at: http://localhost:8000"
echo "🌐 Open your browser and navigate to the URL above"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Check if python3 is available
if command -v python3 &> /dev/null; then
    python3 server.py
else
    echo "❌ Python3 not found. Please install Python3 first."
    exit 1
fi 