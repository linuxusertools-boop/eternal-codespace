const express = require('express');
const app = express();

app.use(express.json());

// Store active codespaces
const activeCodespaces = new Map();

class CodespaceMonitor {
    constructor() {
        console.log('🎯 RENDER MONITOR STARTED');
    }
    
    // Receive heartbeat from codespaces
    receiveHeartbeat(data) {
        const { codespace, timestamp, cycle } = data;
        
        activeCodespaces.set(codespace, {
            lastSeen: Date.now(),
            startTime: activeCodespaces.get(codespace)?.startTime || Date.now(),
            cycle: cycle,
            status: 'active'
        });
        
        console.log(`💓 Heartbeat from ${codespace} - Cycle: ${cycle}`);
    }
    
    // Get all active codespaces
    getStatus() {
        const active = Array.from(activeCodespaces.entries()).map(([name, data]) => ({
            name,
            uptime: Math.floor((Date.now() - data.startTime) / 1000) + ' seconds',
            cycle: data.cycle,
            lastSeen: Math.floor((Date.now() - data.lastSeen) / 1000) + ' seconds ago',
            status: data.status
        }));
        
        return {
            activeCount: active.length,
            totalUptime: process.uptime().toFixed(2) + ' seconds',
            codespaces: active,
            timestamp: new Date().toLocaleString()
        };
    }
}

const monitor = new CodespaceMonitor();

// Routes
app.post('/heartbeat', (req, res) => {
    monitor.receiveHeartbeat(req.body);
    res.json({ 
        status: 'acknowledged',
        message: 'Heartbeat received',
        timestamp: new Date().toLocaleString()
    });
});

app.get('/status', (req, res) => {
    res.json(monitor.getStatus());
});

app.get('/ping', (req, res) => {
    res.json({ 
        message: 'Render Monitor is ALIVE!',
        service: 'Eternal Codespace Monitor',
        timestamp: new Date().toLocaleString(),
        uptime: process.uptime().toFixed(2) + ' seconds'
    });
});

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🚀 Eternal Codespace Monitor</title>
        <style>
            body { 
                background: #0f0f0f; 
                color: #00ff00; 
                font-family: 'Courier New', monospace;
                margin: 0;
                padding: 20px;
            }
            .container { max-width: 800px; margin: 0 auto; }
            .status { background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 10px 0; }
            .heart { color: #ff0066; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Eternal Codespace Monitor</h1>
            <div class="status">
                <p>🌐 Service: <span id="serviceStatus">RUNNING</span></p>
                <p>⏰ Uptime: <span id="uptime">Loading...</span></p>
                <p class="heart">💖 Active Codespaces: <span id="activeCount">0</span></p>
            </div>
            <div id="codespacesList"></div>
        </div>
        
        <script>
            async function updateStatus() {
                try {
                    const response = await fetch('/status');
                    const data = await response.json();
                    
                    document.getElementById('uptime').textContent = data.totalUptime;
                    document.getElementById('activeCount').textContent = data.activeCount;
                    
                    // Update codespaces list
                    const list = document.getElementById('codespacesList');
                    list.innerHTML = '<h3>Active Codespaces:</h3>';
                    
                    if (data.codespaces.length === 0) {
                        list.innerHTML += '<p>No active codespaces</p>';
                    } else {
                        data.codespaces.forEach(cs => {
                            list.innerHTML += \`
                                <div class="status">
                                    <p><strong>🔧 \${cs.name}</strong></p>
                                    <p>⏱️ Uptime: \${cs.uptime}</p>
                                    <p>🔄 Cycles: \${cs.cycle}</p>
                                    <p>👀 Last Seen: \${cs.lastSeen}</p>
                                </div>
                            \`;
                        });
                    }
                } catch (error) {
                    console.log('Error fetching status:', error);
                }
            }
            
            // Update every 10 seconds
            setInterval(updateStatus, 10000);
            updateStatus();
        </script>
    </body>
    </html>
    `);
});

// Auto-ping untuk keep alive
setInterval(() => {
    console.log('🔄 Render Auto-Ping - Keeping service alive - ' + new Date().toLocaleString());
}, 30000); // Ping setiap 30 detik

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🎯 Render Monitor running on port', PORT);
    console.log('🌐 Open:', `http://localhost:${PORT}`);
});
