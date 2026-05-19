import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
assert.match(html, /Cloud Commerce DevOps Dashboard/);
assert.match(html, /assets\/app\.js/);

const app = await readFile(new URL("../assets/app.js", import.meta.url), "utf8");
for (const label of ["User Service", "Product Service", "Order Service", "Notification Service"]) {
  assert.match(app, new RegExp(label));
}

console.log("Frontend smoke test passed.");
