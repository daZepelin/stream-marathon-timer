import { Socket, io } from 'socket.io-client';

export const parseStreamElementsEvent = (event: any, type?: string, isTest?: boolean) => {
  if (
    isTest ||
    event.currency == 'USD' ||
    event.currency == 'EUR' ||
    event.currency == 'GBP' ||
    event.currency == null
  ) {
    return {
      id: event.tipId,
      amount: event.amount,
      currency: event.currency,
      username: event.displayName,
      date: new Date(),
      platform: 'SE',
      donationType: type ?? 'donation',
    };
  }
};

export const connectStreamElementsSocket = ({ authToken }: { authToken: string }): Socket | undefined => {
  var streamElementsSocket = io('https://realtime.streamelements.com', {
    transports: ['websocket'],
  });
  const onConnect = () => {
    console.log('Successfully connected to the websocket');
    streamElementsSocket.emit('authenticate', { method: 'jwt', token: authToken });
  };

  streamElementsSocket.on('connect', onConnect);

  streamElementsSocket.on('unauthorized', console.error);
  streamElementsSocket.on('event:test', (data: any) => {});

  streamElementsSocket.on('authenticated', () => console.log('authentificated'));
  return streamElementsSocket;
};
