var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const { exec } = require("child_process");

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(
    express.static('public')
); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/

app.get('/', function (req, res) {
    res.sendFile('controller.html');
});

app.get('/controller', function (req, res) {
    res.sendFile('public/controller.html', { root: __dirname });
});

app.listen(3000, function () { 
    console.log('Listening on port 3000!');

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
});

process.on('uncaughtException', UncaughtExceptionHandler);

function UncaughtExceptionHandler(err)
{
    console.log("Uncaught Exception Encountered!!");
    console.log("err: ", err);
    console.log("Stack trace: ", err.stack);
    setInterval(function(){}, 1000);
}


