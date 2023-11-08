import { createContext } from 'react';

export interface IAuthentificationCtx {
  streamLabsAuthKey: string;
  setStreamLabsAuthKey: (key: string) => void;
  streamElementsJWT: string;
  setStreamElementsJWT: (key: string) => void;
  platform: string;
  setPlatform: (platform: string) => void;
}

export const AuthentificationCtx = createContext<IAuthentificationCtx>({
  streamLabsAuthKey: '',
  setStreamLabsAuthKey: () => {},
  streamElementsJWT: '',
  setStreamElementsJWT: () => {},
  platform: 'both',
  setPlatform: () => {},
});
