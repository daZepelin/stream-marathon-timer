import { useContext, useEffect, useState } from 'react';
import { BaseDirectory, createDir, writeTextFile } from '@tauri-apps/api/fs';

import { RUNNING_IN_TAURI } from '../services/utils';
import { useDonations } from './useDonations';
import { parseStreamLabsEvent } from '../services/sockets/streamLabs';
import { SubathonTimeCtx } from '../context/subathon-time';
import useSubathonTimerConfig from './useSubathonTimerConfig';

const useSubathonTime = () => {
  const { subathonTimerMultiplierData } = useSubathonTimerConfig();
  const { subathonTime, setSubathonTime } = useContext(SubathonTimeCtx);
  const { streamLabsSocket } = useDonations();

  const addTimeFromEvent = (event: any) => {
    console.log(subathonTimerMultiplierData, subathonTime, subathonTimerMultiplierData.amount)
    const donation = parseStreamLabsEvent(event);
    let timeToAdd = ((donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount) * 60;
    let newTime = subathonTime ?? 0 + timeToAdd;
    setSubathonTime(newTime);
    console.log(newTime, timeToAdd)
    console.log('addTimeFromEvent', donation);
  };

  useEffect(() => {
    console.log('effect, streamLabsSocket', streamLabsSocket);
    if (!streamLabsSocket) return;
    streamLabsSocket.on('event', addTimeFromEvent);
    return () => {
      streamLabsSocket.off('event', addTimeFromEvent);
    };
  }, [streamLabsSocket]);

  return { subathonTime, setSubathonTime };
};

export default useSubathonTime;
