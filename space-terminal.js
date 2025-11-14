const { exec } = require('child_process');

class EternalTerminal {
    constructor() {
        this.cycle = 0;
        this.startTime = new Date();
        console.log('🚀 SPACE TERMINAL STARTED');
        console.log('⏰ Startup Time:', this.startTime.toLocaleString());
    }
    
    startEternalLoop() {
        console.log('🔁 Starting eternal loop...');
        
        setInterval(() => {
            this.cycle++;
            this.executeCycle();
        }, 60000); // Setiap 1 menit
    }
    
    executeCycle() {
        console.log(`\n🎯 CYCLE ${this.cycle} - ${new Date().toLocaleString()}`);
        
        const tasks = [
            'echo "🐳 Checking Docker..." && docker --version',
            'echo "💾 Memory:" && free -h | head -2',
            'echo "💽 Disk:" && df -h | head -5',
            'echo "🌐 IP:" && curl -s ifconfig.me',
            'echo "📦 Processes:" && ps aux | grep -v grep | grep -c "node"'
        ];
        
        tasks.forEach((task, index) => {
            setTimeout(() => {
                console.log(`🔧 Task ${index + 1}/${tasks.length}`);
                exec(task, (error, stdout, stderr) => {
                    if (stdout) console.log(stdout.trim());
                    if (stderr) console.log('⚠️', stderr.trim());
                });
            }, index * 5000);
        });
        
        // Uptime report
        const uptime = Math.floor((new Date() - this.startTime) / 1000 / 60);
        console.log(`⏱️ UPTIME: ${uptime} minutes`);
        console.log(`🔄 TOTAL CYCLES: ${this.cycle}`);
    }
}

// Start terminal
const terminal = new EternalTerminal();
terminal.startEternalLoop();

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    console.log('💥 ERROR (but continuing):', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('🚫 UNHANDLED REJECTION at:', promise);
});
