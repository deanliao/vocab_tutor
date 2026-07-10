// =====================================================================
// app.js — the controller. Holds the small bit of session state and
// wires the model (store), the picker (srs), and the view (ui) together.
// This is the entry point loaded by index.html.
// =====================================================================
import { WORDS } from "./data.js";
import * as store from "./store.js";
import { nextWord } from "./srs.js";
import * as ui from "./ui.js";
import { burst } from "./confetti.js";

const state = {
  cat: "all",       // selected category ("all" or A–F)
  mode: "listen",   // practice mode
  word: null,       // current word object
  answered: false,  // has the current word been graded yet?
  round: null,      // { getGuess, applyTypedResult } from the current render
};

function refreshProgress() {
  ui.renderProgress(store.stats(WORDS));
  if (!ui.summaryHidden()) ui.renderSummary(store.summary(WORDS));
}

function renderCurrent() {
  state.round = ui.renderRound(state.word, state.mode, { onAnswer: answer, onCheck: check });
}

function newRound() {
  state.word = nextWord(WORDS, state.cat, state.word?.id);
  state.answered = false;
  renderCurrent();
}

// The check button / Enter key: grade a typed answer, or advance if already answered.
function check() {
  if (state.answered) { newRound(); return; }
  if (state.word.cat === "E") return; // homophones grade on option click
  const guess = state.round.getGuess();
  if (!guess) { ui.note("先拼拼看再檢查喔 ✏️"); return; }
  const correct = guess === state.word.word;
  state.round.applyTypedResult(correct);
  answer(correct);
}

// Single grading path for every mode (typed answers and homophone clicks).
function answer(correct) {
  if (state.answered) return;
  state.answered = true;
  const info = store.grade(state.word.id, correct);
  ui.showResult(correct, state.word, info);
  if (correct) burst();
  refreshProgress();
  ui.setActionNext();
}

// ---- wiring ----
ui.initChips(state.cat, (cat) => { state.cat = cat; newRound(); });
ui.initModes(state.mode, (mode) => { state.mode = mode; state.answered = false; renderCurrent(); });
ui.onCheckClick(check);
ui.onPeek(() => { if (state.word) ui.peek(state.word); });
ui.onReset(() => {
  if (confirm("確定要清除所有進度、星星和點數嗎？")) { store.reset(); refreshProgress(); newRound(); }
});
ui.onSummary(() => ui.toggleSummary(store.summary(WORDS)));

refreshProgress();
newRound();
