import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { createApp } from "../src/app.js";

async function withServer(run) {
  const server = createServer(createApp());
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("lists products", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/products`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.ok(body.products.length >= 3);
  });
});

test("search filters products", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/products?search=laptop`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.products[0].id, "p-202");
  });
});
