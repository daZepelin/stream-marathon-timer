// STREAM ELEMENTS
const jwt = '';

// STREAMLABS
const socketToken = '';
var timeMultiplier = 1.0;
var countDownDate = new Date();
var paused = false;

$(() => {
    let cache = {
        time: localStorage.getItem('time'),
        authTokenSE: localStorage.getItem('authTokenSE'),
        authTokenSL: localStorage.getItem('authTokenSL'),
        donatePlatform: localStorage.getItem('donatePlatform'),
        paused: localStorage.getItem('paused'),
        timeMultiplier: localStorage.getItem('timeMultiplier'),
        textStyle: localStorage.getItem('textStyle'),
        history: JSON.parse(localStorage.getItem('history'))
    }

    countDownDate = new Date(countDownDate.getTime() + (!isNaN(parseInt(cache.time)) ? parseInt(cache.time) : 0) * 1000);
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
        initElements(cache.authTokenSE);
    } else if (cache.donatePlatform == 'SL') {
        initLabs(cache.authTokenSL);
    } else if (cache.donatePlatform == 'BOTH') {
        initElements(cache.authTokenSE);
        initLabs(cache.authTokenSL, true);
    }
    $('#pause').text(paused ? 'Resume' : 'Pause');

    setHistory({history: cache.history})
})

document.getElementById('add-min').addEventListener('click', () => {
    // Get today's date and time
    var now = new Date().getTime();

    countDownDate = new Date(countDownDate.getTime() + 1 * 60000);
    // Find the distance between now and the count down date
    var distance = countDownDate.getTime() - now;
    setTimer({time: Math.floor(distance / 1000)})
});

document.getElementById('pause').addEventListener('click', () => {
    paused = !paused;
    $('#pause').text(paused ? 'Resume' : 'Pause');

    localStorage.setItem('paused', paused)

});

$('#set-timer-form').submit((e) => {
    e.preventDefault();
    var inputVal = parseInt($('#set-time-input').val());
    if (isNaN(inputVal)) return;
    countDownDate = new Date(new Date().getTime() + inputVal * 1000 * 60);
    setTimer({time: inputVal * 60})
});

$('#text-style-form').submit((e) => {
    e.preventDefault();
    var textStyle = $('#text-style-css').val();
    localStorage.setItem('textStyle', textStyle)
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
    setTimer({time: Math.floor(distance / 1000)})
});

$('#authentification-form').submit((e) => {
    e.preventDefault();
    var donatePlatform = $('input[name="donate-platform"]:checked').val();
    const authTokenSE = $('#auth-token-input-se').val();
    const authTokenSL = $('#auth-token-input-sl').val();
    localStorage.setItem('authTokenSE', authTokenSE)
    localStorage.setItem('authTokenSL', authTokenSL)
    localStorage.setItem('donatePlatform', donatePlatform)


    closeElements();
    closeLabs();

    if (donatePlatform == 'SE') {
        initElements(authTokenSE);
    } else if (donatePlatform == 'SL') {
        initLabs(authTokenSL);
    } else if (donatePlatform == 'BOTH') {
        initElements(authTokenSE);
        initLabs(authTokenSL, true);
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
        localStorage.setItem('timeMultiplier', timeMultiplier)
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
        document.getElementById('demo').innerHTML = 'PABAIGA';
    }
}, 1000);

setInterval(() => {
    var now = new Date().getTime();
    var distance = countDownDate.getTime() - now;
    setTimer({time: Math.floor(distance / 1000)})
}, 10000);

function setTimer({time}) {
    localStorage.setItem('time', time)
}

function setHistory({history}) {
    console.log('setHistory', history)
    if (!history) return;
    $('#time-history-content').empty()
    history.forEach(element => {
        $('#time-history-content').prepend(`
        <div class="time-history-el">
            <div>
                <span>${element.minutes}min</span>
                <span>${element.donate}</span>
            </div>
            <span class="time-history-el-timestamp">${element.timeFormatted}</span>
        </div>`)
    });
}

function addToHistory({donate, minutes}) {
    var now = new Date();
    var timeFormatted = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    var history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({donate, minutes, timeFormatted})
    if (history.length > 10) {
        history = history.slice(history.length - 10, history.length)
        $('#time-history-content').children().last().remove()
    }
    console.log(history)
    localStorage.setItem('history', JSON.stringify(history))

    $('#time-history-content').prepend(`
    <div class="time-history-el">
        <div>
            <span>${minutes}min</span>
            <span>${donate}</span>
        </div>
        <span class="time-history-el-timestamp">${timeFormatted}</span>
    </div>`)
}

