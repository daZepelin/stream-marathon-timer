// Set the date we're counting down to
var countDownDate = new Date();
var paused = false;
var timeAddedTimeout = null;

const timerSocket = io();

$.get('http://localhost:3000/getTimer', function (data) {
    countDownDate = new Date(countDownDate.getTime() + parseInt(data) * 1000);
});

// Update the count down every 1 second
var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    if (paused && paused == 'true') {
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
    $('#demo').text((days > 0 ? days + 'd ' : '') + hours + 'h ' + minutes + 'm ' + seconds + 's ');

    // If the count down is over, write some text
    if (distance < 0) {
        $('#demo').text('PABAIGA');
    }
}, 1000);

timerSocket.on('refreshTimer', (e) => {
    var now = new Date().getTime();
    var distance = countDownDate.getTime() - now - 500;
    var timeAdded = parseInt(e.time) * 1000 - distance;

    var days = Math.floor(timeAdded / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeAdded % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeAdded % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeAdded % (1000 * 60)) / 1000);

    if (timeAdded > 30000) {
        var formattedTimeAdded = '+ ' +
        (days > 0 ? days + 'd ' : '') +
        (hours ? hours + 'h ' : '') +
        (minutes ? minutes + 'm ' : '') +
            (seconds > 10 ? seconds + 's ' : '');
            
        console.log(formattedTimeAdded);
        $('#time-added-container').text(formattedTimeAdded);
        $('#time-added-container').css({left: $('#demo').outerWidth() + 50});
        $('#time-added-container').removeClass('time-added-bounce');
        $('#demo').removeClass('time-added-zoom')
        setTimeout(() => {
            
            $('#time-added-container').addClass('time-added-bounce');
            $('#demo').addClass('time-added-zoom')
        }, 100);
        if (timeAddedTimeout) {
            clearTimeout(timeAddedTimeout)
        }
        timeAddedTimeout = setTimeout(() => {
            // $('#time-added-container')
            $('#time-added-container').removeClass('time-added-bounce');
            $('#demo').removeClass('time-added-zoom')
        }, 1750);
    }
    countDownDate = new Date(now + parseInt(e.time) * 1000);
});

timerSocket.on('setPaused', (e) => {
    paused = e;
});

timerSocket.on('setColors', (e) => {
    console.log(e);
    $('#demo').css({
        background: `-webkit-linear-gradient(${e[0]}, ${e[1]})`,
        ['background-clip']: 'text',
        ['-webkit-background-clip']: 'text',
        ['-webkit-text-fill-color']: 'transparent',
    });
});
