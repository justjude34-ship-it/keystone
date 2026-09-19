# Keystone

Five core numbers after the method of **Dr. Steve G. Jones**.

A NumeraKey-family progressive web app. Cast a birth-certificate chart on the phone. Nothing is uploaded. Buy once, own forever.

Live files are in this folder. Open `index.html` or add the folder to Home Screen.

## What it calculates

Jones taught a Pythagorean chart whose centre is five core numbers:

1. **Life Path** — month, day and year reduced separately, then added. Masters 11 and 22 are kept in the columns.
2. **Birthday** — the calendar day, shown as compound and reduced (17/8, not only 8).
3. **Expression / Destiny** — every letter of the birth name. Each name part is reduced first, then the parts are added.
4. **Soul Urge / Heart’s Desire** — vowels only. Y is context-aware.
5. **Personality** — consonants only.

Also on the chart:

- Maturity = Life Path + Expression
- Growth = first name
- Personal Year / Month / Day
- Karmic debts 13, 14, 16, 19 (flagged when they appear before reduction)
- Karmic lessons (missing 1–9 in the name)
- Hidden Passion (most frequent letter-value)
- Secret Self = 9 − number of lessons
- Temperament planes
- Effectiveness (how close Life Path, Expression and Soul Urge sit)
- Challenge number from the date columns
- Optional current-name overlay
- His-and-Hers compare of two saved charts

## Jones rules used here

- Letter map: AJS 1, BKT 2, CLU 3, DMV 4, ENW 5, FOX 6, GPY 7, HQZ 8, IR 9
- Masters kept: **11 and 22 only**. A 33 is brought to 6, with a note that some schools keep 33
- Birth-certificate name is the core. A used or married name is a minor overlay
- Hyphens split a name. Jr / III / Dr are dropped
- Y is a vowel at the end of a name (Mary, Sky), between consonants (Lynn), or at the start before a consonant (Yvonne). Y next to A/E/I/O/U is a consonant (Hayes, Boyd, Yolanda)

## Fixtures (from Number Focus and the Howard Stern demo)

- 12 October 1936 → Life Path 5
- 22 November 1911 → 11 + 22 + 3 = 36 → Life Path 9
- Ada Lovelace, 10 December 1815 → Life Path 1
- Howard Alan Stern → Expression 11, Soul Urge 14/5 with karmic flag, HOWARD 33→6, STERN 22 kept

## What this is not

Inspired by Jones’s **method**. Interpretations are original. This is not his certification course, not his manuals, and not a substitute for care. A self-help reflection tool.

## Files

- `index.html` — shell and styles (NumeraKey tokens)
- `app.js` — engine and interface
- `meanings.js` — original copy
- `manifest.json` / `sw.js` / `icon.svg` — PWA
- `test-engine.mjs` — fixture audit (`node test-engine.mjs`)

## Shop card (when you add it to NumeraKey)

- Kicker: Numerology · Jones method
- Name: Keystone
- Price: $79 AUD
- Line: Your five core numbers, through the method of Dr. Steve G. Jones. Birth name, birth date, the reading stays on the phone.
