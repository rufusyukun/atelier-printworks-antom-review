import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, cleanPath === "/" ? "index.html" : cleanPath);

  if (!existsSync(file) || statSync(file).isDirectory()) {
    file = join(root, "index.html");
  }

  res.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
  createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`Atelier Printworks preview running at http://localhost:${port}`);
});
