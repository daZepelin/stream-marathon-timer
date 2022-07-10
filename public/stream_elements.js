var streamElementsSocket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
});

const initElements = (authToken) => {
    streamElementsSocket = io('https://realtime.streamelements.com', {
        transports: ['websocket'],
    });
    const onConnect = () => {
        console.log('Successfully connected to the websocket');
        streamElementsSocket.emit('authenticate', { method: 'jwt', token: authToken });
    };

    streamElementsSocket.on('connect', onConnect);

    streamElementsSocket.on('unauthorized', console.error);
    streamElementsSocket.on('event:test', (data) => {
        if (data.listener == 'tip-latest' || data.listener == 'superchat-latest') handleStreamElementsTip(data.event, true);
    });

    streamElementsSocket.on('event', (data) => {
        // console.log('event', data);
        if (data.type == 'tip' || data.type == 'superchat') handleStreamElementsTip(data.data);
    });

    streamElementsSocket.on('authenticated', () => console.log('authentificated'));
};

const closeElements = () => {
    streamElementsSocket?.close();
    console.log('closed ELEMENTS');
    streamElementsSocket = null;
};

const handleStreamElementsTip = (event, test) => {
    if (test || event.currency == 'USD' || event.currency == 'EUR' || event.currency == 'GBP') {
        countDownDate = new Date(countDownDate.getTime() + event.amount * timeMultiplier * 60000);

        var now = new Date().getTime();

        var distance = countDownDate.getTime() - now;
        $.post('http://localhost:3000/setTimer', { time: Math.floor(distance / 1000) });
    }
};
