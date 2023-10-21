// Stream Labs
var streamlabsSocket = null;

const initLabs = (authToken, skipChat) => {
    streamlabsSocket = io(`https://sockets.streamlabs.com?token=${authToken}`, { transports: ['websocket'] });

    streamlabsSocket.on('connect', () => {
        console.log('Successfully connected to the websocket');
    });
    
    streamlabsSocket.on('event', (eventData) => {
        if (eventData.type === 'donation') {
            var currency = eventData.message[0]?.formatted_amount?.charAt(0);
            if (currency == '$' || currency == '€' || currency == '£') {
                let timeToAdd = eventData.message[0].amount * timeMultiplier
                countDownDate = new Date(
                    countDownDate.getTime() + eventData.message[0].amount * timeMultiplier * 60000
                );

                var now = new Date().getTime();

                var distance = countDownDate.getTime() - now;
                setTimer({time: Math.floor(distance / 1000)})

                addToHistory({minutes: timeToAdd, donate: eventData.message[0].formatted_amount, platform: 'SL'})
            }
        } else if (eventData.type === 'superchat' && !skipChat) {
            var currency = eventData.message[0].currency
            if (currency == 'USD' || currency == 'EUR' || currency == 'GBP') {
                let timeToAdd = eventData.message[0].amount * timeMultiplier    
                countDownDate = new Date(
                    countDownDate.getTime() + (eventData.message[0].amount / 1000000) * timeMultiplier * 60000
                );

                var now = new Date().getTime();

                var distance = countDownDate.getTime() - now;
                setTimer({time: Math.floor(distance / 1000)})

                addToHistory({minutes: timeToAdd, donate: eventData.message[0].amount / 1000000 + ' ' + eventData.message[0].currency, platform: 'SL'})
            }
        } else if (eventData.type === 'stars' ) {
            let timeToAdd = eventData.message[0].amount * timeMultiplier
            countDownDate = new Date(
                countDownDate.getTime() + eventData.message[0].amount * timeMultiplier * 600
            );

            var now = new Date().getTime();

            var distance = countDownDate.getTime() - now;
            setTimer({time: Math.floor(distance / 1000)})

            addToHistory({minutes: timeToAdd, donate: eventData.message[0].amount + ' stars', platform: 'SL'})
        }
    });
};

function setTimer({time}) {
    localStorage.setItem('time', time)
}

closeLabs = () => {
    streamlabsSocket?.close();
    streamlabsSocket = null;
};
