import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const cwd = process.cwd();
const nextBin = path.join(cwd, "node_modules", "next", "dist", "bin", "next");
const mode = process.argv[2];

if (!mode) {
  throw new Error("Missing Next mode. Use dev, build or start.");
}

function parseEnvFile(filePath) {
  const values = {};

  if (!existsSync(filePath)) {
    return values;
  }

  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

const fileEnv = {
  ...parseEnvFile(path.join(cwd, ".env")),
  ...parseEnvFile(path.join(cwd, ".env.local")),
};

const childEnv = {
  ...fileEnv,
  ...process.env,
};

const nextArgs = [nextBin, mode];

if ((mode === "dev" || mode === "start") && childEnv.PORT?.trim()) {
  nextArgs.push("--port", childEnv.PORT.trim());
}

const child = spawn(process.execPath, nextArgs, {
  cwd,
  env: childEnv,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
