import React, { useEffect, useState } from 'react';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { RUNNING_IN_TAURI } from '../services/utils';
import { SubathonTimeCtx } from '../context/subathon-time';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { useDonations } from '../hooks/useDonations';
import { parseStreamLabsEvent } from '../services/sockets/streamLabs';
import { useInterval } from '@mantine/hooks';

function SubathonTimeProvider({ children }: { children: React.ReactNode }) {
  // let [saveTimeoutHandle, setSaveTimeoutHandle] = useState<number | null>(null);
  const [subathonTime, setSubathonTime] = useState<number>(98);
  const { subathonTimerMultiplierData } = useSubathonTimerConfig();
  const { streamLabsSocket } = useDonations();

  const interval = useInterval(() => setSubathonTime((s) => s - 1), 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  const addTimeFromEvent = (event: any) => {
    const donation = parseStreamLabsEvent(event);
    let timeToAdd = ((donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount) * 60;
    setSubathonTime((prevTime) => {
      return prevTime + timeToAdd;
    });
  };

  useEffect(() => {
    if (!streamLabsSocket) return;
    streamLabsSocket.on('event', addTimeFromEvent);
    return () => {
      streamLabsSocket.off('event', addTimeFromEvent);
    };
  }, [streamLabsSocket, subathonTimerMultiplierData]);

  const saveSubathonTime = async (time: number) => {
    if (!RUNNING_IN_TAURI) return;

    await createDir('subathon', {
      dir: BaseDirectory.AppLocalData,
      recursive: true,
    });
    writeTextFile('subathon/time.txt', time.toString(), {
      dir: BaseDirectory.AppLocalData,
    })
      .then(() => {
        console.log('Successfully saved subathon time');
      })
      .catch((err) => {
        console.log('Failed to save subathon time');
        console.log(err);
      });
  };

  const timeTick = () => {
    if (subathonTime === null) return;
    setSubathonTime((prevTime) => prevTime - 1);
  };

  const fetchTime = async () => {
    const response = await fetch('http://localhost:1425/time', {
      method: 'GET',
    });
    const data = await response.json();
    console.log('received', data)

    setSubathonTime(parseInt(data));
  };

  useEffect(() => {
    if (subathonTime === null) return;
    if (subathonTime % 10 === 0) saveSubathonTime(subathonTime);
    return () => {};

  }, [subathonTime]);

  useEffect(() => {
    fetchTime();
    interval.start();

    return () => {
      interval.stop();
    };

    // let interval = setInterval(timeTick, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  useInterval(timeTick, 1000);

  return <SubathonTimeCtx.Provider value={{ subathonTime, setSubathonTime }}>{children}</SubathonTimeCtx.Provider>;
}

export default SubathonTimeProvider;
