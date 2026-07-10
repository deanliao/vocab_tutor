// =====================================================================
// ui.js — the view. Everything that touches the DOM lives here.
// It renders from plain data and reports user intent through callbacks;
// it never reaches into the store or the app state directly.
// =====================================================================
import { CATS } from "./data.js";
import { say, spellOut } from "./audio.js";

const $ = (s) => document.querySelector(s);
const el = {
  cats: $("#cats"), modes: $("#modes"), stage: $("#stage"), fb: $("#feedback"),
  catlabel: $("#catlabel"), modehint: $("#modehint"), zh: $("#zh"), sent: $("#sent"),
  peekBtn: $("#peekBtn"), checkBtn: $("#checkBtn"), summary: $("#summary"), card: $("#card"),
};

const MODES = [
  ["listen", "🎧", "聽與拼"], ["trap", "🖍️", "填陷阱"],
  ["scramble", "🧩", "重組"], ["peekmode", "👀", "看一眼"],
];
const MHINT = {
  listen: "聽發音，把單字拼出來", trap: "只要填出螢光色的陷阱字母",
  scramble: "把打散的字母排回正確順序", peekmode: "看一眼，蓋起來，再憑記憶拼出",
  homo: "看句子，選出正確的字",
};
const CHEERS = ["太棒了！", "完全正確！", "你好厲害！", "拼對了！", "答對啦！", "進步好多！"];

// Build the word with trap letters wrapped in a highlight span.
function revealHtml(word) {
  return word.word.split("").map((ch, i) => (word.mask[i] ? `<span class="hl">${ch}</span>` : ch)).join("");
}

function pulse(cls) {
  el.card.classList.remove("pop", "shake");
  void el.card.offsetWidth; // restart the animation
  el.card.classList.add(cls);
}

// ---------- navigation (built once) ----------
export function initChips(cat, onPick) {
  const items = [["all", "全部"], ...Object.keys(CATS).map((k) => [k, CATS[k].name])];
  el.cats.innerHTML = items
    .map(([k, label]) => {
      const dot = k === "all" ? "" : `<span class="dot" style="background:${CATS[k].color}"></span>`;
      return `<button class="chip" data-c="${k}" aria-pressed="${k === cat}">${dot}${label}</button>`;
    })
    .join("");
  el.cats.querySelectorAll(".chip").forEach((b) =>
    (b.onclick = () => {
      el.cats.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x.dataset.c === b.dataset.c));
      onPick(b.dataset.c);
    }));
}

export function initModes(mode, onPick) {
  el.modes.innerHTML = MODES
    .map(([k, ic, t]) =>
      `<button class="mode" role="tab" data-m="${k}" aria-pressed="${k === mode}"><span class="ic">${ic}</span>${t}</button>`)
    .join("");
  el.modes.querySelectorAll(".mode").forEach((b) =>
    (b.onclick = () => {
      el.modes.querySelectorAll(".mode").forEach((x) => x.setAttribute("aria-pressed", x.dataset.m === b.dataset.m));
      onPick(b.dataset.m);
    }));
}

// ---------- one practice round ----------
// Returns { getGuess, applyTypedResult } for typed modes (null for homophones).
export function renderRound(word, mode, { onAnswer, onCheck }) {
  const effective = word.cat === "E" ? "homo" : mode;

  el.fb.textContent = "";
  el.fb.className = "feedback";
  el.peekBtn.style.display = effective === "homo" ? "none" : "";
  el.checkBtn.style.display = "";
  el.checkBtn.disabled = false;
  el.checkBtn.textContent = "檢查 Check";
  el.checkBtn.className = "btn primary";

  el.catlabel.textContent = CATS[word.cat].name;
  el.catlabel.style.background = CATS[word.cat].color;
  el.modehint.textContent = MHINT[effective];
  el.zh.innerHTML = `意思：<b>${word.zh}</b>`;

  if (effective !== "homo") {
    const masked = word.sent.replace(new RegExp("\\b" + word.word + "\\b", "i"), "<u>?????</u>");
    el.sent.innerHTML = effective === "peekmode" ? "" : masked;
  }

  if (effective === "homo") return renderHomo(word, onAnswer);
  if (effective === "trap") return renderTrap(word, onCheck);
  if (effective === "scramble") return renderScramble(word, onCheck);
  return renderListen(word, effective === "peekmode", onCheck);
}

function textInput(placeholder, onCheck) {
  const inp = document.createElement("input");
  inp.className = "spellbox";
  inp.autocapitalize = "none"; inp.autocomplete = "off"; inp.autocorrect = "off"; inp.spellcheck = false;
  inp.placeholder = placeholder;
  inp.onkeydown = (e) => { if (e.key === "Enter") onCheck(); };
  return inp;
}

function miniBtn(label, onClick) {
  const b = document.createElement("button");
  b.className = "mini"; b.textContent = label; b.onclick = onClick;
  return b;
}

function renderListen(word, peekMode, onCheck) {
  el.stage.innerHTML = "";
  const inp = textInput("在這裡拼字…", onCheck);

  if (peekMode) {
    const peek = document.createElement("div");
    peek.className = "reveal pop";
    peek.textContent = word.word;
    el.stage.append(peek, inp);
    say(word.word);
    setTimeout(() => {
      if (peek.isConnected) {
        peek.textContent = "🙈 蓋起來了，拼拼看！";
        peek.style.fontSize = "20px";
        peek.style.color = "var(--ink3)";
      }
    }, 1800);
  } else {
    const btn = document.createElement("button");
    btn.className = "listen-btn";
    btn.setAttribute("aria-label", "播放發音");
    btn.innerHTML = "🔊";
    btn.onclick = () => say(word.word);
    const row = document.createElement("div");
    row.className = "mini-row";
    row.append(
      miniBtn("🐢 一個字母一個字母", () => spellOut(word.word)),
      miniBtn("💬 唸例句", () => say(word.sent, 0.85)),
    );
    el.stage.append(btn, row, inp);
    say(word.word);
  }
  setTimeout(() => inp.focus(), 50);

  return {
    getGuess: () => inp.value.trim().toLowerCase(),
    applyTypedResult: (correct) => { inp.classList.add(correct ? "ok" : "bad"); inp.disabled = true; },
  };
}

function renderTrap(word, onCheck) {
  el.stage.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "tiles";

  word.word.split("").forEach((ch, i) => {
    const t = document.createElement("div");
    if (word.mask[i]) {
      t.className = "tile blank";
      const inp = document.createElement("input");
      inp.maxLength = 1; inp.dataset.i = i;
      inp.autocapitalize = "none"; inp.autocomplete = "off"; inp.spellcheck = false;
      inp.oninput = () => {
        const ins = [...wrap.querySelectorAll("input")];
        const cu = ins.indexOf(inp);
        if (inp.value && cu < ins.length - 1) ins[cu + 1].focus();
      };
      inp.onkeydown = (e) => {
        if (e.key === "Enter") onCheck();
        if (e.key === "Backspace" && !inp.value) {
          const ins = [...wrap.querySelectorAll("input")];
          const cu = ins.indexOf(inp);
          if (cu > 0) ins[cu - 1].focus();
        }
      };
      t.append(inp);
    } else {
      t.className = "tile";
      t.textContent = ch;
    }
    wrap.append(t);
  });

  el.stage.append(wrap, miniBtn("🔊 聽發音", () => say(word.word)));
  say(word.word);
  setTimeout(() => { const f = wrap.querySelector("input"); if (f) f.focus(); }, 50);

  return {
    getGuess: () => {
      const full = word.word.split("");
      wrap.querySelectorAll("input").forEach((inp) => { full[+inp.dataset.i] = (inp.value || " ").toLowerCase(); });
      return full.join("");
    },
    applyTypedResult: () => {
      wrap.querySelectorAll(".tile.blank").forEach((t) => {
        const inp = t.querySelector("input");
        const ok = (inp.value || "").toLowerCase() === word.word[+inp.dataset.i];
        t.classList.add(ok ? "ok" : "bad");
        inp.disabled = true;
      });
    },
  };
}

function renderScramble(word, onCheck) {
  el.stage.innerHTML = "";
  const letters = word.word.split("");
  let shuffled;
  do { shuffled = [...letters].sort(() => Math.random() - 0.5); }
  while (shuffled.join("") === word.word && word.word.length > 1);

  const scr = document.createElement("div");
  scr.className = "tiles";
  shuffled.forEach((ch) => {
    const t = document.createElement("div");
    t.className = "tile";
    t.style.background = "#EEF6FF";
    t.style.borderColor = "#CBE4FA";
    t.textContent = ch;
    scr.append(t);
  });

  const inp = textInput("排出正確的字…", onCheck);
  el.stage.append(scr, inp, miniBtn("🔊 聽發音", () => say(word.word)));
  setTimeout(() => inp.focus(), 50);

  return {
    getGuess: () => inp.value.trim().toLowerCase(),
    applyTypedResult: (correct) => { inp.classList.add(correct ? "ok" : "bad"); inp.disabled = true; },
  };
}

function renderHomo(word, onAnswer) {
  el.stage.innerHTML = "";
  el.sent.innerHTML = word.sent.replace("___", "<u>_____</u>");

  const opts = document.createElement("div");
  opts.className = "opts";
  let done = false;
  [...word.homo].sort(() => Math.random() - 0.5).forEach((choice) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = choice;
    b.onclick = () => {
      if (done) return;
      done = true;
      const correct = choice === word.word;
      b.classList.add(correct ? "ok" : "bad");
      if (!correct) {
        opts.querySelectorAll(".opt").forEach((o) => { if (o.textContent === word.word) o.classList.add("ok"); });
      }
      onAnswer(correct);
    };
    opts.append(b);
  });

  el.stage.append(opts, miniBtn("🔊 唸句子", () => say(word.sent.replace("___", word.word), 0.85)));
  el.checkBtn.style.display = "none";
  return { getGuess: null, applyTypedResult: null };
}

// ---------- feedback & actions ----------
export function note(msg) { el.fb.textContent = msg; }

export function showResult(correct, word, info) {
  if (correct) {
    el.fb.className = "feedback ok";
    el.fb.textContent = `✅ ${CHEERS[Math.floor(Math.random() * CHEERS.length)]}  +${info.gain}`;
    pulse("pop");
    say(word.word);
  } else {
    el.fb.className = "feedback bad";
    el.fb.innerHTML = `❌ 再看一次！ 正確拼法：<span class="reveal" style="display:inline">${revealHtml(word)}</span>`;
    pulse("shake");
    spellOut(word.word);
  }
}

export function setActionNext() {
  el.checkBtn.style.display = "";
  el.checkBtn.disabled = false;
  el.checkBtn.textContent = "下一個 Next →";
  el.checkBtn.className = "btn go";
}

export function peek(word) {
  say(word.word);
  el.fb.className = "feedback";
  el.fb.innerHTML = `<span class="reveal" style="display:inline;font-size:26px">🔍 ${revealHtml(word)}</span>`;
}

// ---------- progress & summary ----------
export function renderProgress(s) {
  $("#s-lv").textContent = s.level;
  $("#s-star").textContent = s.mast;
  $("#s-correct").textContent = s.distinctCorrect;
  $("#s-streak").textContent = s.streak;
  $("#b-learn").style.width = (s.learn / s.total * 100) + "%";
  $("#b-prac").style.width = (s.prac / s.total * 100) + "%";
  $("#b-mast").style.width = (s.mast / s.total * 100) + "%";
  $("#n-learn").textContent = s.learn;
  $("#n-prac").textContent = s.prac;
  $("#n-mast").textContent = s.mast;
  $("#n-total").textContent = s.total;
}

export function summaryHidden() { return el.summary.hidden; }

export function renderSummary(d) {
  const catRows = d.cats
    .map((c) => `<tr><td><span style="color:${c.color}">●</span> ${c.name}</td><td>答對 ${c.correct}／精通 ${c.mast}／共 ${c.total}</td></tr>`)
    .join("");
  const chip = (w) => `<span class="wchip">${w.word}</span>`;
  const fchip = (w) => `<span class="wchip fixed">${w.word}</span>`;
  const none = (t) => `<span style="color:var(--ink3);font-size:13px">${t}</span>`;

  el.summary.innerHTML = `
    <h3>📊 學習總結 Summary <a id="sumClose">收起 ✕</a></h3>
    <div class="bigrate">
      <b class="tnum">${d.passRate}%</b>
      <span>總答對率<br><small>${d.correct} 題對 / 共作答 ${d.attempts} 題</small></span>
      <span style="margin-left:auto;text-align:right">
        <b class="tnum" style="font-size:30px;color:var(--violet)">${d.distinctCorrect}</b><br>
        <small>答對過的字（不重複）／ 共 ${d.total} 字</small></span>
    </div>
    <div class="subh">各類別進度</div>
    <table class="sumtable">${catRows}</table>
    <div class="subh">✅ 已精通 ${d.mastered.length} 字（連續答對 3 次）</div>
    <div class="chips-wrap">${d.mastered.length ? d.mastered.map(chip).join("") : none("還沒有，繼續加油！")}</div>
    <div class="subh">🛠️ 曾拼錯、現在已訂正 ${d.fixed.length} 字</div>
    <div class="chips-wrap">${d.fixed.length ? d.fixed.map(fchip).join("") : none("目前沒有")}</div>`;
  $("#sumClose").onclick = () => { el.summary.hidden = true; };
}

export function toggleSummary(data) {
  el.summary.hidden = !el.summary.hidden;
  if (!el.summary.hidden) {
    renderSummary(data);
    el.summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ---------- one-time button wiring ----------
export function onPeek(fn) { el.peekBtn.onclick = fn; }
export function onCheckClick(fn) { el.checkBtn.onclick = fn; }
export function onReset(fn) { $("#resetBtn").onclick = fn; }
export function onSummary(fn) { $("#sumBtn").onclick = fn; }
