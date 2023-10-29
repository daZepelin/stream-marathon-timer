import { useEffect, useState } from 'react';
import { BaseDirectory, createDir, writeTextFile } from '@tauri-apps/api/fs';

import { RUNNING_IN_TAURI } from '../services/utils';

const useSubathonTime = () => {
  const [subathonTime, setSubathonTime] = useState<null | number>(null);

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
    setSubathonTime((prevState) => {
      if (prevState === null) return null;
      if (prevState % 10 === 0) {
        saveSubathonTime(prevState - 1);
      }
      return prevState - 1;
    });
  };

  const fetchTime = async () => {
    const response = await fetch('http://localhost:1425/time', {
      method: 'GET',
    });
    const data = await response.json();

    setSubathonTime(parseInt(data));
    console.log(data);
  };

  const addTime = (time: number) => {
    setSubathonTime((prevState) => {
      if (prevState === null) return null;
      return prevState + time;
    });
  }

  useEffect(() => {
    fetchTime();

    let interval = setInterval(timeTick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { subathonTime, setSubathonTime, addTime };
};

export default useSubathonTime;
