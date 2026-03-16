#!/usr/bin/env bash
# exit on error
set -e

# 1. Build Frontend
echo "Building Frontend..."
cd frontend
npm install
./node_modules/.bin/vite build
cd ..

# 2. Prepare Backend Static Folder
echo "Syncing frontend build to backend..."
# Ensure the backend/dist folder exists
mkdir -p backend/dist
# Clear old files and copy new ones from Vite's output
rm -rf backend/dist/*
cp -r frontend/dist/* backend/dist/

# 3. Install Backend Dependencies
echo "Installing Backend dependencies..."
cd backend
npm install
cd ..

echo "Build Process Complete!"
