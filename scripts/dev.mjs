#!/usr/bin/env node
/**
 * Frees port 3000 if occupied, then starts Next.js (avoids EADDRINUSE).
 */
import { execSync, spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

try {
  execSync("npx kill-port 3000", { cwd: root, stdio: "inherit", env: process.env });
} catch {
  /* ignore — port may already be free */
}

const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev", "-p", "3000"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
