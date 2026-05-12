import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("frontend", "dist");
const outputDir = path.resolve("public");

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Build output not found: ${sourceDir}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.cpSync(sourceDir, outputDir, { recursive: true });

console.log(`Synced ${sourceDir} to ${outputDir}`);
