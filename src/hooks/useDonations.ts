import { useContext} from 'react';
import { StreamLabsWebSocketCtx } from '../context/websockets';

export const useDonations = () => {
  const {streamLabsSocket, donations} = useContext(StreamLabsWebSocketCtx);

  return { streamLabsSocket, donations };
};
