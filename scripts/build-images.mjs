import { spawnSync } from "node:child_process";

const username = process.env.DOCKERHUB_USERNAME || "your-dockerhub-username";
const tag = process.env.IMAGE_TAG || "1.0.0";
const images = [
  ["frontend", "frontend"],
  ["services/user", "user-service"],
  ["services/product", "product-service"],
  ["services/order", "order-service"],
  ["services/notification", "notification-service"]
];

for (const [context, name] of images) {
  const image = `${username}/cloud-final-${name}:${tag}`;
  console.log(`Building ${image} from ${context}`);
  const result = spawnSync("docker", ["build", "-t", image, context], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
