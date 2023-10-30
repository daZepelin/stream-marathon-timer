import React, { useEffect, useState } from 'react';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { RUNNING_IN_TAURI } from '../services/utils';
import { SubathonTimeCtx } from '../context/subathon-time';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { useDonations } from '../hooks/useDonations';
import { parseStreamLabsEvent } from '../services/sockets/streamLabs';
import { useInterval } from '@mantine/hooks';

function SubathonTimeProvider({ children }: { children: React.ReactNode }) {
  const [subathonTime, setSubathonTime] = useState<number>(100);
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
    // let newTime = subathonTime ?? 0 + timeToAdd;
    console.log(donation, timeToAdd/60, subathonTimerMultiplierData)
    setSubathonTime((prevTime) => {
      return prevTime + timeToAdd;
    });
  };

  useEffect(() => {
    console.log('effect, streamLabsSocket', streamLabsSocket);
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
    console.log('timeTick');
    if (subathonTime === null) return;
    setSubathonTime(prevTime => prevTime - 1);
  };

  const fetchTime = async () => {
    const response = await fetch('http://localhost:1425/time', {
      method: 'GET',
    });
    const data = await response.json();

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
    }

    // let interval = setInterval(timeTick, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  useInterval(timeTick, 1000);

  return (
    <SubathonTimeCtx.Provider value={{ subathonTime, setSubathonTime }}>
      <div style={{ zIndex: 900 }}>{subathonTime}</div>
      {children}
    </SubathonTimeCtx.Provider>
  );
}

export default SubathonTimeProvider;
