// returns a promise wrapper around the IndexedDB store code through a proxy
function storeGetHandler(store, method) {
  return async function (...args) {
    return new Promise((resolve, reject) => {
      if (!store[method]) reject("Method not supported");
      const request = store[method](...args);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
}

// a proxy wrapper that allows direct access to 'stores' or functions of an
// opened database connection
function dbGetHandler(db, key) {
  // first tries to get the store. if store does not exist
  // for key, invoke the normal db[key]
  try {
    const store = db.transaction(key, "readwrite").objectStore(key);
    return new Proxy(store, { get: storeGetHandler });
  } catch (e) {
    return db[key];
  }
}

export async function idb(name, version, upgrade) {
  return new Promise(function (resolve, reject) {
    const connection = indexedDB.open(name, version);
    connection.onupgradeneeded = upgrade;

    connection.onsuccess = (event) => {
      const db = connection.result;
      resolve(new Proxy(db, { get: dbGetHandler }));
    };

    connection.onerror = (event) => reject(event.target.errorCode);
  });
}
