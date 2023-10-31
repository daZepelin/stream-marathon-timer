import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { IDonation } from '../types/sockets';

export interface IStreamLabsSocketCtx {
  streamLabsSocket: Socket | null;
  streamElementsSocket: Socket | null;
  donations: IDonation[];
  socketStatuses: {
    streamLabs: string;
    streamElements: string;
  };
}

export const StreamLabsWebSocketCtx = createContext<IStreamLabsSocketCtx>({
  streamLabsSocket: null,
  streamElementsSocket: null,
  donations: [],
  socketStatuses: {
    streamLabs: 'disconnected',
    streamElements: 'disconnected',
  },
});
