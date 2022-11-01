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

app.get('/getCache', (req, res) => {
    fs.readFile(`${__dirname}/cache.json`, (err, data) => {
        if (err) throw err;
        let cache = JSON.parse(data);
        res.end(JSON.stringify(cache));
    });
});

app.post('/setCache', (req, res) => {
    fs.readFile(`${__dirname}/cache.json`, (err, data) => {
        if (err) throw err;
        var cache = JSON.parse(data);
        cache = {...cache, ...req.body}
        fs.writeFile(`${__dirname}/cache.json`, JSON.stringify(cache), (err) => {
            if (err) {
                console.log(err)
            }
            res.sendStatus(200);
        })
    });
})

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
        socket.emit('setStyle', cache.textStyle)
    })
})

app.post('/setStyle', (req, res) => {
    var textStyle = req.body.textStyle;
    fs.readFile(`${__dirname}/cache.json`, 'utf8', (err, data) => {
        if (err) throw err;
        let cache = JSON.parse(data);
        cache.textStyle = textStyle ?? cache.textStyle;
        fs.writeFile(`${__dirname}/cache.json`, JSON.stringify(cache), (err) => {
            if (err) {
                console.log(err);
            }
            res.sendStatus(200);
        });
        io.emit('setStyle', textStyle);
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
