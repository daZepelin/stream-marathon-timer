import { io, Socket } from 'socket.io-client';
import { IDonation, IStreamLabsSocketProps } from '../../types/sockets';

export const parseStreamLabsEvent = (eventData: any): IDonation => {
  if (eventData.type === 'donation') {
    return {
      amount: eventData.message[0].amount,
      currency: eventData.message[0]?.formatted_amount?.charAt(0),
      username: eventData.message[0].name,
      // message: eventData.message[0].message,
      date: new Date(),
      platform: 'SL',
      donationType: eventData.type,
    };
  } else if (eventData.type === 'superchat') {
    return {
      amount: eventData.message[0].amount,
      currency: eventData.message[0].currency,
      username: eventData.message[0].from,
      // message: eventData.message[0].message,
      date: new Date(),
      platform: 'SL',
      donationType: eventData.type,
    };
  } else if (eventData.type === 'stars') {
    return {
      amount: Math.floor(eventData.message[0].amount / 100),
      currency: eventData.message[0].currency,
      username: eventData.message[0].name,
      // message: eventData.message[0].message,
      date: new Date(),
      platform: 'SL',
      donationType: eventData.type,
    };
  }

  return {
    amount: 0,
    currency: '',
    username: '',
    // message: '',
    date: new Date(),
    platform: 'SL',
    donationType: 'donation',
  }
};

export const connectStreamLabsSocket = ({ authKey }: IStreamLabsSocketProps): Socket | undefined => {
  console.log('connectStreamLabsSocket', authKey);

  if (authKey) {
    console.log('connecting');
    let newSocket = io('https://sockets.streamlabs.com?token=' + authKey, { transports: ['websocket'] });
    newSocket.on('connect', () => {
      console.log('Connected to StreamLabs');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from StreamLabs');
    });

    newSocket.onAny((event, ...args) => {
      console.log(event, args);
    });
    newSocket.on('event', () => {
      console.log('test2');
    });

    return newSocket;
  }

  return;

  // useEffect(() => {

  // }, [authKey]);
};
