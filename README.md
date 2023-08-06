# Prox-idb

A `proxy` based wrapper around the IndexedDB API to facilitate simple `async` and `await` style coding practices.

```js
import { idb } from "proxidb";

function myUpgradeFunction() {}

async function doStuff() {
  const db = await idb("name", 1, myUpgradeFunction);
  const store = db.getStore("todos", "readwrite");
  await store.add({ id: "1", title: "test" });
  const res = await store.get("1");
}
```

## Notes

- After each transaction (e.g. `get`, `getAll`, `add`, `put`, `delete`) the connection is closed.
