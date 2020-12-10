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
    <PouchDBProvider pouchdb={db}>
      <Component {...pageProps} />
    </PouchDBProvider>
  );
}
