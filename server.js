var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get('/getTimer', (req, res) => {
    fs.readFile(`${__dirname}/cache.json`, (err, data) => {
        if (err) throw err;
        let cache = JSON.parse(data);
        res.end(cache.time.toString());
    });
});

app.post('/setTimer', (req, res) => {
    var time = parseInt(req.body.time);
    fs.readFile(`${__dirname}/cache.json`, 'utf8', (err, data) => {
        if (err) throw err;
        let cache = JSON.parse(data);
        cache.time = time;
        fs.writeFile(`${__dirname}/cache.json`, JSON.stringify(cache), (err) => {
            if (err) {
                console.log(err);
            }
            res.sendStatus(200);
            io.emit('refreshTimer', { time: time });
        });
    });
});

app.post('/setPaused', (req, res) => {
    io.emit('setPaused', req.body.paused);
});

io.on('connection', (socket) => {
    fs.readFile(`${__dirname}/cache.json`, 'utf8', (err, data) => {
        if (err) throw err;
        let cache = JSON.parse(data);
        socket.emit('setColors', [cache.color1, cache.color2])
    })
})

app.post('/setColors', (req, res) => {
    var colors = req.body.colors;
    fs.readFile(`${__dirname}/cache.json`, 'utf8', (err, data) => {
        if (err) throw err;
        let cache = JSON.parse(data);
        cache.color1 = colors[0] ?? cache.color1;
        cache.color2 = colors[1] ?? cache.color2;
        console.log(cache)
        fs.writeFile(`${__dirname}/cache.json`, JSON.stringify(cache), (err) => {
            if (err) {
                console.log(err);
            }
            res.sendStatus(200);
        });
        io.emit('setColors', [cache.color1, cache.color2]);
    });
});

app.use(
    express.static('public')
); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/

app.get('/', function (req, res) {
    res.sendFile('controller.html');
});

app.get('/controller', function (req, res) {
    res.sendFile('public/controller.html', { root: __dirname });
});

// io.listen(3001)
http.listen(3000, () => {
    console.log(`Socket.IO server running at http://localhost:${3000}/`);
});
