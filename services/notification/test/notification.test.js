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

test("lists notifications", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/notifications`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.ok(body.notifications.length >= 2);
  });
});

test("creates order confirmation notification", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/notifications/order-confirmation`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: "o-777", userId: "u-100" })
    });
    const body = await response.json();
    assert.equal(response.status, 201);
    assert.equal(body.notification.type, "order-confirmation");
  });
});
