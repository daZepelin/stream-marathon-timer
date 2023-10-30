import { useContext} from 'react';
import { IDonation } from '../types/sockets';
import { AuthentificationCtx } from '../context/authentification';

import { StreamLabsWebSocketCtx } from '../context/websockets';

interface IDonationsProps {
  newDonation: (donation: IDonation) => void;
}

export const useDonations = () => {
  const streamLabsSocket = useContext(StreamLabsWebSocketCtx);


  return { streamLabsSocket };
};
