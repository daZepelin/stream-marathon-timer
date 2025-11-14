import React from 'react';
import { LogsCtx } from '../context/logs';
import { useLocalStorage } from '@mantine/hooks';

let logsEnabled = false;

function LogsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useLocalStorage<boolean>({ key: 'logs-enabled', defaultValue: true });

  logsEnabled = enabled;

  return <LogsCtx.Provider value={{ enabled, setEnabled }}>{children}</LogsCtx.Provider>;
}

export function areLogsEnabled() {
  return logsEnabled;
}

export default LogsProvider;
