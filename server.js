import 'dotenv/config';
import path from 'path';
import { promises as fs } from 'fs';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Middleware
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// CORS configuration for admin dashboard
const corsOptions = {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use('/api/admin', cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')))

// Admin authentication middleware
function adminAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    const adminToken = process.env.ADMIN_TOKEN;
    
    if (!adminToken) {
        return res.status(500).json({ error: 'Admin token not configured on server' });
    }
    
    if (!token || token !== adminToken) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin token' });
    }
    
    next();
}

// Helper functions for file operations
async function readJsonFile(filePath, defaultValue = {}) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return defaultValue;
        }
        throw error;
    }
}

async function writeJsonFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Admin API endpoints
// GET /api/admin/accounts - List all accounts
app.get('/api/admin/accounts', adminAuthMiddleware, async (req, res) => {
    try {
        const accounts = await readJsonFile(ACCOUNTS_FILE, []);
        res.json(accounts);
    } catch (error) {
        console.error('Error reading accounts:', error);
        res.status(500).json({ error: 'Failed to read accounts' });
    }
});

// GET /api/admin/accounts/:id - Get single account
app.get('/api/admin/accounts/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const accounts = await readJsonFile(ACCOUNTS_FILE, []);
        const account = accounts.find(acc => acc.id === req.params.id);
        
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        res.json(account);
    } catch (error) {
        console.error('Error reading account:', error);
        res.status(500).json({ error: 'Failed to read account' });
    }
});

// PATCH /api/admin/accounts/:id/settings - Update account settings
app.patch('/api/admin/accounts/:id/settings', adminAuthMiddleware, async (req, res) => {
    try {
        const accounts = await readJsonFile(ACCOUNTS_FILE, []);
        const accountIndex = accounts.findIndex(acc => acc.id === req.params.id);
        
        if (accountIndex === -1) {
            return res.status(404).json({ error: 'Account not found' });
        }
        
        // Update account settings
        accounts[accountIndex].settings = {
            ...accounts[accountIndex].settings,
            ...req.body
        };
        
        await writeJsonFile(ACCOUNTS_FILE, accounts);
        res.json(accounts[accountIndex]);
    } catch (error) {
        console.error('Error updating account settings:', error);
        res.status(500).json({ error: 'Failed to update account settings' });
    }
});

// GET /api/admin/settings - Get global settings
app.get('/api/admin/settings', adminAuthMiddleware, async (req, res) => {
    try {
        const settings = await readJsonFile(SETTINGS_FILE, { maintenanceMode: false });
        res.json(settings);
    } catch (error) {
        console.error('Error reading settings:', error);
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

// PATCH /api/admin/settings - Update global settings
app.patch('/api/admin/settings', adminAuthMiddleware, async (req, res) => {
    try {
        const currentSettings = await readJsonFile(SETTINGS_FILE, { maintenanceMode: false });
        const updatedSettings = {
            ...currentSettings,
            ...req.body
        };
        
        await writeJsonFile(SETTINGS_FILE, updatedSettings);
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Original routes
app.get('/', function (req, res) {
    res.sendFile('controller.html', { root: __dirname });
});

app.get('/controller', function (req, res) {
    res.sendFile('public/controller.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}!`, process.env.NODE_ENV);
    console.log('Admin API endpoints available at /api/admin/*');

    if (process.env.NODE_ENV !== 'development') {
        exec(`start "" http://localhost:${PORT}/controller`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`Command executed to open controller ${stdout}`);
        });
    }
});

process.on('uncaughtException', UncaughtExceptionHandler);

function UncaughtExceptionHandler(err)
{
    console.log("Uncaught Exception Encountered!!");
    console.log("err: ", err);
    console.log("Stack trace: ", err.stack);
    setInterval(function(){}, 1000);
}


