#!/bin/bash

# MedToXAi Production Build Script
echo "🚀 Building MedToXAi for Production..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [ ! -f "render.yaml" ]; then
    echo -e "${RED}Error: render.yaml not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing Backend Dependencies${NC}"
cd backend || exit
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
cd ..

echo -e "${YELLOW}Step 2: Installing Frontend Dependencies${NC}"
cd frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo -e "${YELLOW}Step 3: Building Frontend for Production${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend built successfully${NC}"
cd ..

echo -e "${GREEN}✅ Production build complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy on Render using the Blueprint (render.yaml)"
echo "3. Set environment variables in Render dashboard"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
