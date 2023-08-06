# Prox-idb

A `proxy` based wrapper around the IndexedDB API to facilitate simple `async` and `await` style coding practices.

**NOTE**: This is a very limited package for basic usage. If you want more control, I suggest use [idb](https://github.com/jakearchibald/idb).

```js
import { idb } from "proxidb";

// Create a "todos" store
function myUpgradeFunction(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("todos"))
    db.createObjectStore("todos", { keyPath: "id" });
}

async function doStuff() {
  // open a connection
  const db = await idb("name", 1, myUpgradeFunction);
  // do one or more transactions
  await db.todos.add({ id: "1", title: "test" });
  const result = await db.todos.get("1");
  // Close the connection
  db.close();
}
```

## Notes

- Default mode for transactions is `readwrite`. There is currently no way to change this.
- Requires closing of the connection. Otherwise a vast number of connections will remain open.
