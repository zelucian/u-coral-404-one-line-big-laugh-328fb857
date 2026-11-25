import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "I asked AI to write my resignation letter; it quit first.";

function assertValidLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  // Guard: reject any control character so the output stays clean text.
  for (const ch of line) {
    const code = ch.charCodeAt(0);
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) {
      throw new Error(`line contains control character U+${code.toString(16).padStart(4, "0")}`);
    }
  }
  if (line !== line.trim()) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
}

assertValidLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back verification: catch partial or corrupted writes.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: entry.txt content differs from LINE");
}
