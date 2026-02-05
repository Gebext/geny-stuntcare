#!/bin/bash

# Script untuk kill semua process dan restart clean

echo "🧹 Cleaning up all Node processes..."

# Kill all node processes
pkill -f "next dev" || true
pkill -f "docusaurus start" || true
pkill -f "nest start" || true
pkill node || true

sleep 2

echo "✅ All processes stopped"
echo ""
echo "Sekarang jalankan masing-masing di terminal yang berbeda:"
echo ""
echo "Terminal 1 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Terminal 2 - Dokumentasi:"
echo "  cd docs-site && npm run start"
echo ""
echo "Atau gunakan script start-dev.sh untuk menjalankan semua sekaligus:"
echo "  ./start-dev.sh"
