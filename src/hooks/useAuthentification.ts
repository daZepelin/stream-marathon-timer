import { createDir, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';
import { useContext, useEffect, useState } from 'react';
import { RUNNING_IN_TAURI } from '../services/utils';
import { AuthentificationCtx } from '../context/authentification';

function useAuthentification() {
  const { streamLabsAuthKey, setStreamLabsAuthKey, streamElementsJWT, setStreamElementsJWT, platform, setPlatform } =
    useContext(AuthentificationCtx);

  return { streamLabsAuthKey, setStreamLabsAuthKey, streamElementsJWT, setStreamElementsJWT, platform, setPlatform };
}

export default useAuthentification;
