import cors from "cors";
import express from "express";

const products = [
  { id: "p-200", name: "Wireless Keyboard", category: "accessories", price: 45, inventory: 28 },
  { id: "p-201", name: "USB-C Dock", category: "accessories", price: 89, inventory: 14 },
  { id: "p-202", name: "Developer Laptop", category: "computers", price: 1199, inventory: 6 },
  { id: "p-203", name: "Gaming Mouse", category: "accessories", price: 35, inventory: 20 }
];

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ service: "product-service", status: "healthy" });
  });

  app.get("/products", (req, res) => {
    const search = String(req.query.search || "").toLowerCase();
    const filtered = search
      ? products.filter((product) => product.name.toLowerCase().includes(search) || product.category.includes(search))
      : products;
    res.json({ products: filtered });
  });

  app.get("/products/:id", (req, res) => {
    const product = products.find((item) => item.id === req.params.id);
    if (!product) return res.status(404).json({ error: "product not found" });
    return res.json({ product });
  });

  app.post("/products", (req, res) => {
    const { name, category, price, inventory = 0 } = req.body;
    if (!name || !category || typeof price !== "number") {
      return res.status(400).json({ error: "name, category, and numeric price are required" });
    }
    const product = { id: `p-${Date.now()}`, name, category, price, inventory };
    products.push(product);
    return res.status(201).json({ product });
  });

  return app;
}
