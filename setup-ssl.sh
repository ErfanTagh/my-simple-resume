#!/bin/bash

# SSL Setup Script using Let's Encrypt
# Run this AFTER your domain is pointing to your server

set -e

echo "🔒 SSL Certificate Setup with Let's Encrypt"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    exit 1
fi

# Load environment variables
source .env

if [ "$DOMAIN" == "yourdomain.com" ]; then
    echo -e "${RED}❌ Error: Please set your DOMAIN in .env file${NC}"
    exit 1
fi

echo "Domain: $DOMAIN"
echo ""

# Check if domain resolves to this server
echo "🔍 Checking if $DOMAIN points to this server..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo -e "${YELLOW}⚠️  Warning: Domain may not be pointing to this server${NC}"
    echo "   Server IP: $SERVER_IP"
    echo "   Domain IP: $DOMAIN_IP"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Create directories
echo "📁 Creating certificate directories..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Get certificate
echo ""
echo "📜 Requesting SSL certificate..."
echo "This may take a few minutes..."
echo ""

docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ SSL certificate obtained successfully!${NC}"
    echo ""
    echo "🔄 Reloading Nginx..."
    docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
    
    echo ""
    echo -e "${GREEN}✅ SSL setup complete!${NC}"
    echo ""
    echo "🌐 Your site is now available at:"
    echo "   https://$DOMAIN"
    echo ""
    echo "📝 Certificate will auto-renew via certbot container"
else
    echo ""
    echo -e "${RED}❌ Failed to obtain SSL certificate${NC}"
    echo ""
    echo "Common issues:"
    echo "  1. Domain not pointing to this server"
    echo "  2. Port 80 not accessible"
    echo "  3. Firewall blocking connections"
    echo ""
    exit 1
fi

