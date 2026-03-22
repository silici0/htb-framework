#!/bin/bash

# HTB Framework - Startup Script
# This script starts the framework with Docker Compose

echo "🚀 Starting HTB Framework..."
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "🔗 https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "🔗 https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if necessary files exist
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml file not found!"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile not found!"
    exit 1
fi

echo "✅ Initial checks completed"

# Build and start containers
echo "🔨 Building containers..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✅ Containers built successfully"
else
    echo "❌ Error building containers"
    exit 1
fi

echo "🚀 Starting containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ Containers started successfully"
else
    echo "❌ Error starting containers"
    exit 1
fi

# Check if containers are running
echo "🔍 Checking container status..."
sleep 3

if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers are running"
    echo ""
    echo "🎉 HTB Framework is ready!"
    echo "🌐 Access: http://localhost:3000"
    echo ""
    echo "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop: docker-compose down"
    echo "  Restart: docker-compose restart"
    echo ""
else
    echo "❌ Containers are not running correctly"
    docker-compose logs
    exit 1
fi