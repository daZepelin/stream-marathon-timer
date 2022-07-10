// STREAM ELEMENTS
const jwt = '';

// STREAMLABS
const socketToken = '';
var timeMultiplier = 2.0;
var countDownDate = new Date();
var paused = false;

$.get('http://localhost:3000/getCache', function (data) {
    var cache = JSON.parse(data);
    countDownDate = new Date(countDownDate.getTime() + parseInt(cache.time) * 1000);
    $('#auth-token-input').val(cache.authToken)
    $(`input[value="${cache.donatePlatform}"]`).prop('checked', true)
    if (cache.donatePlatform == 'SE') {
        initElements(cache.authToken)
    } else if (cache.donatePlatform == 'SL') {
        initLabs(cache.authToken)
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

$('#authentification-form').submit((e) => {
    e.preventDefault();
    var donatePlatform = $('input[name="donate-platform"]:checked').val();
    const authToken = $('#auth-token-input').val();
    $.post('http://localhost:3000/setCache', { authToken: authToken, donatePlatform: donatePlatform });

    closeElements();
    closeLabs();

    if (donatePlatform == 'SE') {
        initElements(authToken);
    } else if (donatePlatform == 'SL') {
        initLabs(authToken);
    }
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

console.log('elements', elements);
