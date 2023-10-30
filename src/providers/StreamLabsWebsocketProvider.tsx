import React, { createContext, useContext, useEffect, useState } from 'react';
import { connectStreamLabsSocket } from '../services/sockets/streamLabs';
import { Socket } from 'socket.io-client';
import { StreamLabsWebSocketCtx } from '../context/websockets';
import { AuthentificationCtx } from '../context/authentification';
import { RUNNING_IN_TAURI } from '../services/utils';

function StreamLabsWebsocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { streamLabsAuthKey} = useContext(AuthentificationCtx);

  useEffect(() => {
    if (!RUNNING_IN_TAURI) return;
    if (!streamLabsAuthKey) return;
    const ws = connectStreamLabsSocket({
      authKey: streamLabsAuthKey,
    });
    console.log('connectStreamLabsSocket', ws)

    if (ws) setSocket(ws);

    return () => {
      if (ws) ws.close();
    };
  }, [streamLabsAuthKey]);

  return <StreamLabsWebSocketCtx.Provider value={socket}>{children}</StreamLabsWebSocketCtx.Provider>;
}

export default StreamLabsWebsocketProvider;
