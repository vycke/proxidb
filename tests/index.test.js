import { expect, test, beforeEach, afterEach } from "vitest";
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

afterEach(() => {
  db.close();
});

test("Setting up the database", async () => {
  expect(db.version).toBe(1);
});

test("Undefined method", async () => {
  const store = db.todos;
  await expect(store.jabber()).rejects.toBe("Method not supported");
});

test("transactions", async () => {
  await db.todos.add({ id: "1", name: "test" });
  const res1 = await db.todos.get("1");
  expect(res1).toEqual({ id: "1", name: "test" });
  const res2 = await db.todos.getAll();
  expect(res2.length).toBe(1);
});
