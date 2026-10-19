# Project 13 — Problemes amb esquema: living state

Agent-facing memory between sessions. English. Update it in the same commit as any change.
Spec: [`SPEC.md`](SPEC.md). Where they disagree, this file wins.

## Status (2026-10-19): v1 built, not yet published

| Part | Status |
|---|---|
| Engines `esquemes.js`, `generador.js`, `lectura.js` (pure, Node-tested) | DONE |
| Data: 127 templates (≥ 6 per schema for N1–N3, 3 per schema for N4), names, emoji pictos, keywords, lexicon | DONE |
| UI: `problemes.html` (5 fixed steps, profiles, timer), `index.html` (teacher link generator) | DONE, browser-checked under `file://` |
| Tests (`node tests/run-all.js`) | DONE, all green |
| N5 (two-step), «Escolta» read-aloud, ARASAAC | NOT IN v1 (user, 2026-10-19) |
| GitHub bootstrap (`unzip-upload.yml`, `tests.yml`, `_uploads/`), Cloudflare `esquemes.step-quiz.net` | PENDING (user) |
| Cards in `pi` portals and `ins` | PENDING (after first public release) |

## Decisions approved by the user (2026-10-19)

1. Pictograms: system emoji (no ARASAAC, so no attribution string needed).
2. No read-aloud.
3. Levels N1–N4 only.

## Technical and pedagogical decisions (agent)

- **Equations** (`a op b = c`, two free roles, the third computed): canvi `inici ± canvi = final`; combinacio
  `part1 + part2 = total`; comparacio `petit + diferencia = gran` (spec wrote it as a subtraction; same
  relation); grups `grups · mida = total`; vegades `petit · vegades = gran`; proporcio `unitat · quantitat = total`
  shown as a two-row table (1 → unit price; quantity → total) instead of the general `a : b = c : d`.
- All numbers are integers ≥ 2 (units always plural). Maxima N1 20, N2 50, N3–N4 100; `dil` caps at 20 on every
  level (no level clamp). Multiplication factors ≤ 5 / 9 / 10.
- **Series:** schemas go by turns (shuffled order, one shuffled bag per schema), no duplicate items. Seed
  `FIXED|NIVELL|schemas|PERFIL|batch`; without `fixed`, a fresh `crypto` seed.
- **Easy-read lint** applies to every level (15 words per sentence); N1–N2 also ≤ 3 sentences and no
  subordinators. Every word must be in `data/lexic.js` (controlled lexicon, as in `a/docs/LEXIC.md`).
- `trampaParaulaClau` is checked both ways against `data/paraules-clau.js`; N4 is always true.
- Wrong schema: two messages — the chosen schema's discriminating question («… Aquí no.») and «Pensa en <correct>».
- Wrong operation: the message depends on the unknown's position (`resultat`, `part`, `factor`, `inici`, `tret`).
- `dil` shows at most 2 schema cards (the correct one plus one other). `tdah`: batches of 5, «Fes 5 problemes
  més». Timer only with `temporitzador=`; the disc is an SVG, hidden via `removeAttribute('hidden')` /
  `setAttribute` plus the CSS rule `[hidden]{display:none!important}` (SVG ignores the property).
- No storage at all; no verification code (final screen says so).
- `tests/repo.test.js` allows the one public URL in `js/ui/enllacos.js` (it is the link text, not a request).
- CSP in `_headers`: `connect-src 'none'`, no inline scripts or styles.
