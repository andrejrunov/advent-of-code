import { readFileSync as nodeReadFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export function readFileSync(base: string, name: string) {
  const __filename = fileURLToPath(base);
  const __dirname = dirname(__filename);

  return nodeReadFileSync(resolve(__dirname, name)).toString();
}
