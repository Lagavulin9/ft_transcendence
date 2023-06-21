import type { AppProps } from "next/app";
import Head from "next/head";
import "./app.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { AppDispatch } from "@/redux/RootStore";
import Home from ".";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { connectSocket, emitEvent, onEvent, socket } from "@/utils/socket";
import { fetchGlobal } from "@/redux/Slice/Global";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    connectSocket();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Provider store={store}>
        <Head>
          <meta charSet="utf-8" />
          <title>감장과 아이들</title>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://user-images.githubusercontent.com/86397600/236520751-cbe5955c-0ec5-46d8-bc42-130ef3c62a1f.png"
          />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
