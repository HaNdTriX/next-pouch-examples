import Head from "next/head";
import { Provider as PouchDBProvider } from "../lib/pouch";

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <PouchDBProvider>
        <Component {...pageProps} />
      </PouchDBProvider>
    </>
  );
}
