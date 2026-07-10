// =====================================================================
// store.js — the model. Owns progress state, localStorage persistence,
// the grading rules, and all derived statistics. No DOM in here.
// =====================================================================
import { CATS } from "./data.js";

const LS_KEY = "spellAgent.v1";

// Per-word "box" (Leitner): 0 new · 1 learning · 2 practicing · 3 mastered.
// Per-word stat: { a: attempts, c: corrects, ew: everWrong }.
function fresh() {
  return { box: {}, stat: {}, points: 0, star: 0, streak: 0, best: 0, attempts: 0, correct: 0 };
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY));
    return d ? Object.assign(fresh(), d) : fresh(); // merge over defaults (forward-compatible)
  } catch {
    return fresh();
  }
}

let DB = load();

function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(DB)); } catch { /* storage disabled */ }
}

export function box(id) { return DB.box[id] || 0; }
export function everWrong(id) { return !!(DB.stat[id] && DB.stat[id].ew); }
export function correctCount(id) { return DB.stat[id] ? DB.stat[id].c : 0; }

// Record one attempt and apply the box/points/streak rules.
// Returns { correct, gain, streak, box, newlyMastered } for the view to celebrate.
export function grade(id, correct) {
  const before = box(id);
  const st = DB.stat[id] || (DB.stat[id] = { a: 0, c: 0, ew: false });
  st.a++; DB.attempts++;

  let gain = 0, newlyMastered = false;
  if (correct) {
    st.c++; DB.correct++;
    DB.box[id] = Math.min(3, before + 1);
    DB.streak++; DB.best = Math.max(DB.best, DB.streak);
    gain = 8 + Math.min(12, DB.streak * 2);
    DB.points += gain;
    if (DB.box[id] === 3 && before < 3) { DB.star++; newlyMastered = true; }
  } else {
    st.ew = true;
    DB.box[id] = 1;   // send back to "learning"
    DB.streak = 0;
  }
  save();
  return { correct, gain, streak: DB.streak, box: DB.box[id], newlyMastered };
}

export function reset() { DB = fresh(); save(); }

// Header + progress-bar numbers.
export function stats(words) {
  let learn = 0, prac = 0, mast = 0;
  for (const w of words) {
    const b = box(w.id);
    if (b >= 3) mast++; else if (b === 2) prac++; else if (b === 1) learn++;
  }
  const distinctCorrect = Object.values(DB.stat).filter((s) => s.c > 0).length;
  const passRate = DB.attempts ? Math.round((DB.correct / DB.attempts) * 100) : 0;
  return {
    learn, prac, mast, total: words.length,
    level: 1 + Math.floor(DB.points / 120),
    streak: DB.streak, distinctCorrect, passRate,
    attempts: DB.attempts, correct: DB.correct,
  };
}

// Everything the summary panel needs, as plain data (no DOM).
export function summary(words) {
  const s = stats(words);
  const mastered = words.filter((w) => box(w.id) >= 3);
  const fixed = words.filter((w) => box(w.id) >= 3 && everWrong(w.id));
  const cats = Object.keys(CATS).map((k) => {
    const ws = words.filter((w) => w.cat === k);
    return {
      name: CATS[k].name, color: CATS[k].color, total: ws.length,
      mast: ws.filter((w) => box(w.id) >= 3).length,
      correct: ws.filter((w) => correctCount(w.id) > 0).length,
    };
  });
  return {
    passRate: s.passRate, distinctCorrect: s.distinctCorrect,
    attempts: s.attempts, correct: s.correct, total: s.total,
    mastered, fixed, cats,
  };
}
