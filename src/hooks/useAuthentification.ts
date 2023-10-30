import { useContext } from 'react';
import { AuthentificationCtx } from '../context/authentification';

function useAuthentification() {
  const { streamLabsAuthKey, setStreamLabsAuthKey, streamElementsJWT, setStreamElementsJWT, platform, setPlatform } =
    useContext(AuthentificationCtx);

  return { streamLabsAuthKey, setStreamLabsAuthKey, streamElementsJWT, setStreamElementsJWT, platform, setPlatform };
}

export default useAuthentification;
