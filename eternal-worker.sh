#!/bin/bash

echo "=========================================="
echo "🌌 ETERNAL WORKER ACTIVATED"
echo "🎵 HIP HOP GO TO SPACE - NEVER STOP!"
echo "=========================================="

# Setup environment
export CODESPACE_NAME="eternal-$(hostname)"
export START_TIME=$(date +%s)

# Function to show status
show_status() {
    local current_time=$(date +%s)
    local uptime=$((current_time - START_TIME))
    echo "📊 STATUS: Cycle $1 | Uptime: ${uptime}s | $(date)"
}

# Function eternal worker
eternal_worker() {
    COUNTER=0
    while true; do
        ((COUNTER++))
        echo "------------------------------------------"
        show_status $COUNTER
        
        # System info
        echo "💻 System Resources:"
        echo "🖥️  CPU: $(nproc) cores"
        echo "💾 Memory: $(free -h | grep Mem | awk '{print $3\" of \"$2}')"
        echo "💽 Disk: $(df -h / | grep -v Filesystem | awk '{print $4\" free\"}')"
        
        # Docker operations
        echo "🐳 Docker Status:"
        if command -v docker &> /dev/null; then
            docker --version
            echo "📦 Containers: $(docker ps -a | wc -l) total"
        else
            echo "📥 Installing Docker..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
        fi
        
        # Network check
        echo "🌐 Network:"
        curl -s --connect-timeout 5 http://httpbin.org/ip > /dev/null && echo "✅ ONLINE" || echo "❌ OFFLINE"
        
        # Run Node.js worker jika ada
        if [ -f "/workspaces/eternal-codespace/space-terminal.js" ]; then
            echo "🚀 Starting Node.js worker..."
            node /workspaces/eternal-codespace/space-terminal.js &
        fi
        
        echo "💤 Sleeping 30 seconds..."
        echo "------------------------------------------"
        sleep 30
        
        # Cleanup background processes
        pkill -f "space-terminal.js" 2>/dev/null || true
    done
}

# Start the eternal worker
echo "🎯 INITIALIZING ETERNAL WORKER..."
eternal_worker
