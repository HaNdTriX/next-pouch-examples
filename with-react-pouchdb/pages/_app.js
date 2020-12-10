import { Suspense } from "react";
import { PouchDB as PouchDBProvider } from "react-pouchdb";
import PouchDB from "pouchdb";
import pouchdbDebug from "pouchdb-debug";

PouchDB.plugin(pouchdbDebug);
PouchDB.debug.enable("*");

export default function CustomApp({ Component, pageProps }) {
  return (
    <PouchDBProvider name="todos">
      <Suspense fallback="loading...">
        <Component {...pageProps} />
      </Suspense>
    </PouchDBProvider>
  );
}
