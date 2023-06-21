import { io } from "socket.io-client";

const createSocket = () => {
  return io("http://localhost:8080", {
    autoConnect: false,
    withCredentials: true,
  });
};

export const socket = createSocket();

export const connectSocket = () => {
  socket.connect();
};

export const onEvent = <T>(event: string, cb: (data: T) => void) => {
  return socket.on(event, cb);
};

export const emitEvent = <T, U>(event: string, data?: T) => {
  socket.emit(event, data);
};

export const onError = <T>(event: string, cd: (data: T) => void) => {
  return socket.on(event, cd);
};

export const offEvent = (event: string) => {
  return socket.off(event);
};

export const disconnectSocket = () => {
  return socket.disconnect();
};
