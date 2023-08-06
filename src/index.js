function dbGetHandler(db, key) {
  // first tries to get the store. if store does not exist
  // for key, invoke the normal db[key]
  try {
    const store = db.transaction(key, "readwrite").objectStore(key);

    function get(_, method) {
      return async function (...args) {
        return new Promise((resolve, reject) => {
          if (!store[method]) reject("Method not supported");
          const request = store[method](...args);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      };
    }

    return new Proxy({}, { get });
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
    // Return the errors
    connection.onerror = (event) => {
      reject(event.target.errorCode);
    };
  });
}
