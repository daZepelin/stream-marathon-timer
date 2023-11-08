import React, { useEffect, useState } from 'react';
import { AuthentificationCtx } from '../context/authentification';
import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { RUNNING_IN_TAURI } from '../services/utils';

function AuthentificationProvider({ children }: { children: React.ReactNode }) {
  const [timeoutHandle, setTimeoutHandle] = useState<number | null>(null);
  const [streamLabsAuthKey, setStreamLabsAuthKey] = useState<string>('');
  const [streamElementsJWT, setStreamElementsJWT] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');

  const saveAuthKeys = async () => {
    console.log('saving auth keys');
    if (!RUNNING_IN_TAURI) return;

    await createDir('auth', {
      dir: BaseDirectory.AppLocalData,
      recursive: true,
    });

    writeTextFile('auth/keys.json', JSON.stringify({ streamLabsAuthKey, streamElementsJWT, platform }), {
      dir: BaseDirectory.AppLocalData,
    })
      .then(() => {
        console.log('Successfully saved auth keys');
      })
      .catch((err) => {
        console.log('Failed to save auth keys');
        console.log(err);
      });
  };

  useEffect(() => {
    console.log('useEffect');
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    let newTimeout = setTimeout(() => {
      saveAuthKeys();
    }, 1000);
    setTimeoutHandle(newTimeout);
    return () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
    };
  }, [streamElementsJWT, streamLabsAuthKey, platform]);

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await fetch('http://localhost:1425/auth_keys', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      setStreamLabsAuthKey(data.streamLabsAuthKey);
      setStreamElementsJWT(data.streamElementsJWT);
      setPlatform(data.platform);
    };

    fetchAuth();
  }, []);

  return (
    <AuthentificationCtx.Provider
      value={{
        streamLabsAuthKey,
        setStreamLabsAuthKey,
        streamElementsJWT,
        setStreamElementsJWT,
        platform,
        setPlatform,
      }}>
      {children}
    </AuthentificationCtx.Provider>
  );
}

export default AuthentificationProvider;
