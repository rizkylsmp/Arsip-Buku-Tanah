import fs from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("frontend", "dist");
const outputDirs = [
  path.resolve("public"),
  path.resolve("dist"),
];

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Build output not found: ${sourceDir}`);
}

for (const outputDir of outputDirs) {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.cpSync(sourceDir, outputDir, { recursive: true });

  console.log(`Synced ${sourceDir} to ${outputDir}`);
}
