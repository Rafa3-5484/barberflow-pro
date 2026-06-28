#!/bin/bash
set -e

echo "================================================"
echo "  ServiceFlow AI - Deploy Script"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check required tools
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed.${NC}"
        exit 1
    fi
}

check_command docker
check_command docker-compose

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Load env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}No .env file found. Copying from .env.production...${NC}"
    cp .env.production .env
    echo -e "${YELLOW}Please edit .env with your production values before running deploy.${NC}"
    echo -e "${YELLOW}Run: nano .env${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment file loaded${NC}"

# Create SSL directory if not exists
if [ ! -d ./ssl ]; then
    echo -e "${YELLOW}Creating self-signed SSL certificate for development...${NC}"
    mkdir -p ./ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./ssl/key.pem \
        -out ./ssl/cert.pem \
        -subj "/C=BR/ST=SP/L=SaoPaulo/O=ServiceFlow/CN=localhost"
    echo -e "${YELLOW}WARNING: Self-signed cert generated. Use Let's Encrypt in production.${NC}"
fi

echo -e "${GREEN}✓ SSL certificates ready${NC}"

# Pull latest images
echo ""
echo "================================================"
echo "  Building and pulling images..."
echo "================================================"
docker-compose -f docker-compose.prod.yml pull

# Build services
echo ""
echo "Building services..."
docker-compose -f docker-compose.prod.yml build

# Run database migrations
echo ""
echo "================================================"
echo "  Running database migrations..."
echo "================================================"
docker-compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy

# Start all services
echo ""
echo "================================================"
echo "  Starting services..."
echo "================================================"
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  ServiceFlow AI is now running!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "  Frontend: https://localhost"
echo "  API:      https://localhost/api/v1"
echo ""

# Show container status
echo "Container status:"
docker-compose -f docker-compose.prod.yml ps
