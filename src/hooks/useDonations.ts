import { useContext } from 'react';
import { StreamLabsWebSocketCtx } from '../context/websockets';

export const useDonations = () => {
  const { streamLabsSocket, streamElementsSocket, donations, socketStatuses } = useContext(StreamLabsWebSocketCtx);

  return { streamLabsSocket, streamElementsSocket, donations, socketStatuses };
};
