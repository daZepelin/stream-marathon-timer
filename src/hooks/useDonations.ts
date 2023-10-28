import { useEffect, useState } from 'react';
import { IDonation } from '../types/sockets';
import { connectStreamLabsSocket } from '../services/sockets/streamLabs';
import { Socket } from 'socket.io-client';

interface IDonationsProps {
  streamLabsAuthKey: string;
  streamElementsJWT: string;
  newDonation: (donation: IDonation) => void;
}

export const useDonations = ({ streamLabsAuthKey, streamElementsJWT, newDonation }: IDonationsProps) => {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [streamLabsSocket, setStreamLabsSocket] = useState<Socket | null>(null);
  const [streamElementsSocket, setStreamElementsSocket] = useState<Socket | null>(null);

  const onDonationAdd = (donation: IDonation) => {
    setDonations((prevDonations) => [...prevDonations, donation]);
  };

  useEffect(() => {
    if (streamLabsAuthKey) {
      let newSocket = connectStreamLabsSocket({ authKey: streamLabsAuthKey, onDonationAdd });
      if (newSocket) {
        setStreamLabsSocket(newSocket);
      }
    }
  }, [streamLabsAuthKey]);


  useEffect(() => {
    // TODO: Implement StreamElements socket
  }, [streamElementsJWT]);

  return { donations };
};
