import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const roots = ["k8s/base", "k8s/environments", "k8s/advanced", "monitoring"];
const requiredKeys = ["apiVersion:", "kind:"];
let checked = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.name.endsWith(".yaml") && !entry.name.endsWith(".yml")) continue;
    const text = await readFile(path, "utf8");
    if (text.trim().length === 0) throw new Error(`${path} is empty`);
    if (path.includes("k8s") || path.includes("monitoring")) {
      for (const key of requiredKeys) {
        if (!text.includes(key)) throw new Error(`${path} is missing ${key}`);
      }
    }
    checked += 1;
  }
}

for (const root of roots) {
  await walk(root);
}

console.log(`Validated ${checked} YAML files for basic Kubernetes structure.`);
