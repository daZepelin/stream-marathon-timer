import { createContext } from 'react';
import { ISpecialMultiplier, ISubathonTimerConfig } from '../types/config';

export interface ISubathonTimeCtx {
  subathonTime: number | null;
  setSubathonTime: (time: number) => void;
  timerActive: boolean;
  setTimerActive: (active: boolean) => void;
}

export const SubathonTimeCtx = createContext<ISubathonTimeCtx>({
  subathonTime: 0,
  setSubathonTime: () => {},
  timerActive: false,
  setTimerActive: () => {},
});

export interface ISubathonTimerConfigCtx {
  subathonTimerStyle: { [key: string]: string | number };
  setSubathonTimerStyle: (style: { [key: string]: string | number }) => void;
  subathonTimerMultiplierData: ISubathonTimerConfig;
  setSubathonTimerMultiplierData: (data: ISubathonTimerConfig) => void;
  specialMultiplier: ISpecialMultiplier;
  setSpecialMultiplier: (data: ISpecialMultiplier) => void;
}

export const SubathonTimerConfigCtx = createContext<ISubathonTimerConfigCtx>({
  subathonTimerStyle: {},
  setSubathonTimerStyle: () => {},
  subathonTimerMultiplierData: { minutes: 1, amount: 1 },
  setSubathonTimerMultiplierData: () => {},
  specialMultiplier: { word: [], multiplier: 0.5, active: false },
  setSpecialMultiplier: () => {},
});
