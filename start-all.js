const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

const SERVICES = [
  { name: 'User Service', dir: 'services/user-service', command: 'node', args: ['src/index.js'], color: '\x1b[36m' }, // Cyan
  { name: 'Menu Service', dir: 'services/menu-service', command: 'node', args: ['src/index.js'], color: '\x1b[32m' }, // Green
  { name: 'Wallet Service', dir: 'services/wallet-service', command: 'node', args: ['src/index.js'], color: '\x1b[35m' }, // Magenta
  { name: 'Order Service', dir: 'services/order-service', command: 'node', args: ['src/index.js'], color: '\x1b[33m' }, // Yellow
  { name: 'Notification Service', dir: 'services/notification-service', command: 'node', args: ['src/index.js'], color: '\x1b[34m' }, // Blue
  { name: 'Admin Service', dir: 'services/admin-service', command: 'node', args: ['src/index.js'], color: '\x1b[31m' }, // Red
  { name: 'API Gateway', dir: 'services/api-gateway', command: 'node', args: ['src/index.js'], color: '\x1b[37;1m' }, // White Bold
  { name: 'Frontend', dir: 'frontend', command: 'npm', args: ['run', 'dev'], color: '\x1b[36;1m' } // Cyan Bold
];

const RESET_COLOR = '\x1b[0m';
const children = [];

// Helper to copy file if not exists
function ensureEnvFile(dir) {
  const envPath = path.join(__dirname, dir, '.env');
  const examplePath = path.join(__dirname, dir, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(examplePath)) {
      console.log(`Creating .env for ${dir}...`);
      fs.copyFileSync(examplePath, envPath);
    } else {
      console.warn(`Warning: No .env or .env.example found in ${dir}`);
    }
  }
}

// Helper to run npm install if node_modules doesn't exist
function ensureNodeModules(dir) {
  const nodeModulesPath = path.join(__dirname, dir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`Installing dependencies in ${dir} (this may take a moment)...`);
    try {
      execSync('npm install --no-audit --no-fund', { cwd: path.join(__dirname, dir), stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to install dependencies in ${dir}:`, err);
    }
  }
}

// Helper to test if a TCP port is open
function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

// Wait for a port to open with a retry interval
async function waitForPort(port, name, timeoutMs = 30000, intervalMs = 1500) {
  const start = Date.now();
  console.log(`Checking health of ${name} on port ${port}...`);
  
  while (Date.now() - start < timeoutMs) {
    const isOpen = await checkPort(port);
    if (isOpen) {
      console.log(`\x1b[32m[OK]\x1b[0m ${name} is healthy and accepting connections on port ${port}.`);
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  console.error(`\x1b[31m[ERROR]\x1b[0m Timeout waiting for ${name} on port ${port}.`);
  return false;
}

async function main() {
  console.log('--- Preparing Smart Canteen Management System ---');

  // Check root env
  ensureEnvFile('.');

  // Ensure dependencies and env files exist
  SERVICES.forEach(service => {
    ensureEnvFile(service.dir);
    ensureNodeModules(service.dir);
  });

  // Ensure databases are started via Docker Compose
  console.log('\n--- Ensuring Database Services are Running ---');
  try {
    console.log('Running docker compose up -d...');
    execSync('docker compose up -d', { stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to start docker containers. Make sure Docker Desktop is open and running.', err);
    process.exit(1);
  }

  // Wait for databases to be healthy
  console.log('\n--- Verifying Container Health ---');
  const dbs = [
    { port: 27017, name: 'MongoDB' },
    { port: 6379, name: 'Redis' },
    { port: 5672, name: 'RabbitMQ' }
  ];
  
  for (const db of dbs) {
    const success = await waitForPort(db.port, db.name);
    if (!success) {
      console.error(`\x1b[31mHealth checks failed. Please verify Docker Desktop is fully operational and try again.\x1b[0m`);
      process.exit(1);
    }
  }

  console.log('\n\x1b[32;1mAll databases are healthy and operational!\x1b[0m');
  console.log('--- Starting All Application Services ---\n');

  // Start each service
  SERVICES.forEach(service => {
    const cwd = path.join(__dirname, service.dir);
    const shell = service.command === 'npm' && process.platform === 'win32'; // Only use shell wrapper on Windows for npm
    
    const prefix = `${service.color}[${service.name}]${RESET_COLOR} `;
    
    try {
      const child = spawn(service.command, service.args, {
        cwd,
        shell,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      children.push({ proc: child, name: service.name });
      
      child.stdout.on('data', data => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            console.log(`${prefix}${line.trim()}`);
          }
        });
      });
      
      child.stderr.on('data', data => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed) {
            if (trimmed.includes('DeprecationWarning') || trimmed.includes('Warning:') || trimmed.includes('(node:')) {
              console.warn(`${prefix}\x1b[33m[WARN]\x1b[0m ${trimmed}`);
            } else {
              console.error(`${prefix}\x1b[31m[ERROR]\x1b[0m ${trimmed}`);
            }
          }
        });
      });
      
      child.on('error', err => {
        console.error(`${prefix}\x1b[31m[SPAWN ERROR]\x1b[0m Failed to start process:`, err);
      });
      
      child.on('close', code => {
        console.log(`${prefix}exited with code ${code}`);
      });
    } catch (err) {
      console.error(`${prefix}\x1b[31m[SPAWN FATAL]\x1b[0m Failed to spawn:`, err);
    }
  });
}

// Handle termination gracefully
function cleanup() {
  console.log('\nStopping all services...');
  children.forEach(({ proc, name }) => {
    if (proc && !proc.killed) {
      console.log(`Stopping ${name}...`);
      if (process.platform === 'win32') {
        // Windows process tree kill
        spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
      } else {
        proc.kill('SIGINT');
      }
    }
  });
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

main().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
