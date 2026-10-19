# Project 13 — Problemes amb esquema: specification

> Copied from `SPEC-step-quiz-9-projects.md` §11 and §5.4 (2026-10-19). The shared rules (§2–§4) are summarised
> in the master spec; decisions taken later are in [`STATE.md`](STATE.md),
> which overrides this file. Storage keys, if ever needed: `esquemes:v1:<what>` (v1 stores nothing).

## 11. Project 13: Problemes amb esquema (schema-based word problems)

**Repo:** `esquemes`. **Audience:** ESO students with learning difficulties (TEA, DIL, TDAH) and any student who solves word problems by keyword hunting. Linked from `pi`'s portals and from `ins`.

### 11.1 Pedagogical intent

- **The method.** Before calculating, the student identifies the problem's **schema** and fills a **bar model** (Singapore model method) with the quantities. The operation then follows from the diagram.
- **Evidence.** Schema-based instruction is among the best-supported interventions for word-problem difficulties: Jitendra, Xin and colleagues; meta-analysis by Peltier & Vannest (2017).
- **Why it matters.** It replaces the "keyword" strategy, which fails exactly with literal-minded students: "inconsistent language" problems, where «més» signals a subtraction (Lewis & Mayer 1987; Hegarty, Mayer & Monk 1995).

### 11.2 Schemas and diagrams

| id | Catalan name | Structure | Diagram |
|---|---|---|---|
| `canvi` | Canvi | inicial ± canvi = final | Initial bar, change segment added or removed, final bar |
| `combinacio` | Combinació | part + part = total | Two part bars under one total bar |
| `comparacio` | Comparació | gran − petit = diferència | Two left-aligned bars and the difference segment |
| `grups` | Grups iguals | grups × mida = total | Total bar split into equal boxes |
| `vegades` | Comparació multiplicativa | petit × k = gran | Small bar; big bar made of k copies |
| `proporcio` | Proporció | a : b = c : d | Two-row ratio table instead of bars |

**Difficulty depends on the position of the unknown.** In `canvi`, the unknown initial value is hardest. Levels:
- N1: unknown result, numbers ≤ 20;
- N2: unknown change or part;
- N3: unknown start, numbers ≤ 100;
- N4: inconsistent-language problems;
- N5: two-step problems that combine two schemas.

### 11.3 Fixed 5-step flow (always identical; predictability matters for TEA)

1. **Llegeix.** The problem text. Quantities are tappable chips. There is an optional pictogram per noun (§5.4) and an optional «Escolta» button: Web Speech API `speechSynthesis` with `lang = 'ca-ES'`, shown **only if a Catalan voice exists** (`getVoices()` after `voiceschanged`), off by default, enabled by the teacher's link.
2. **Quin tipus?** Cards for the schemas the teacher enabled (`?esquemes=canvi,combinacio`), each with an icon and a mini-diagram. On a wrong choice, show the discriminating question for the chosen and the correct schema: «Canvia alguna cosa amb el temps?» → Canvi; «S'ajunten dos grups?» → Combinació; «Es compara qui en té més?» → Comparació.
3. **Omple el diagrama.** Drag (or tap-tap, or keyboard) the chips and a «?» chip into the slots. Check per slot, saying which slot is wrong.
4. **Quina operació?** The diagram yields an equation template (`12 + 5 = ?`, `? + 5 = 17`). The student chooses the operation (`+ − · :`) and writes it.
5. **Respon.** Compute, then complete a sentence frame with units («La Laia té ___ cromos.»).

Progress dots for the five steps are always in the same place, and step titles never move.

### 11.4 Profiles (`?perfil=`)

| Profile | Effects |
|---|---|
| `tea` | No animations; literal wording only; layout never changes between items; explicit «Què passarà ara» line at each step |
| `tdah` | Sets of 5 items; optional visual timer (a disc that empties, no numbers, no sound); one step visible at a time |
| `dil` | Numbers ≤ 20; at most 2 schemas offered; pictograms on; read-aloud button on if available |
| *(none)* | Standard ESO |

### 11.5 Data and generation

```js
window.ESQUEMES_PLANTILLES = [
  { id: 'canvi-guany-01', esquema: 'canvi', nivell: 1, signe: '+',
    text: 'La {nom} té [[inici]] cromos. En guanya [[canvi]]. Quants cromos té ara?',
    incognita: 'final', unitat: 'cromos', pictos: ['cromo'],
    rangs: { inici: [5, 15], canvi: [2, 9] }, restriccions: ['final <= 20'],
    trampaParaulaClau: false } ];
window.ESQUEMES_NOMS = ['Laia', 'Pau', 'Nora', 'Iu', …];
```

- Items are generated from templates with the seeded RNG (§4.2).
- `[[role]]` marks quantity chips. Roles must be valid for the schema.
- Teacher links can fix a set A/B/C so the whole class gets the same items, as fixed sessions do in `operacions`.

### 11.6 Easy-to-read rules (*lectura fàcil*), enforced by a test

- At most 15 words per sentence and at most 3 sentences per problem at N1–N2.
- Present tense and no passive voice. No double negatives.
- At N1–N2, no subordinate markers from a configurable list (`que`, `perquè`, `si`, `quan`, `mentre`, …).
- Numbers written as digits. Only names from the names list.

Read `karelcat-p/docs/CURRENT-STATE.md` §10 (easy-to-read criteria) and `a/docs/LEXIC.md` (a controlled lexicon with a test) and align with them. Consider a controlled lexicon for the `dil` profile.

### 11.7 Tests

- For every template, 200 seeded instantiations must satisfy:
  - the schema equation (recomputed independently from the roles);
  - a positive integer answer and the stated constraints;
  - no duplicate items within a set.
- Every `[[role]]` is valid for its schema, and the unknown is one of them.
- Easy-to-read lint (§11.6).
- `trampaParaulaClau: true` iff the text contains a keyword whose naive operation differs from the correct one (keyword table in data).
- At least 6 templates per schema per level, N1–N3.

### 11.8 Acceptance criteria

- [ ] Six schemas, levels N1–N4.
- [ ] Profiles work.
- [ ] Teacher link generator page (`index.html`, the pattern of `operacions/index.html`).
- [ ] No codes in v1.
- [ ] Pictogram attribution shown wherever pictograms are.

**Open questions for the user:**
- ARASAAC pictograms or emoji?
- Is read-aloud acceptable? Some Chrome voices are network-backed, which the browser fetches, not the page.
- Should N5 (two-step) be in v1?

---


### 5.4 Pictograms (Project 13, optionally 2)

- If the user approves ARASAAC: download the needed pictograms **once**, into `img/arasaac/` (no runtime API calls), and keep a manifest `data/pictos.js` with id, file and keyword.
- ARASAAC pictograms are distributed under CC BY-NC-SA (author Sergio Palao, property of the Government of Aragon). **Verify the current terms and the exact attribution string at arasaac.org before shipping, or ask the user to.** The usual form is: «Autor pictogrames: Sergio Palao. Origen: ARASAAC (http://www.arasaac.org). Llicència: CC (BY-NC-SA). Propietat: Govern d'Aragó». Show it in the footer of every page that displays pictograms.
- Fallback without ARASAAC: system emoji, as `a` does.

---
