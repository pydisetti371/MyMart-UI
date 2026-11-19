import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const viteCli = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");
const apps = [
  { name: "host", cwd: rootDir },
  { name: "billing", cwd: path.join(rootDir, "apps", "billing") },
  { name: "products", cwd: path.join(rootDir, "apps", "products") },
  { name: "reports", cwd: path.join(rootDir, "apps", "reports") },
];

const servers = [];
let shuttingDown = false;

function stopServers(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const server of servers) {
    if (server.exitCode === null) server.kill("SIGTERM");
  }

  process.exitCode = exitCode;
}

for (const app of apps) {
  const server = spawn(process.execPath, [viteCli], {
    cwd: app.cwd,
    stdio: "inherit",
    windowsHide: true,
  });

  servers.push(server);

  server.on("error", (error) => {
    process.stderr.write(`Failed to start ${app.name}: ${error.message}\n`);
    stopServers(1);
  });

  server.on("exit", (code, signal) => {
    if (!shuttingDown) {
      const exitCode = code ?? (signal ? 1 : 0);
      stopServers(exitCode);
    }
  });
}

process.on("SIGINT", () => stopServers(0));
process.on("SIGTERM", () => stopServers(0));
