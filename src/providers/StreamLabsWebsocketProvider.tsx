import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { StreamLabsWebSocketCtx } from '../context/websockets';
import { AuthentificationCtx } from '../context/authentification';
import { RUNNING_IN_TAURI } from '../services/utils';
import { IDonation } from '../types/sockets';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { connectStreamLabsSocket, parseStreamLabsEvent } from '../services/sockets/tempstreamLabs';
import { connectStreamElementsSocket, parseStreamElementsEvent } from '../services/sockets/tempstreamElements';

function StreamLabsWebsocketProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [streamLabsSocket, setStreamLabsSocket] = useState<Socket | null>(null);
  const { streamLabsAuthKey, streamElementsJWT } = useContext(AuthentificationCtx);
  const { subathonTimerMultiplierData } = useSubathonTimerConfig();

  useEffect(() => {
    if (!RUNNING_IN_TAURI) return;
    if (!streamLabsAuthKey) return;
    const wsSL = connectStreamLabsSocket({
      authKey: streamLabsAuthKey,
    });

    const wsSE = connectStreamElementsSocket({ authToken: streamElementsJWT });

    if (wsSL) {
      wsSL.on('event', (data: any) => {
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
      setStreamLabsSocket(wsSL);
    }

    if (wsSE) {
      wsSE.on('event', (data: any) => {
        if (data.type == 'tip' || data.type == 'superchat') {
          let donation = parseStreamElementsEvent(data.data, data.type);
        }
      })
      wsSE.on('event:test', (data: any) => {
        if (data.listener == 'tip-latest' || data.listener == 'superchat-latest') {
          let donation = parseStreamElementsEvent(data.event, data.listener, true);
        }
      })
    }

    return () => {
      if (wsSL) wsSL.close();
    };
  }, [streamLabsAuthKey, donations, subathonTimerMultiplierData]);

  return (
    <StreamLabsWebSocketCtx.Provider value={{ streamLabsSocket: streamLabsSocket, donations }}>
      {children}
    </StreamLabsWebSocketCtx.Provider>
  );
}

export default StreamLabsWebsocketProvider;
