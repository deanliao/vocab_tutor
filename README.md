# 拼字小特工 · Spelling Agent

A tiny, offline spelling trainer for kids learning English (Taiwan 國中 2000-word list).
Built for phonics (自然拼音) learners who read fine but struggle to **spell** — it drills the
6 categories of "trap" words (silent letters, irregulars, weak vowels, double letters,
homophones, long words) with audio, spaced repetition, and a progress/summary dashboard.

**It is a single self-contained HTML file. No install, no build, no server, no internet required.**

---

## How to use it

Pick whichever is easiest:

### Option 1 — Just open the file (simplest, works offline)
Double-click **`spelling_trainer.html`**, or drag it into any modern browser
(Chrome, Safari, Edge). That's it. Works with no internet connection.

### Option 2 — Put it online with GitHub Pages (best for iPad / sharing a link)
1. Create a repo on GitHub and upload `spelling_trainer.html` (and this README).
2. Repo **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**,
   pick `main` / root, **Save**.
3. Wait ~1 minute. Your link will be:
   `https://<your-username>.github.io/<repo-name>/spelling_trainer.html`
   Open it on any device and bookmark it.

> Tip: if you rename the file to `index.html`, the link is just
> `https://<your-username>.github.io/<repo-name>/`.

---

## Can my friend run it? Is setup hard?

**Yes, and it's about as easy as it gets.** There is nothing to install or configure:

- One HTML file, zero dependencies, no Node/Python/build step.
- Download → double-click → play. Or open the GitHub Pages link.
- Each person's **progress is saved privately in their own browser** (via `localStorage`),
  so two kids on two computers keep separate scores. Nothing is uploaded anywhere.

### Good to know
- **Audio (hearing the word)** uses the browser's built-in text-to-speech.
  Chrome, Safari, and Edge on Mac / Windows / iPad / Android all have English voices,
  so it "just works." If a device happens to have no English voice, the **偷看 (peek)**
  and answer-reveal still show the word, so practice isn't blocked.
- **Most reliable experience = GitHub Pages (https)**, especially on iPad — a couple of
  browsers restrict audio/storage when opening a raw `file://`. Pages avoids that.
- Progress lives per-browser. Clearing browser data (or the in-app **重來 reset**) resets it.
  Using the same GitHub Pages link on the same device/browser keeps progress across days.

---

## What's inside

- `spelling_trainer.html` — the app (open this).
- `拼字訓練計畫.md` — the teaching plan: the 6 trap categories, the Top-100 word list,
  the study method (Look–Say–Cover–Write–Check), a weekly schedule, and coaching tips.
- `國中2000單字.md` — the full verified 2000-word source list.

## Modes & scoring
- **🎧 聽與拼** hear it, spell it · **🖍️ 填陷阱** fill only the hard letters ·
  **🧩 重組** unscramble · **👀 看一眼** flash-cover-recall · homophones use sentence context.
- Words you miss come back sooner (Leitner spaced repetition).
- Dashboard tracks **答對率 (pass rate)**, **答對字 (distinct words correct)**, streak, and
  熟練度: **學習中** = right once · **練習中** = 2 in a row · **精通** = 3 in a row.
- **📊 學習總結** shows the pass rate, per-category progress, mastered words, and words
  that were once misspelled and are now corrected.

## License
Free to use and share for personal / educational purposes.
