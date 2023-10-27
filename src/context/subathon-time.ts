import { createContext } from 'react';

export interface ISubathonTimeCtx {
  subathonTime: number | null;
  setSubathonTime: (time: number) => void;
}

export const SubathonTimeCtx = createContext<ISubathonTimeCtx>({
  subathonTime: 0,
  setSubathonTime: () => {},
});

export interface ISubathonTimerStyleCtx {
  subathonTimerStyle: { [key: string]: string | number };
  setSubathonTimerStyle: (style: { [key: string]: string | number }) => void;
}

export const SubathonTimerStyleCtx = createContext<ISubathonTimerStyleCtx>({
  subathonTimerStyle: {},
  setSubathonTimerStyle: () => {},
});
