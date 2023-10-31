import React, { useContext, useEffect, useState } from 'react';
import { connectStreamLabsSocket, parseStreamLabsEvent } from '../services/sockets/streamLabs';
import { Socket } from 'socket.io-client';
import { StreamLabsWebSocketCtx } from '../context/websockets';
import { AuthentificationCtx } from '../context/authentification';
import { RUNNING_IN_TAURI } from '../services/utils';
import { IDonation } from '../types/sockets';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';

function StreamLabsWebsocketProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [streamLabsSocket, setStreamLabsSocket] = useState<Socket | null>(null);
  const { streamLabsAuthKey } = useContext(AuthentificationCtx);
  const { subathonTimerMultiplierData } = useSubathonTimerConfig();

  useEffect(() => {
    if (!RUNNING_IN_TAURI) return;
    if (!streamLabsAuthKey) return;
    const ws = connectStreamLabsSocket({
      authKey: streamLabsAuthKey,
    });

    if (!ws) return;

    ws.on('event', (data: any) => {
      let donation = parseStreamLabsEvent(data);
      if (!donation) return;
      if (donation.amount <= 0) return;
      donation.minutesAdded =
        (donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount;
      setDonations((donations) => donations.filter((donation) => donation.id === donation.id));
      if (donation) {
        setDonations((donations) => [...donations, donation]);
      }
    });
    setStreamLabsSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [streamLabsAuthKey, donations, subathonTimerMultiplierData]);

  return (
    <StreamLabsWebSocketCtx.Provider value={{ streamLabsSocket: streamLabsSocket, donations }}>
      {children}
    </StreamLabsWebSocketCtx.Provider>
  );
}

export default StreamLabsWebsocketProvider;