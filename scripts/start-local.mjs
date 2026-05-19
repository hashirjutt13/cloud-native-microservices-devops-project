import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";

const processes = [
  ["user-service", "npm", ["start", "--workspace", "@cloud-final/user-service"], { PORT: "3001" }],
  ["product-service", "npm", ["start", "--workspace", "@cloud-final/product-service"], { PORT: "3002" }],
  ["notification-service", "npm", ["start", "--workspace", "@cloud-final/notification-service"], { PORT: "3004" }],
  ["order-service", "npm", ["start", "--workspace", "@cloud-final/order-service"], {
    PORT: "3003",
    NOTIFICATION_SERVICE_URL: "http://localhost:3004"
  }]
];

const children = processes.map(([name, command, args, env]) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    env: { ...process.env, ...env }
  });
  child.on("exit", (code) => {
    if (code) console.error(`${name} exited with code ${code}`);
  });
  return child;
});

const root = resolve("frontend");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json"
};

const server = createServer((req, res) => {
  const requested = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const path = join(root, requested);
  const file = existsSync(path) ? path : join(root, "index.html");
  res.setHeader("content-type", mime[extname(file)] || "application/octet-stream");
  createReadStream(file).pipe(res);
});

server.listen(8080, () => {
  console.log("frontend listening on http://localhost:8080");
});

function shutdown() {
  server.close();
  for (const child of children) child.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
