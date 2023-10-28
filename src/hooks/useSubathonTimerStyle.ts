import { useEffect, useState } from 'react';
import { RUNNING_IN_TAURI } from '../services/utils';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

const useSubathonTimerStyle = () => {
  const [style, setStyle] = useState({} as any);
  let timeout: number | undefined = undefined;

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
  }

  useEffect(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      saveSubathonTimerStyle(style);
    }, 3000);
    return () => {
      
    };
  }, [style]);

  useEffect(() => {
    const fetchStyle = async () => {
      const response = await fetch('http://localhost:1425/timer_style', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data)
      setStyle(data);
    };

    fetchStyle();
  }, []);

  return { subathonTimerStyle: style, setSubathonTimerStyle: setStyle };
};

export default useSubathonTimerStyle;