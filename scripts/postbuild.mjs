import { readdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const assetsDir = join(projectRoot, "dist", "client", "assets");
const outDir = join(projectRoot, "dist", "client");

if (!existsSync(assetsDir)) {
  console.log("Assets directory not found, skipping");
  process.exit(0);
}

const files = readdirSync(assetsDir);
const jsEntry = files.find(f => f.startsWith("index-") && f.endsWith(".js") && !f.includes("vendor"));
const cssFile = files.find(f => f.startsWith("index-") && f.endsWith(".css"));

if (!jsEntry) {
  console.log("No JS entry found, skipping");
  process.exit(0);
}

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
console.log("Generated index.html for Vercel static deployment");
