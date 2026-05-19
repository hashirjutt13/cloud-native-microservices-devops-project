import cors from "cors";
import express from "express";

const notifications = [
  { id: "n-400", type: "order-confirmation", target: "u-100", message: "Order o-300 confirmed" },
  { id: "n-401", type: "inventory-alert", target: "ops", message: "Developer Laptop inventory below threshold" },
  { id: "n-402", type: "system-alert", target: "ops", message: "Deployment pipeline verified by Abdul Hadi" }
];

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ service: "notification-service", status: "healthy" });
  });

  app.get("/notifications", (_req, res) => {
    res.json({ notifications });
  });

  app.post("/notifications/order-confirmation", (req, res) => {
    const { id, userId } = req.body;
    if (!id || !userId) {
      return res.status(400).json({ error: "id and userId are required" });
    }
    const notification = {
      id: `n-${Date.now()}`,
      type: "order-confirmation",
      target: userId,
      message: `Order ${id} confirmed`
    };
    notifications.push(notification);
    return res.status(201).json({ notification });
  });

  return app;
}
