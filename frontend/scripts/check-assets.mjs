import { readFile } from "node:fs/promises";

const files = ["index.html", "assets/app.js", "assets/styles.css", "assets/env.js"];

for (const file of files) {
  const text = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
  if (!text.trim()) throw new Error(`${file} is empty`);
}

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
for (const route of ["dashboard", "users", "products", "orders", "notifications"]) {
  if (!html.includes(`#${route}`)) throw new Error(`Missing route link for ${route}`);
}

console.log("Frontend assets passed basic validation.");
