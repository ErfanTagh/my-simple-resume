#!/bin/bash

# Production Deployment Script for Hetzner Server
# This script helps you deploy the Resume Builder app

set -e  # Exit on error

echo "🚀 Resume Builder Production Deployment"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo ""
    echo "Please create .env file from .env.example:"
    echo "  1. cp .env.example .env"
    echo "  2. Edit .env and fill in your values"
    echo "  3. Run this script again"
    exit 1
fi

# Load environment variables
source .env

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo ""

# Check if domain is set
if [ "$DOMAIN" == "yourdomain.com" ]; then
    echo -e "${RED}❌ Error: Please set your DOMAIN in .env file${NC}"
    exit 1
fi

echo "📋 Deployment Steps:"
echo "  1. Pull latest code"
echo "  2. Build Docker images"
echo "  3. Run database migrations"
echo "  4. Start services"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Step 1: Pull latest code (if using git)
echo ""
echo "📥 Step 1: Checking for updates..."
if [ -d .git ]; then
    git pull
    echo -e "${GREEN}✅ Code updated${NC}"
else
    echo "ℹ️  Not a git repository, skipping..."
fi

# Step 2: Build Docker images
echo ""
echo "🔨 Step 2: Building Docker images..."
docker compose -f docker-compose.prod.yml build --no-cache

# Step 3: Stop existing containers
echo ""
echo "🛑 Step 3: Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Step 4: Start services
echo ""
echo "🚀 Step 4: Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Step 5: Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Step 6: Check status
echo ""
echo "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 Your app should be accessible at:"
echo "   https://$DOMAIN"
echo ""
echo "📝 Next steps:"
echo "  1. Set up SSL certificate (run ./setup-ssl.sh)"
echo "  2. Test the application"
echo "  3. Monitor logs: docker compose -f docker-compose.prod.yml logs -f"
echo ""

