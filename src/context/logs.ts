import { createContext } from 'react';
export interface ILogsCtx {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const LogsCtx = createContext<ILogsCtx>({
  enabled: false,
  setEnabled: () => {},
});
