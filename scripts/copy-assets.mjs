import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const copies = [
  ["assets/foods_zh.json", "dist/assets/foods_zh.json"],
  ["templates/modern-v1.html", "dist/templates/modern-v1.html"],
  ["SKILL.md", "dist/SKILL.md"]
];

for (const [from, to] of copies) {
  const source = join(root, from);
  const target = join(root, to);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}
