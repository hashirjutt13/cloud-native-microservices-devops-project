import cors from "cors";
import express from "express";

const orders = [
  { id: "o-300", userId: "u-100", productId: "p-200", quantity: 1, status: "confirmed" },
  { id: "o-301", userId: "u-101", productId: "p-202", quantity: 1, status: "processing" }
];

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ service: "order-service", status: "healthy" });
  });

  app.get("/orders", (_req, res) => {
    res.json({ orders });
  });

  app.get("/orders/:id", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) return res.status(404).json({ error: "order not found" });
    return res.json({ order });
  });

  app.get("/orders/:id/status", (req, res) => {
    const order = orders.find((item) => item.id === req.params.id);
    if (!order) return res.status(404).json({ error: "order not found" });
    return res.json({ id: order.id, status: order.status });
  });

  app.post("/orders", async (req, res) => {
    const { userId, productId, quantity = 1 } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }
    const order = { id: `o-${Date.now()}`, userId, productId, quantity, status: "confirmed" };
    orders.push(order);
    await notifyOrderCreated(order);
    return res.status(201).json({ order });
  });

  return app;
}

async function notifyOrderCreated(order) {
  const baseUrl = process.env.NOTIFICATION_SERVICE_URL;
  if (!baseUrl) return;
  try {
    await fetch(`${baseUrl.replace(/\/$/, "")}/notifications/order-confirmation`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(order)
    });
  } catch {
    // Notification failure should not fail order creation in this demo.
  }
}
