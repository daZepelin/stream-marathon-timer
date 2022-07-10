// Set the date we're counting down to
var countDownDate = new Date();
var paused = false

const timerSocket = io();

$.get('http://localhost:3000/getTimer', function (data) {
    countDownDate = new Date(countDownDate.getTime() + parseInt(data) * 1000);
});

// Update the count down every 1 second
var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    console.log('paused', paused)
    if (paused && paused == 'true') {
        countDownDate = new Date(countDownDate.getTime() + 1000)
    }
    // Find the distance between now and the count down date
    var distance = countDownDate.getTime() - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById('demo').innerHTML = (days > 0 ? days + 'd ' : '') + hours + 'h ' + minutes + 'm ' + seconds + 's ';

    // If the count down is over, write some text
    if (distance < 0) {
        // clearInterval(x);
        document.getElementById('demo').innerHTML = 'PABAIGA';
    }

}, 1000);

timerSocket.on('refreshTimer', (e) => {
    var now = new Date().getTime();
    countDownDate = new Date(now + parseInt(e.time) * 1000);
})

timerSocket.on('setPaused', (e) => {
    paused = e
})
