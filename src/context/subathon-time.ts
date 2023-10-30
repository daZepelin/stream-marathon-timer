import { createContext } from 'react';

export interface ISubathonTimeCtx {
  subathonTime: number | null;
  setSubathonTime: (time: number) => void;
}

export const SubathonTimeCtx = createContext<ISubathonTimeCtx>({
  subathonTime: 0,
  setSubathonTime: () => {},
});

export interface ISubathonTimerConfigCtx {
  subathonTimerStyle: { [key: string]: string | number };
  setSubathonTimerStyle: (style: { [key: string]: string | number }) => void;
  subathonTimerMultiplierData: { minutes: number; amount: number };
  setSubathonTimerMultiplierData: (data: { minutes: number; amount: number }) => void;
}

export const SubathonTimerConfigCtx = createContext<ISubathonTimerConfigCtx>({
  subathonTimerStyle: {},
  setSubathonTimerStyle: () => {},
  subathonTimerMultiplierData: { minutes: 1, amount: 1 },
  setSubathonTimerMultiplierData: () => {},
});
