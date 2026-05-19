import cors from "cors";
import express from "express";

const users = [
  { id: "u-100", name: "Ayesha Khan", email: "ayesha@example.com", role: "customer" },
  { id: "u-101", name: "Bilal Ahmed", email: "bilal@example.com", role: "admin" }
];

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ service: "user-service", status: "healthy" });
  });

  app.get("/users", (_req, res) => {
    res.json({ users });
  });

  app.post("/users", (req, res) => {
    const { name, email, role = "customer" } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }
    const user = { id: `u-${Date.now()}`, name, email, role };
    users.push(user);
    return res.status(201).json({ user });
  });

  app.post("/auth/login", (req, res) => {
    const { email } = req.body;
    const user = users.find((item) => item.email === email);
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    return res.json({
      token: Buffer.from(`${user.id}:${Date.now()}`).toString("base64url"),
      user
    });
  });

  app.get("/profile", (_req, res) => {
    res.json({ profile: users[0] });
  });

  return app;
}
