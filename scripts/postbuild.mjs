import { readdirSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Add package.json to dist/server for ES module support
const serverDir = join(projectRoot, "dist", "server");
if (existsSync(serverDir)) {
  writeFileSync(
    join(serverDir, "package.json"),
    JSON.stringify({ type: "module" }, null, 2),
  );
  console.log("Added package.json to dist/server");
}

// Generate index.html in dist/client for SPA fallback
const assetsDir = join(projectRoot, "dist", "client", "assets");
const outDir = join(projectRoot, "dist", "client");

if (!existsSync(assetsDir)) {
  console.log("Assets directory not found, skipping SPA fallback HTML");
  process.exit(0);
}

const files = readdirSync(assetsDir);
const jsEntry = files.find(f => f.startsWith("index-") && f.endsWith(".js") && !f.includes("vendor"));
const cssFile = files.find(f => f.startsWith("index-") && f.endsWith(".css"));

if (jsEntry) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AlitapWatt</title>
  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  <script type="module" crossorigin src="/assets/${jsEntry}"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

  writeFileSync(join(outDir, "index.html"), html);
  console.log("Generated index.html for Vercel SPA fallback");
}
