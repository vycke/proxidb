const getStore = function (db) {
  return function (name, type = "readwrite") {
    const set = () => true;

    const s = db.transaction(name, type).objectStore(name);
    // closes the connection after the transaction is completed
    db.close();

    function get(_, method) {
      return async function (...args) {
        return new Promise((resolve, reject) => {
          if (!s[method]) reject("Method not supported");

          const request = s[method](...args);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      };
    }

    return new Proxy({}, { get, set });
  };
};

export async function idb(name, version, upgrade) {
  return new Promise(function (resolve, reject) {
    const connection = indexedDB.open(name, version);
    connection.onupgradeneeded = upgrade;

    connection.onsuccess = (event) => {
      const db = connection.result;
      db.getStore = getStore(db);
      resolve(db);
    };
    // Return the errors
    connection.onerror = (event) => {
      reject(event.target.errorCode);
    };
  });
}
