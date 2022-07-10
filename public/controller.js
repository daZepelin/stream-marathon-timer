// STREAM ELEMENTS
const jwt = '';

// STREAMLABS
const socketToken = '';
const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'] });
const TIME_MULTIPLIER = 2.0;
var countDownDate = new Date();
var paused = false;

$.get('http://localhost:3000/getTimer', function (data) {
    console.log(data);
    countDownDate = new Date(countDownDate.getTime() + parseInt(data) * 1000);
});

//Perform Action on event
streamlabs.on('event', (eventData) => {
    if (eventData.type === 'donation') {
        console.log(eventData.message[0].amount);
        countDownDate = new Date(countDownDate.getTime() + eventData.message[0].amount * TIME_MULTIPLIER * 60000);

        var now = new Date().getTime();

        var distance = countDownDate.getTime() - now;
        $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
    }
});

document.getElementById('add-min').addEventListener('click', () => {
    // Get today's date and time
    var now = new Date().getTime();

    countDownDate = new Date(countDownDate.getTime() + 1 * 60000);
    // Find the distance between now and the count down date
    var distance = countDownDate.getTime() - now;
    $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
});

document.getElementById('pause').addEventListener('click', () => {
    paused = !paused;
    $('#pause').text(paused ? 'Resume' : 'Pause');
    $.post('http://localhost:3000/setPaused', { paused: paused });
});

$('#set-timer-form').submit((e) => {
    e.preventDefault();
    var inputVal = parseInt($('#set-time-input').val());
    if (isNaN(inputVal)) return;
    countDownDate = new Date(new Date().getTime() + inputVal * 1000 * 60);
    $.post('http://localhost:3000/setTimer', { time: inputVal * 60 });
    console.log(inputVal);
});

$('#text-color-form').submit((e) => {
    e.preventDefault();
    var color1 = $('#color-1-input').val();
    var color2 = $('#color-2-input').val();
    $.post('http://localhost:3000/setColors', { colors: [color1, color2] });
});

$('#add-timer-form').submit((e) => {
    e.preventDefault();
    var inputVal = parseFloat($('#add-time-input').val());
    var now = new Date().getTime();
    if (isNaN(inputVal)) return;
    countDownDate = new Date(countDownDate.getTime() + inputVal * 60000);
    var distance = countDownDate.getTime() - now;
    $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
    console.log(inputVal);
});

// Update the count down every 1 second
var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    if (paused) {
        countDownDate = new Date(countDownDate.getTime() + 1000);
    }
    // Find the distance between now and the count down date
    var distance = countDownDate.getTime() - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById('demo').innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

    // If the count down is over, write some text
    if (distance < 0) {
        // clearInterval(x);
        document.getElementById('demo').innerHTML = 'PABAIGA';
    }
}, 1000);

setInterval(() => {
    var now = new Date().getTime();
    var distance = countDownDate.getTime() - now;
    $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
}, 10000);

// timerSocket.on('setPaused', (e) => {
//     console.log(e)
//     paused = e

// })

// AccessToken is grabbed from OAuth2 authentication of the account.
// const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjJjOWM4OGFlOGNkNWUyYWZmNDgwZGE4Iiwicm9sZSI6Im93bmVyIiwiY2hhbm5lbCI6IjYyYzljODhhZThjZDVlMzVjZTQ4MGRhOSIsInByb3ZpZGVyIjoieW91dHViZSIsImF1dGhUb2tlbiI6IlhWdldld0J4Q0xBX0Q3bzVNUXVVLTFNMk9UaFRZelMwLS1ubzRmWlF4UHNtYmF6USIsImlhdCI6MTY1NzM5MTI0MiwiaXNzIjoiU3RyZWFtRWxlbWVudHMifQ.WU7wzvvXogdSFuWdDoLk_P8O3wU4vftwq3hmfIpBSHg";
// JWT is available here: https://streamelements.com/dashboard/account/channels

const socket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
});
// Socket connected
socket.on('connect', onConnect);
// Socket got disconnected
socket.on('disconnect', onDisconnect);
// Socket is authenticated
socket.on('authenticated', onAuthenticated);
socket.on('unauthorized', console.error);
socket.on('event:test', (data) => {
    console.log(data);
    if (data.listener == 'tip-latest' || data.listener == 'superchat-latest') handleStreamElementsTip(data.event);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
});
socket.on('event', (data) => {
    console.log('event', data);
    if (data.type == 'tip' || data.type == 'superchat') handleStreamElementsTip(data.data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-event
});

const handleStreamElementsTip = (event) => {
    console.log('handleStreamElementsTip', event);
    console.log(event.currency, 69);
    if (event.currency == 'USD' || event.currency == 'EUR' || event.currency == 'GBP') {
        countDownDate = new Date(countDownDate.getTime() + event.amount * TIME_MULTIPLIER * 60000);

        var now = new Date().getTime();

        var distance = countDownDate.getTime() - now;
        $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
    }
};

function onConnect() {
    console.log('Successfully connected to the websocket');
    // socket.emit('authenticate', {method: 'oauth2', token: accessToken});
    socket.emit('authenticate', { method: 'jwt', token: jwt });
}

function onDisconnect() {
    console.log('Disconnected from websocket');
    // Reconnect
}

function onAuthenticated(data) {
    const { channelId } = data;
    console.log(`Successfully connected to channel ${channelId}`);
}
