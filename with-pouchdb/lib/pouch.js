import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import PouchDB from "pouchdb";
import pouchdbAllDb from "pouchdb-all-dbs";

// PouchDB.plugin(pouchdbDebug);
PouchDB.plugin(pouchdbAllDb);
// PouchDB.debug.enable("*");

global.PouchDB = PouchDB;

const user = {
  username: "test-cv19@test.de",
  password: "123123",
};

function getCurrentDBName(name = "med-42-vaccination") {
  const dateObj = new Date();
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  return `${name}-${year}-${month}-${day}`;
}

function isDbNameFromToday(name) {
  return getCurrentDBName() === name;
}

async function replicate(dbName, options = {}) {
  const { username, password } = user;
  const target = `http://${encodeURIComponent(
    username
  )}:${password}@localhost:5984/${dbName}`;

  const result = PouchDB.replicate(dbName, target, options);

  result.on("complete", () => {
    console.log("Sync done!");
    console.log("@todo: delete", dbName);
    // db.destory()
  });

  return result;
}

const GetDbContext = createContext();

export function Provider({ children }) {
  // Todo: useKeyCloak
  useEffect(() => {
    // Sync all dbs
    PouchDB.allDbs().then(async (dbs) => {
      console.group("onMounted");

      for (const dbName of dbs) {
        replicate(dbName, {
          live: isDbNameFromToday(dbName),
          retry: true,
        });
      }

      console.groupEnd("onMounted");
    });
  }, []);

  const getDb = useCallback(async () => {
    const allDbs = await PouchDB.allDbs();
    const dbName = getCurrentDBName();

    // Create Db
    const db = new PouchDB(dbName);

    // See if we need to turn on sync
    if (!allDbs.includes(dbName)) {
      console.group("onDemand");
      replicate(dbName, {
        live: true,
        retry: true,
      });
      console.groupEnd("onDemand");
    }

    return db;
  }, []);

  return (
    <GetDbContext.Provider value={getDb}>{children}</GetDbContext.Provider>
  );
}

export function usePost() {
  const getDb = useContext(GetDbContext);
  const [error, setError] = useState();
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const post = async (...args) => {
    const db = await getDb();
    try {
      const result = await db.post(...args);
      setResult(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return [
    post,
    {
      error,
      loading,
      result,
    },
  ];
}
