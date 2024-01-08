import React, { useEffect, useState } from 'react';
import { SubathonTimerConfigCtx } from '../context/subathon-time';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { RUNNING_IN_TAURI } from '../services/utils';
import { useInterval } from '@mantine/hooks';
import { ISpecialMultiplier } from '../types/config';

function SubathonConfigProvider({ children }: { children: React.ReactNode }) {
  const [timeoutHandle, setTimeoutHandle] = useState<number | null>(null);
  const [style, setStyle] = useState({} as any);
  const [timerMultiplierData, setTimerMultiplierData] = useState<{ minutes: number; amount: number }>({
    minutes: 1,
    amount: 1,
  });
  const [specialMultiplier, setSpecialMultiplier] = useState<ISpecialMultiplier>({
    active: false,
    multiplier: 1,
    word: [],
  });

  const refreshInterval = useInterval(
    () => {
      fetchCfg();
    },
    3000,
  );

  const fetchCfg = async () => {
    const response = await fetch('http://localhost:1425/timer_cfg', {
      method: 'GET',
    });
    const data = await response.json();
    setStyle(data.style);
    setTimerMultiplierData(data.config);
    setSpecialMultiplier(data.special_multiplier);
  };

  const saveSubathonTimerStyle = async () => {
    if (!RUNNING_IN_TAURI) return;

    await createDir('subathon', {
      dir: BaseDirectory.AppLocalData,
      recursive: true,
    });
    writeTextFile('subathon/style.json', JSON.stringify(style), {
      dir: BaseDirectory.AppLocalData,
    })
      .then(() => {
        console.log('Successfully saved subathon timer style');
      })
      .catch((err) => {
        console.log('Failed to save subathon timer style');
        console.log(err);
      });

    writeTextFile('subathon/config.json', JSON.stringify(timerMultiplierData), {
      dir: BaseDirectory.AppLocalData,
    })
      .then(() => {
        console.log('Successfully saved subathon timer multiplier data');
      })
      .catch((err) => {
        console.log('Failed to save subathon timer multiplier data');
        console.log(err);
      });

    writeTextFile('subathon/special_multiplier.json', JSON.stringify(specialMultiplier), {
      dir: BaseDirectory.AppLocalData,
    })
      .then(() => {
        console.log('Successfully saved subathon special multiplier data');
      })
      .catch((err) => {
        console.log('Failed to save subathon special multiplier data');
        console.log(err);
      });
  };

  useEffect(() => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    let newTimeout = setTimeout(() => {
      saveSubathonTimerStyle();
    }, 3000);
    setTimeoutHandle(newTimeout);
    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [style, timerMultiplierData, specialMultiplier]);

  useEffect(() => {

    if (!RUNNING_IN_TAURI)  {
      refreshInterval.start();
    }

    fetchCfg();

    return () => {
      refreshInterval.stop();
    };
  }, []);

  return (
    <SubathonTimerConfigCtx.Provider
      value={{
        subathonTimerStyle: style,
        setSubathonTimerStyle: setStyle,
        subathonTimerMultiplierData: timerMultiplierData,
        setSubathonTimerMultiplierData: setTimerMultiplierData,
        specialMultiplier: specialMultiplier,
        setSpecialMultiplier: setSpecialMultiplier,
      }}>
      {children}
    </SubathonTimerConfigCtx.Provider>
  );
}

export default SubathonConfigProvider;
