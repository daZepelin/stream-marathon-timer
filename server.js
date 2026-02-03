import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { initDatabase } from './server/db/database.js';
import adminAuth from './server/middleware/adminAuth.js';
import adminRoutes from './server/routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// Initialize database
initDatabase();

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.sendFile('controller.html', { root: __dirname });
});

app.get('/controller', function (req, res) {
    res.sendFile('public/controller.html', { root: __dirname });
});

// Admin routes with authentication
app.use('/admin', adminAuth, adminRoutes);

app.listen(3000, function () {
    console.log('Listening on port 3000!', process.env.NODE_ENV);

    if (process.env.NODE_ENV !== 'development') {
        exec('start "" http://localhost:3000/controller', (error, stdout, stderr) => {
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


