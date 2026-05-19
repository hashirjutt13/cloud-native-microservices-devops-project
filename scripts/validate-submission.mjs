import { access, readFile } from "node:fs/promises";

const requiredPaths = [
  "README.md",
  "Jenkinsfile",
  "docker-compose.yml",
  ".github/workflows/ci.yml",
  ".github/workflows/docker-publish.yml",
  ".github/workflows/render-deploy.yml",
  "frontend/Dockerfile",
  "services/user/Dockerfile",
  "services/product/Dockerfile",
  "services/order/Dockerfile",
  "services/notification/Dockerfile",
  "k8s/base/frontend-deployment.yaml",
  "k8s/base/user-deployment.yaml",
  "k8s/base/product-deployment.yaml",
  "k8s/base/order-deployment.yaml",
  "k8s/base/notification-deployment.yaml"
];

for (const path of requiredPaths) {
  await access(path);
}

const readme = await readFile("README.md", "utf8");
for (const section of ["Git Flow", "CI/CD", "Docker", "Kubernetes", "Screenshots"]) {
  if (!readme.includes(section)) throw new Error(`README.md is missing ${section}`);
}

console.log("Submission structure looks complete.");
