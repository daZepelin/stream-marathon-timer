import { Socket, io } from 'socket.io-client';
import { DonationType, IDonation } from '../../types/sockets';

export const parseStreamElementsEvent = (event: any, type?: string, isTest?: boolean): IDonation => {
  if (
    isTest ||
    event.currency == 'USD' ||
    event.currency == 'EUR' ||
    event.currency == 'GBP' ||
    event.currency == null
  ) {
    return {
      id: event.id,
      amount: event.amount,
      currency: event.currency,
      username: event.username,
      date: new Date(),
      platform: 'SE',
      donationType: (type as DonationType) ?? 'donation',
    };
  }

  return {
    id: '',
    amount: 0,
    currency: '',
    username: '',
    date: new Date(),
    platform: 'SE',
    donationType: (type as DonationType) ?? 'donation',
  };
};

export const connectStreamElementsSocket = ({ authToken }: { authToken: string }): Socket | undefined => {
  var streamElementsSocket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
  });

  const onConnect = () => {
    console.log('Successfully connected to the websocket', authToken);
    streamElementsSocket.emit('authenticate', { method: 'jwt', token: authToken });
  };

  const onDisconnect = () => {
    console.log('Disconnected from StreamElements');
  };

  streamElementsSocket.on('connect', onConnect);

  streamElementsSocket.on('disconnect', onDisconnect);

  streamElementsSocket.on('unauthorized', console.error);
  streamElementsSocket.on('event:test', (data: any) => {});

  streamElementsSocket.on('authenticated', () => console.log('Authentificated at StreamElements'));
  return streamElementsSocket;
};
