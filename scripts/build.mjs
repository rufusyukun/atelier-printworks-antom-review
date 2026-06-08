import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (!existsSync(join(root, "index.html"))) {
  throw new Error("index.html is missing");
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
copyFileSync(join(root, "index.html"), join(dist, "index.html"));
cpSync(join(root, "src"), join(dist, "src"), { recursive: true });
for (const asset of ["favicon.svg", "robots.txt", "sitemap.xml"]) {
  if (existsSync(join(root, asset))) {
    copyFileSync(join(root, asset), join(dist, asset));
  }
}

const required = ["src/main.js", "src/styles.css"].map(file => join(root, file));
for (const file of required) {
  if (!existsSync(file) || statSync(file).size === 0) {
    throw new Error(`${file} is missing or empty`);
  }
}

console.log("Build complete: dist/");
