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

test("creates an order", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "u-100", productId: "p-200", quantity: 2 })
    });
    const body = await response.json();
    assert.equal(response.status, 201);
    assert.equal(body.order.status, "confirmed");
  });
});

test("returns order status", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/orders/o-300/status`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.status, "confirmed");
  });
});
