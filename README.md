# 拼字小特工 · Spelling Agent

A spelling trainer for kids learning English (Taiwan 國中 2000-word list).
Built for phonics (自然拼音) learners who read fine but struggle to **spell**. All ~2000 words are
graded into **5 levels**; a short **placement test** finds where the student belongs, then it plays
as a **level-up game** — practice a level, and once your accuracy passes **80%** you can take the
**level challenge** to climb to the next one. Audio, spaced repetition, and a progress dashboard throughout.

**Vanilla JavaScript (ES modules) — no framework, no build step, no dependencies.**
It just needs to be *served* over http (a one-line local server, or GitHub Pages), because
browsers block ES modules when a page is opened directly from `file://`.

---

## How to run it

### Option 1 — Local (one command, works offline)
From this folder, start any static server and open the page:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/ in your browser
```

(Any static server works — VS Code's "Live Server" extension, `npx serve`, etc.)

### Option 2 — GitHub Pages (best for iPad / sharing a link)

> Not enabled yet — these are the steps to turn it on whenever you want.

**Method A — web UI:**
1. Go to the repo **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**.
2. Choose branch `main`, folder `/ (root)`, then **Save**.
3. Wait ~1 minute. The link will be `https://deanliao.github.io/vocab_tutor/`.
   Open it on any device and bookmark it.

**Method B — one command (GitHub CLI):**
```bash
gh api -X POST repos/deanliao/vocab_tutor/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Because `index.html` is the entry point, the Pages link is just the clean root URL above.

---

## Can my friend run it? Is setup hard?

**No install, no build, no dependencies** — but it does need to be *served* (not double-clicked),
since it uses ES modules. Easiest paths:

- **Open the GitHub Pages link** (Option 2) — nothing to install, works on any device.
- **Or** run `python3 -m http.server` in the folder and open `http://localhost:8000/`.

### Good to know
- Each person's **progress is saved privately in their own browser** (`localStorage`),
  so two kids keep separate scores. Nothing is uploaded anywhere.
- **Audio** uses the browser's built-in text-to-speech (Chrome / Safari / Edge on
  Mac / Windows / iPad / Android all have English voices). If a device has no English
  voice, the **偷看 (peek)** and answer-reveal still show the word, so practice isn't blocked.
- **GitHub Pages (https) is the most reliable**, especially on iPad.
- The in-app **重來 reset** clears saved progress.

---

## Project structure

```
index.html            page structure (play screen + quiz screen); loads css + src/app.js
css/styles.css        all styles / theme tokens
data/words2000.json   the graded word bank: [{ w: word, t: trapLetterIndices, lv: 1-5 }]
src/
  levels.js           level config + spelling helpers (misspelling generator, shuffle)
  data.js             curated "featured" trap words (verified 中文 + example + mask)
  wordbank.js         loads words2000.json, merges featured data → master word list
  store.js            progress, localStorage, grading, level state, stats (the "model")
  srs.js              Leitner spaced-repetition picker (scoped to a level)
  audio.js            text-to-speech wrapper
  confetti.js         celebration animation
  ui.js               all DOM rendering (the "view")
  app.js              placement → play → challenge orchestration (the "controller", entry point)
```

Data → model → view → controller are separated: `ui.js` never touches the store directly,
and `store.js` never touches the DOM.

### Editing the words
- **Levels / the full bank:** `data/words2000.json`. Each entry is `{ w, t, lv }` — the word,
  the indices of its "trap" (hard) letters, and its level 1-5. Levels were graded by a difficulty
  heuristic (length, syllables, suffixes, spelling traps); tweak `lv` to re-grade any word.
- **Featured words** (verified Chinese meaning + example sentence + hand-checked mask):
  `src/data.js`. Each is `[casedWord, 中文, exampleSentence, category]`, where UPPERCASE letters
  mark the traps — `"neCeSSary"` → `c, s, s`; `"Know"` → the silent `k`. A featured word enriches
  the matching word in the bank.

---

## How the level game works
1. **Placement test** (first run, or the 🎯 測程度 button): an adaptive spelling ladder — hear a word,
   pick the correct spelling — that finds the level where accuracy drops, and starts you there.
2. **Practice a level** with any mode. Your **per-level accuracy** shows in the banner.
3. Once you've done ≥12 questions at **≥80%**, the **🏆 挑戰測驗 (level challenge)** unlocks.
4. Score **≥80%** on the challenge to **level up** and unlock the next level. Miss it → keep practicing.
   Cleared levels stay open for review.

## Modes & scoring
- **🎧 聽與拼** hear it, spell it · **✅ 選拼法** pick the correct spelling ·
  **🧩 重組** unscramble · **🖍️ 填陷阱** fill only the hard (trap) letters.
- Words you miss come back sooner (Leitner spaced repetition, within your level).
- Dashboard tracks **等級 (level)**, **答對字 (distinct words correct)**, streak, and **答對率 (pass rate)**;
  熟練度: **學習中** = right once · **練習中** = 2 in a row · **精通** = 3 in a row.
- **📊 學習總結** shows pass rate, per-level progress, mastered words, and words once
  misspelled and now corrected.

## Companion docs
- `拼字訓練計畫.md` — the teaching plan: the 6 trap categories, the Top-100 word list,
  the study method (Look–Say–Cover–Write–Check), a weekly schedule, and coaching tips.
- `國中2000單字.md` — the full verified 2000-word source list.

## License
Free to use and share for personal / educational purposes.
