import React, { useEffect, useState } from 'react';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { RUNNING_IN_TAURI } from '../services/utils';
import { SubathonTimeCtx } from '../context/subathon-time';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { useDonations } from '../hooks/useDonations';
import { parseStreamLabsEvent } from '../services/sockets/tempstreamLabs';
import { useInterval } from '@mantine/hooks';
import { invoke } from '@tauri-apps/api/tauri'


function SubathonTimeProvider({ children }: { children: React.ReactNode }) {
  const [subathonTime, setSubathonTime] = useState<number>(-1);
  const [active, setActive] = useState<boolean>(false);
  const { subathonTimerMultiplierData } = useSubathonTimerConfig();
  const { streamLabsSocket } = useDonations();

  const interval = useInterval(() => {
    if (!RUNNING_IN_TAURI) {
      fetchIsActive()
    }
    if (!active) return;
    setSubathonTime((s) => s - 1);
  }, 1000);

  const refreshInterval = useInterval(() => {
    fetchTime();
  }, 3000);

  useEffect(() => {
    if (!RUNNING_IN_TAURI) {
      refreshInterval.start();
    } else {
      invoke('set_timer_active', {invokeMessage: active});
    }
    interval.start();
    return () => {
      interval.stop();
      refreshInterval.stop();
    };
  }, [active]);

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
    if (time <= 0) return;
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

  const fetchTime = async () => {
    const response = await fetch('http://localhost:1425/time', {
      method: 'GET',
    });
    
    const data = await response.json();
    setSubathonTime(parseInt(data));
  };

  const fetchIsActive = async () => {
    const response = await fetch('http://localhost:1425/is_timer_active', {
      method: 'GET',
    });

    const data = await response.json();
    setActive(data.isTimerActive);
  }

  useEffect(() => {
    if (subathonTime === null) return;
    saveSubathonTime(subathonTime);
    return () => {};
  }, [subathonTime]);

  useEffect(() => {
    fetchTime();
    interval.start();

    return () => {
      interval.stop();
    };
  }, []);

  return (
    <SubathonTimeCtx.Provider value={{ subathonTime, setSubathonTime, timerActive: active, setTimerActive: setActive }}>
      {children}
    </SubathonTimeCtx.Provider>
  );
}

export default SubathonTimeProvider;
