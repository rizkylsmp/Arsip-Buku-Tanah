import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nativePackages = {
  "linux-x64": "@rollup/rollup-linux-x64-gnu",
  "linux-arm64": "@rollup/rollup-linux-arm64-gnu",
};

const packageName = nativePackages[`${process.platform}-${process.arch}`];

if (packageName) {
  try {
    require.resolve(packageName);
  } catch {
    console.log(`Installing missing Rollup optional dependency: ${packageName}`);
    execFileSync(
      "npm",
      ["install", "--include=optional", "--no-audit", "--no-fund"],
      { stdio: "inherit" },
    );
  }
}
