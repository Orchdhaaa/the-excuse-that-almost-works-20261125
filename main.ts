import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One line a gamer texts the boss to skip work on GTA 6 launch week.
// The excuse that almost works is boring, specific and self-owning:
// stuck at home for a gas engineer appointment window, having already
// missed the engineer twice. No wild story, no fever, no flat tyre,
// no dead grandmother, and no mention of the game: a real person
// texting in a hurry would never confess the launch in the excuse.
const EXCUSE =
  "Sorry, stuck waiting in for the gas engineer, he gave me 8 till 6 and I've missed him twice already.";

// The gate only accepts UTF-8 text of 1 to 140 characters that is not
// whitespace-only, and the brief caps the line at 20 words, so verify
// both before writing anything.
const chars = [...EXCUSE].length;
if (chars < 1 || chars > 140 || EXCUSE.trim().length === 0) {
  throw new Error(`excuse is ${chars} characters, outside the 1-140 gate`);
}

// The brief demands at most 20 words: a longer excuse sounds rehearsed,
// and a rehearsed one is already a confession, so count the words and
// refuse anything over the cap. An em dash would also break the hurried
// text-message rhythm the judge weighs, so refuse that too.
const words = EXCUSE.trim().split(/\s+/);
if (words.length > 20) {
  throw new Error(`excuse has ${words.length} words, over the 20-word cap`);
}
if (EXCUSE.includes("\u2014") || EXCUSE.includes("\u2013")) {
  throw new Error("excuse must not contain a dash");
}

// The brief demands one line of plain text sent in a hurry: a newline,
// a tab or a double space would read like a drafted note, not a text,
// so refuse any of them.
if (/[\n\r\t]/.test(EXCUSE) || EXCUSE.includes("  ")) {
  throw new Error("excuse must be a single line with single spaces only");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, EXCUSE, "utf8");

// Read the file back: refuse a write that did not land byte for byte.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== EXCUSE) {
  throw new Error("entry.txt does not match the excuse byte for byte");
}
