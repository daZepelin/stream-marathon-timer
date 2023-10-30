import { createContext } from "react";
import { Socket } from "socket.io-client";

export const StreamLabsWebSocketCtx = createContext<Socket | null>(null);

