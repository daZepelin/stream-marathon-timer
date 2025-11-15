import { io, Socket } from 'socket.io-client';
import { IDonation, IStreamLabsSocketProps } from '../../types/sockets';

export const parseStreamLabsEvent = (eventData: any): IDonation => {
  if (eventData.type === 'donation') {
    let amount;
    if (typeof eventData.message[0].amount === 'string') {
      amount = parseFloat(eventData.message[0].amount.replace(/[^0-9.-]+/g, ''));
    } else if (typeof eventData.message[0].amount === 'number') {
      amount = eventData.message[0].amount;
    } else {
      amount = 0;
    }
    return {
      id: eventData.event_id,
      amount,
      currency: eventData.message[0]?.formatted_amount?.charAt(0),
      username: eventData.message[0].name,
      message: eventData.message[0].message,
      date: new Date(),
      platform: 'SL',
      donationType: eventData.type,
    };
  } else if (eventData.type === 'superchat') {
    let amount;
    // Superchat real amount is in string
    if (typeof eventData.message[0].amount === 'string') {
      amount = parseInt(eventData.message[0].amount.replace(/[^0-9.-]+/g, '')) / 1000000;
    /// Superchat test amount is in number
    } else if (typeof eventData.message[0].amount === 'number') {
      amount = eventData.message[0].amount / 1000000;
    } else {
      amount = 0;
    }
    return {
      id: eventData.event_id,
      amount,
      currency: eventData.message[0].currency,
      username: eventData.message[0].name,
      message: eventData.message[0].comment,
      date: new Date(),
      platform: 'SL',
      donationType: eventData.type,
    };
  } else if (eventData.type === 'stars') {
    return {
      id: eventData.event_id,
      amount: Math.floor(eventData.message[0].amount / 1000),
      currency: eventData.message[0].currency,
      username: eventData.message[0].name,
      message: eventData.message[0].message,
      date: new Date(),
      platform: 'SL',
      donationType: eventData.type,
    };
  }

  return {
    id: '',
    amount: 0,
    currency: '',
    username: '',
    message: '',
    date: new Date(),
    platform: 'SL',
    donationType: 'donation',
  };
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

    newSocket.on('event', () => {
      console.log('test2');
    });

    return newSocket;
  }

  return;
};
