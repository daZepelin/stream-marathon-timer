// STREAM ELEMENTS
const jwt = '';

// STREAMLABS
const socketToken = '';
var timeMultiplier = 1.0;
var countDownDate = new Date();
var paused = false;

$.get('http://localhost:3000/getCache', function (data) {
    var cache = JSON.parse(data);
    countDownDate = new Date(countDownDate.getTime() + parseInt(cache.time) * 1000);
    paused = cache.paused
    timeMultiplier =
        cache.timeMultiplier && !isNaN(parseInt(cache.timeMultiplier))
            ? parseInt(cache.timeMultiplier)
            : timeMultiplier;
    $('#auth-token-input-se').val(cache.authTokenSE);
    $('#auth-token-input-sl').val(cache.authTokenSL);
    $(`input[value="${cache.donatePlatform}"]`).prop('checked', true);
    $('#set-modifier-input').val(timeMultiplier)
    $('#text-style-css').val(cache.textStyle)
    $('#text-style-preview').attr('style', cache.textStyle)
    if (cache.donatePlatform == 'SE') {
        initElements(cache.authToken);
    } else if (cache.donatePlatform == 'SL') {
        initLabs(cache.authToken);
    } else if (cache.donatePlatform == 'BOTH') {
        initElements(cache.authToken);
        initLabs(cache.authToken);
    }
    $('#pause').text(paused ? 'Resume' : 'Pause');


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
    $.post('http://localhost:3000/setCache', { paused: paused });
    $.post('http://localhost:3000/setPaused', { paused: paused });
});

$('#set-timer-form').submit((e) => {
    e.preventDefault();
    var inputVal = parseInt($('#set-time-input').val());
    if (isNaN(inputVal)) return;
    countDownDate = new Date(new Date().getTime() + inputVal * 1000 * 60);
    $.post('http://localhost:3000/setTimer', { time: inputVal * 60 });
});

$('#text-style-form').submit((e) => {
    e.preventDefault();
    var textStyle = $('#text-style-css').val();
    $.post('http://localhost:3000/setStyle', { textStyle });
});

$('#text-style-css').on('input', (e) => {
    console.log('change', e.target.value)
    $('#text-style-preview').attr('style', e.target.value)
})

$('#add-timer-form').submit((e) => {
    e.preventDefault();
    var inputVal = parseFloat($('#add-time-input').val());
    var now = new Date().getTime();
    if (isNaN(inputVal)) return;
    countDownDate = new Date(countDownDate.getTime() + inputVal * 60000);
    var distance = countDownDate.getTime() - now;
    $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
});

$('#authentification-form').submit((e) => {
    e.preventDefault();
    var donatePlatform = $('input[name="donate-platform"]:checked').val();
    const authTokenSE = $('#auth-token-input-se').val();
    const authTokenSL = $('#auth-token-input-sl').val();
    $.post('http://localhost:3000/setCache', { authTokenSE, authTokenSL, donatePlatform: donatePlatform });

    closeElements();
    closeLabs();

    if (donatePlatform == 'SE') {
        initElements(authTokenSE);
    } else if (donatePlatform == 'SL') {
        initLabs(authTokenSL);
    } else if (donatePlatform == 'BOTH') {
        initElements(authTokenSE);
        initLabs(authTokenSL);
    }
});

$('input[name="time-multiplier"').change(e => {
    $('#set-modifier-input').val($(e.target).val())
})

$('#set-modifier-input').change((e) => {
    var multiplier = parseFloat($('#set-modifier-input').val());
    if (multiplier && !isNaN(multiplier)) {
        timeMultiplier = multiplier;
        $(`input[name="time-multiplier"][value="${timeMultiplier}"]`).attr('checked', 'checked');
    }
});

$('#set-modifier-form').submit((e) => {
    e.preventDefault();
    var multiplier = parseFloat($('#set-modifier-input').val());
    if (multiplier && !isNaN(multiplier)) {
        timeMultiplier = multiplier;
        $("input[name=time-multiplier][value=" + timeMultiplier + "]").attr('checked', 'checked');
        $.post('http://localhost:3000/setCache', { timeMultiplier: timeMultiplier });
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

