import { useEffect, useState } from 'react';
import { RUNNING_IN_TAURI } from '../services/utils';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';

const useSubathonTimerStyle = () => {
  const [style, setStyle] = useState({} as any);
  const [timeoutHandle, setTimeoutHandle] = useState<number | null>(null);

  const saveSubathonTimerStyle = async (style: any) => {
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
  };

  useEffect(() => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    let newTimeout = setTimeout(() => {
      saveSubathonTimerStyle(style);

    }, 3000);
    setTimeoutHandle(newTimeout);
    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [style]);

  useEffect(() => {
    const fetchStyle = async () => {
      const response = await fetch('http://localhost:1425/timer_style', {
        method: 'GET',
      });
      const data = await response.json();
      setStyle(data);
    };

    fetchStyle();
  }, []);

  return { subathonTimerStyle: style, setSubathonTimerStyle: setStyle };
};

export default useSubathonTimerStyle;
