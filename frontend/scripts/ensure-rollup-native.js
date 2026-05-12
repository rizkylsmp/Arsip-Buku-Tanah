import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nativePackagesByPlatform = {
  "linux-x64": [
    ["@rollup/rollup-linux-x64-gnu", "4.52.4"],
    ["lightningcss-linux-x64-gnu", "1.30.1"],
  ],
  "linux-arm64": [
    ["@rollup/rollup-linux-arm64-gnu", "4.52.4"],
    ["lightningcss-linux-arm64-gnu", "1.30.1"],
  ],
};

const nativePackages = nativePackagesByPlatform[`${process.platform}-${process.arch}`] || [];

for (const [packageName, version] of nativePackages) {
  try {
    require.resolve(packageName);
  } catch {
    console.log(`Installing missing native optional dependency: ${packageName}`);
    execFileSync(
      "npm",
      ["install", `${packageName}@${version}`, "--no-save", "--no-audit", "--no-fund"],
      { stdio: "inherit" },
    );
  }
}
