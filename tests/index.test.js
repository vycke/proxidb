import { expect, test, beforeEach } from "vitest";
import { idb } from "../src/index.js";

let db;
function upgrade(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("todos"))
    db.createObjectStore("todos", { keyPath: "id" });
}

beforeEach(async () => {
  db = await idb("test", 1, upgrade);
});

test("Setting up the database", async () => {
  expect(db.version).toBe(1);
});

test.fails("Undefined method", async () => {
  const store = db.getStore("todos", "readwrite");
  await expect(store.jabber()).rejects.toBe();
});

test("add & get", async () => {
  const store = db.getStore("todos", "readwrite");
  await store.add({ id: "1", name: "test" });
  const res1 = await store.get("1");
  expect(res1).toEqual({ id: "1", name: "test" });
  const res2 = await store.getAll();
  expect(res2.length).toBe(1);
});
