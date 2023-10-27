import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IStreamLabsSocketProps } from '../../types/sockets';

export const connectStreamLabsSocket = ({ authKey, onDonationAdd }: IStreamLabsSocketProps): Socket | undefined => {
    console.log('connectStreamLabsSocket', authKey)
  const eventHandler = (eventData: any) => {
    if (eventData.type === 'donation') {
      onDonationAdd({
        amount: eventData.message[0].amount,
        currency: eventData.message[0]?.formatted_amount?.charAt(0),
        username: eventData.message[0].name,
        // message: eventData.message[0].message,
        date: new Date(),
        platform: 'SL',
        donationType: eventData.type,
      });
    } else if (eventData.type === 'superchat') {
      onDonationAdd({
        amount: eventData.message[0].amount,
        currency: eventData.message[0].currency,
        username: eventData.message[0].from,
        // message: eventData.message[0].message,
        date: new Date(),
        platform: 'SL',
        donationType: eventData.type,
      });
    } else if (eventData.type === 'stars') {
      onDonationAdd({
        amount: Math.floor(eventData.message[0].amount / 100),
        currency: eventData.message[0].currency,
        username: eventData.message[0].name,
        // message: eventData.message[0].message,
        date: new Date(),
        platform: 'SL',
        donationType: eventData.type,
      });
    }
  };

  if (authKey) {
    console.log('connecting')
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

    newSocket.on('event', eventHandler);

    return newSocket;
  }

  return;

  // useEffect(() => {

  // }, [authKey]);
};
