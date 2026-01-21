import React, { useCallback, useEffect, useState } from 'react';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { RUNNING_IN_TAURI } from '../services/utils';
import { SubathonTimeCtx } from '../context/subathon-time';
import useSubathonTimerConfig from '../hooks/useSubathonTimerConfig';
import { useDonations } from '../hooks/useDonations';
import { parseStreamLabsEvent } from '../services/sockets/streamLabs';
// import { useInterval } from '@mantine/hooks';
import useWorkerInterval from '../hooks/useWorkerInterval';
import { invoke } from '@tauri-apps/api/tauri';
import { parseStreamElementsEvent } from '../services/sockets/streamElements';
import { DEFAULT_DONATION_SOURCE_TOGGLES } from '../types/config';

function SubathonTimeProvider({ children }: { children: React.ReactNode }) {
  const [subathonTime, setSubathonTime] = useState<number>(-1);
  const [active, setActive] = useState<boolean>(false);
  const { subathonTimerMultiplierData, specialMultiplier } = useSubathonTimerConfig();
  const { streamLabsSocket, streamElementsSocket } = useDonations();

  const handleTick = useCallback(() => {
    if (!RUNNING_IN_TAURI) {
      fetchIsActive();
    }
    if (!active) return;
    setSubathonTime((s) => s - 1);
  }, [active]);

  const handleRefreshTick = useCallback(() => {
    if (RUNNING_IN_TAURI) return;
    fetchTime();
  }, []);

  var clearRefreshInterval = useWorkerInterval(handleRefreshTick, 3000);

  const clearInterval = useWorkerInterval(handleTick, 1000);

  useEffect(() => {
    if (!RUNNING_IN_TAURI) {
    } else {
      invoke('set_timer_active', { invokeMessage: active });
    }
    return () => {
      clearInterval();
      clearRefreshInterval();
    };
  }, [active]);

  const addTimeFromStreamLabsEvent = (event: any) => {
    const donation = parseStreamLabsEvent(event);

    const toggles = {
      streamLabs: {
        ...DEFAULT_DONATION_SOURCE_TOGGLES.streamLabs,
        ...(subathonTimerMultiplierData.donationSourceToggles?.streamLabs ?? {}),
      },
      streamElements: {
        ...DEFAULT_DONATION_SOURCE_TOGGLES.streamElements,
        ...(subathonTimerMultiplierData.donationSourceToggles?.streamElements ?? {}),
      },
    };

    const isEnabled = (toggles.streamLabs as any)?.[donation.donationType] !== false;
    if (!isEnabled) return;

    let timeToAdd = ((donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount) * 60;

    let message = donation.message?.toLowerCase();
    if (specialMultiplier.active && specialMultiplier.word.some((w) => message?.includes(w.toLowerCase()))) {
      timeToAdd *= specialMultiplier.multiplier;
    }

    if (isNaN(timeToAdd)) return;
    setSubathonTime((prevTime) => {
      return prevTime + timeToAdd;
    });
  };

  const addTimeFromStreamElementsEvent = (event: any) => {
    let donationData = { ...event.data, id: event._id };
    let donation = parseStreamElementsEvent(donationData, event.type);

    const toggles = {
      streamLabs: {
        ...DEFAULT_DONATION_SOURCE_TOGGLES.streamLabs,
        ...(subathonTimerMultiplierData.donationSourceToggles?.streamLabs ?? {}),
      },
      streamElements: {
        ...DEFAULT_DONATION_SOURCE_TOGGLES.streamElements,
        ...(subathonTimerMultiplierData.donationSourceToggles?.streamElements ?? {}),
      },
    };

    const isEnabled = (toggles.streamElements as any)?.[donation.donationType] !== false;
    if (!isEnabled) return;

    let timeToAdd = ((donation.amount * subathonTimerMultiplierData.minutes) / subathonTimerMultiplierData.amount) * 60;

    let message = donation.message?.toLowerCase();
    if (specialMultiplier.active && specialMultiplier.word.some((w) => message?.includes(w.toLowerCase()))) {
      timeToAdd *= specialMultiplier.multiplier;
    }

    if (isNaN(timeToAdd)) return;
    setSubathonTime((prevTime) => {
      return prevTime + timeToAdd;
    });
  };

  useEffect(() => {
    if (!streamLabsSocket) return;
    streamLabsSocket.on('event', addTimeFromStreamLabsEvent);
    return () => {
      streamLabsSocket.off('event', addTimeFromStreamLabsEvent);
    };
  }, [streamLabsSocket, subathonTimerMultiplierData, specialMultiplier]);

  useEffect(() => {
    if (!streamElementsSocket) return;
    streamElementsSocket.on('event', addTimeFromStreamElementsEvent);
    return () => {
      streamElementsSocket.off('event', addTimeFromStreamElementsEvent);
    };
  }, [streamElementsSocket, subathonTimerMultiplierData, specialMultiplier]);

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
  };

  useEffect(() => {
    if (subathonTime === null) return;
    saveSubathonTime(subathonTime);
    return () => {};
  }, [subathonTime]);

  useEffect(() => {
    fetchTime();

    return () => {
      clearInterval();
      clearRefreshInterval();
    };
  }, []);

  return (
    <SubathonTimeCtx.Provider value={{ subathonTime, setSubathonTime, timerActive: active, setTimerActive: setActive }}>
      {children}
    </SubathonTimeCtx.Provider>
  );
}

export default SubathonTimeProvider;
