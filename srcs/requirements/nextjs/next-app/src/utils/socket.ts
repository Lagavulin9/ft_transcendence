import { io } from "socket.io-client";

const createSocket = () => {
  return io("http://localhost:8080", {
    autoConnect: false,
  });
};

export const socket = createSocket();

export const connectSocket = () => {
  socket.connect();
};

export const onEvent = <T>(event: string, cb: (data: T) => void) => {
  return socket.on(event, cb);
};

export const emitEvent = <T, U>(
  event: string,
  data?: T,
  callback?: (response: U) => void
) => {
  if (callback) {
    socket.emit(event, data, callback);
  } else {
    socket.emit(event, data);
  }
};

export const offEvent = (event: string) => {
  return socket.off(event);
};

export const disconnectSocket = () => {
  return socket.disconnect();
};
