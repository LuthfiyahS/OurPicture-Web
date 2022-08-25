import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../app/store";
import NextNProgress from "nextjs-progressbar";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => setShowChild(true), []);

  if (!showChild) return null;

  if (typeof window === "undefined") return <></>;
  else
    return <Provider store={store}>
      <NextNProgress
        color="#FB8500"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <ReactNotifications />
      <Component {...pageProps} />
    </Provider>
}

export default MyApp
