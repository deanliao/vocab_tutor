// =====================================================================
// wordbank.js — loads the graded 2000-word bank and merges in the
// curated "featured" data. Produces the master WORDS array the app uses.
// =====================================================================
import { FEATURED } from "./data.js";

// Build a boolean trap-mask from a list of indices.
function maskFromTrap(len, trap) {
  const m = new Array(len).fill(false);
  for (const i of trap) if (i >= 0 && i < len) m[i] = true;
  return m;
}

// A word object:
//   { id, word (lowercase, for input/compare), display (proper case, for reveal),
//     level (1-5), mask[], featured, zh?, sent?, cat? }
export async function loadWordBank() {
  const res = await fetch("data/words2000.json");
  if (!res.ok) throw new Error("Could not load data/words2000.json (" + res.status + ")");
  const raw = await res.json(); // [{ w: displayWord, t: trapIndices, lv: level }]

  return raw.map((entry, i) => {
    const display = entry.w;
    const word = display.toLowerCase();
    const feat = FEATURED.get(word); // hand-verified data, if this word is featured
    return {
      id: "w" + i,
      word,
      display,
      level: entry.lv,
      mask: feat ? feat.mask : maskFromTrap(word.length, entry.t),
      featured: !!feat,
      zh: feat ? feat.zh : null,
      sent: feat ? feat.sent : null,
      cat: feat ? feat.cat : null,
    };
  });
}

export const wordsAtLevel = (words, level) => words.filter((w) => w.level === level);
