import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { StreamLabsWebSocketCtx } from '../context/websockets';
import { AuthentificationCtx } from '../context/authentification';
import { RUNNING_IN_TAURI } from '../services/utils';
import { IDonation } from '../types/sockets';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { connectStreamLabsSocket, parseStreamLabsEvent } from '../services/sockets/streamLabs';
import { connectStreamElementsSocket, parseStreamElementsEvent } from '../services/sockets/streamElements';
import {sendLog} from '../services/logs'

function WebsocketProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [streamLabsSocket, setStreamLabsSocket] = useState<Socket | null>(null);
  const [streamElementsSocket, setStreamElementsSocket] = useState<Socket | null>(null);
  const { streamLabsAuthKey, streamElementsJWT, platform } = useContext(AuthentificationCtx);
  const { subathonTimerMultiplierData, specialMultiplier } = useSubathonTimerConfig();
  const [socketStatuses, setSocketStatuses] = useState<{ streamLabs: string; streamElements: string }>({
    streamLabs: 'disconnected',
    streamElements: 'disconnected',
  });

  const isSuitablePlatform = (pl: string) => platform === 'both' || platform === pl;

  useEffect(() => {
    if (!RUNNING_IN_TAURI) return;
    if (streamLabsAuthKey && isSuitablePlatform('streamLabs')) {
      var wsSL = connectStreamLabsSocket({
        authKey: streamLabsAuthKey,
      });
    }

    if (streamElementsJWT && isSuitablePlatform('streamElements')) {
      var wsSE = connectStreamElementsSocket({ authToken: streamElementsJWT });
    }

    if (wsSL) {
      wsSL.on('event', (data: any) => {
        sendLog('labs', JSON.stringify(data))
        let donation = parseStreamLabsEvent(data);
        if (!donation) return;
        if (donation.amount <= 0) return;
        donation.minutesAdded =
          (donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount;

        let message = donation.message?.toLowerCase();
        if (specialMultiplier.active && specialMultiplier.word.some((w) => message?.includes(w.toLowerCase()))) {
          donation.minutesAdded *= specialMultiplier.multiplier;
        }

        setDonations((donations) => donations.filter((donation) => donation.id === donation.id));
        if (donation) {
          setDonations((donations) => [...donations, donation]);
        }
      });

      wsSL.on('connect', () => {
        setSocketStatuses((statuses) => ({ ...statuses, streamLabs: 'connected' }));
      });
      wsSL.on('disconnect', () => {
        setSocketStatuses((statuses) => ({ ...statuses, streamLabs: 'disconnected' }));
      });
      setStreamLabsSocket(wsSL);
    }

    if (wsSE) {
      wsSE.on('event', (data: any) => {
        sendLog('elements', JSON.stringify(data))
        if (data.type == 'tip' || data.type == 'superchat') {
          let donationData = { ...data.data, id: data._id };
          let donation = parseStreamElementsEvent(donationData, data.type);
          if (!donation) return;
          if (donation.amount <= 0) return;
          donation.minutesAdded =
            (donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount;

          let message = donation.message?.toLowerCase();
          if (specialMultiplier.active && specialMultiplier.word.some((w) => message?.includes(w.toLowerCase()))) {
            donation.minutesAdded *= specialMultiplier.multiplier;
          }

          setDonations((donations) => donations.filter((donation) => donation.id === donation.id));
          if (donation) {
            setDonations((donations) => [...donations, donation]);
          }
        }
      });

      wsSE.on('connect', () => {
        setSocketStatuses((statuses) => ({ ...statuses, streamElements: 'connected' }));
      });

      wsSE.on('authenticated', () => {
        setSocketStatuses((statuses) => ({ ...statuses, streamElements: 'authenticated' }));
      });

      wsSE.on('disconnect', () => {
        setSocketStatuses((statuses) => ({ ...statuses, streamElements: 'disconnected' }));
      });

      wsSE.on('unauthorized', () => {
        setSocketStatuses((statuses) => ({ ...statuses, streamElements: 'unauthorized' }));
      });
      setStreamElementsSocket(wsSE);
    }

    return () => {
      if (wsSL) wsSL.close();
      if (wsSE) wsSE.close();
    };
  }, [streamLabsAuthKey, streamElementsJWT, donations, subathonTimerMultiplierData, platform]);

  return (
    <StreamLabsWebSocketCtx.Provider value={{ streamLabsSocket, streamElementsSocket, donations, socketStatuses }}>
      {children}
    </StreamLabsWebSocketCtx.Provider>
  );
}

export default WebsocketProvider;
