#!/bin/bash

echo "=========================================="
echo "🚀 ETERNAL CODESPACE WORKER STARTING..."
echo "💖 WILL LIVE FOREVER!"
echo "=========================================="

# Update system
echo "📦 Updating system packages..."
apt-get update -y

# Install Node.js jika belum ada
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies
echo "📦 Installing project dependencies..."
cd /workspaces/eternal-codespace
npm install

# Make scripts executable
chmod +x eternal-worker.sh
chmod +x startup.sh

# Start eternal worker
echo "🎯 Starting eternal worker..."
./eternal-worker.sh
