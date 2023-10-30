import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { IDonation } from '../types/sockets';

export interface IStreamLabsSocketCtx {
  streamLabsSocket: Socket | null;
  donations: IDonation[];
}

export const StreamLabsWebSocketCtx = createContext<IStreamLabsSocketCtx>({
  streamLabsSocket: null,
  donations: [],
});
