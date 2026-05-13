import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Add package.json to dist/server for ES module support (Vercel needs this)
const serverDir = join(projectRoot, "dist", "server");
if (existsSync(serverDir)) {
  writeFileSync(
    join(serverDir, "package.json"),
    JSON.stringify({ type: "module" }, null, 2),
  );
  console.log("Added package.json to dist/server for ES module support");
}
