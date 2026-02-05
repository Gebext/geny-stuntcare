#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting GENY-StuntCare Development Server${NC}\n"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Kill any existing node processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
pkill -f "next dev" || true
pkill -f "docusaurus start" || true
sleep 1

# Check if ports are available
check_port() {
    if lsof -i :$1 >/dev/null 2>&1; then
        echo -e "${RED}❌ Port $1 is already in use!${NC}"
        return 1
    fi
    return 0
}

# Start Frontend
echo -e "\n${YELLOW}Starting Frontend (Port 3000)...${NC}"
cd "$SCRIPT_DIR/frontend" || exit 1

if ! check_port 3000; then
    echo -e "${RED}Please free up port 3000 and try again${NC}"
    exit 1
fi

npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait a bit before starting docs
sleep 3

# Start Docusaurus
echo -e "\n${YELLOW}Starting Docusaurus (Port 3001)...${NC}"
cd "$SCRIPT_DIR/docs-site" || exit 1

if ! check_port 3001; then
    echo -e "${RED}Please free up port 3001 and try again${NC}"
    kill $FRONTEND_PID
    exit 1
fi

npm run start &
DOCS_PID=$!
echo -e "${GREEN}✓ Docusaurus started (PID: $DOCS_PID)${NC}"

echo -e "\n${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All services are running!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Frontend:       http://localhost:3000${NC}"
echo -e "${YELLOW}Documentation:  http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for all background processes
wait

