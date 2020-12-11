import Head from "next/head";
import { Provider as PouchDBProvider } from "use-pouchdb";
import PouchDB from "pouchdb";
import pouchdbDebug from "pouchdb-debug";
import pouchdbFind from "pouchdb-find";

PouchDB.plugin(pouchdbDebug);
PouchDB.plugin(pouchdbFind);

PouchDB.debug.enable("*");

const db = (global.db = new PouchDB("todos"));

export default function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <PouchDBProvider pouchdb={db}>
        <Component {...pageProps} />
      </PouchDBProvider>
    </>
  );
}
