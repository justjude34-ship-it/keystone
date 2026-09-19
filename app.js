/* Keystone — Steve G. Jones method
   Calculation rules locked to Lucas spec + Number Focus fixtures.
   Interpretations: original (meanings.js). Nothing leaves the device. */

(function () {
  "use strict";

  const LETTER = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
    J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
    S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
  };
  const MASTERS = new Set([11, 22]);
  const KARMIC = new Set([13, 14, 16, 19]);
  const TITLES = ["Jr","Jr.","Sr","Sr.","II","III","IV","V","Dr","Dr.","Mr","Mr.","Mrs","Mrs.","Ms","Ms.","Miss","Phd","PhD","Ph.D"];
  const PLANES = {
    physical: "DEMW",
    mental: "AGHJLNP",
    emotional: "BIORSTXZ",
    intuitive: "CFKQUVY"
  };
  const STORE = "keystone.charts.v1";
  const LAST = "keystone.last.v1";
  const HINT = "keystone.hint.v1";
  const M = window.KEYSTONE_MEANINGS || {};

  function stripAccents(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function onlyLetters(s) {
    return stripAccents(s).toUpperCase().replace(/[^A-Z]/g, "");
  }
  function splitNameParts(full) {
    return stripAccents(full || "")
      .replace(/[’']/g, "")
      .split(/[\s\-]+/)
      .map((p) => p.replace(/[^A-Za-z]/g, ""))
      .filter(Boolean)
      .filter((p) => !TITLES.includes(p) && !TITLES.includes(p + "."));
  }
  function isYVowel(letters, i) {
    const prev = letters[i - 1] || "";
    const next = letters[i + 1] || "";
    const vowels = "AEIOU";
    if (!prev && vowels.includes(next)) return false;
    if (vowels.includes(prev)) return false;
    if (!next) return true;
    if (!vowels.includes(prev) && !vowels.includes(next)) return true;
    if (!prev && next && !vowels.includes(next)) return true;
    return false;
  }
  function letterKind(letters, i) {
    const ch = letters[i];
    if (ch === "Y") return isYVowel(letters, i) ? "V" : "C";
    return "AEIOU".includes(ch) ? "V" : "C";
  }
  function reduceDetail(n) {
    const path = [];
    const karmic = [];
    let note33 = false;
    let value = Number(n) || 0;
    if (value < 0) value = Math.abs(value);
    path.push(value);
    while (value > 9) {
      if (MASTERS.has(value)) break;
      if (value === 33) {
        note33 = true;
        value = 6;
        path.push(6);
        break;
      }
      if (KARMIC.has(value)) karmic.push(value);
      value = String(value).split("").reduce((a, d) => a + Number(d), 0);
      path.push(value);
    }
    return { value, path, karmic, note33, compound: path[0] };
  }
  function reduce(n) {
    return reduceDetail(n).value;
  }
  function displayNum(detail) {
    if (!detail) return "\u2014";
    const v = detail.value;
    const raw = detail.compound;
    if (raw !== v && raw > 9) return raw + "/" + v;
    return String(v);
  }
  function isMaster(n) {
    return n === 11 || n === 22;
  }
  function yearReduced(year) {
    const sum = String(year).split("").reduce((a, d) => a + Number(d), 0);
    return reduceDetail(sum);
  }
  function monthReduced(month) {
    return reduceDetail(month);
  }
  function dayReduced(day) {
    return reduceDetail(day);
  }
  function mapLetters(str, filter) {
    const letters = onlyLetters(str).split("");
    const out = [];
    letters.forEach((ch, i) => {
      const kind = letterKind(letters, i);
      if (filter === "V" && kind !== "V") return;
      if (filter === "C" && kind !== "C") return;
      out.push({ ch, kind, value: LETTER[ch] });
    });
    return out;
  }
  function reduceNameParts(parts, filter) {
    const partsOut = parts.map((part) => {
      const mapped = mapLetters(part, filter);
      const sum = mapped.reduce((a, x) => a + x.value, 0);
      const det = reduceDetail(sum);
      return { part, mapped, sum, det, value: det.value };
    });
    const total = partsOut.reduce((a, p) => a + p.value, 0);
    const det = reduceDetail(total);
    const karmic = [...partsOut.flatMap((p) => p.det.karmic), ...det.karmic];
    const note33 = partsOut.some((p) => p.det.note33) || det.note33;
    return { parts: partsOut, total, det, value: det.value, karmic: [...new Set(karmic)], note33 };
  }
  function inclusionTable(parts) {
    const counts = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0 };
    const letters = [];
    parts.forEach((part) => {
      mapLetters(part, "ALL").forEach((x) => {
        counts[x.value] += 1;
        letters.push(x);
      });
    });
    const lessons = [1,2,3,4,5,6,7,8,9].filter((n) => counts[n] === 0);
    const max = Math.max(...Object.values(counts));
    const passion = max > 0 ? [1,2,3,4,5,6,7,8,9].filter((n) => counts[n] === max) : [];
    return { counts, lessons, passion, max, letters };
  }
  function temperament(parts) {
    const letters = onlyLetters(parts.join(""));
    const counts = { physical:0, mental:0, emotional:0, intuitive:0 };
    for (const ch of letters) {
      for (const plane of Object.keys(PLANES)) {
        if (PLANES[plane].includes(ch)) counts[plane] += 1;
      }
    }
    const total = letters.length || 1;
    return { counts, total };
  }
  function lifePathFromDate(y, m, d) {
    const month = monthReduced(m);
    const day = dayReduced(d);
    const year = yearReduced(y);
    const sum = month.value + day.value + year.value;
    const det = reduceDetail(sum);
    const karmic = [...month.karmic, ...day.karmic, ...year.karmic, ...det.karmic];
    return { month, day, year, sum, det, value: det.value, karmic: [...new Set(karmic)], note33: month.note33 || day.note33 || year.note33 || det.note33 };
  }
  function challengeFromDate(y, m, d) {
    const month = reduce(m);
    const day = reduce(d);
    const year = yearReduced(y).value;
    const x = Math.abs(month - day);
    const yy = Math.abs(day - year);
    return { x, y: yy, value: Math.abs(x - yy) };
  }
  function personalYear(y, m, d, calYear) {
    const month = monthReduced(m);
    const day = dayReduced(d);
    const year = yearReduced(calYear);
    const sum = month.value + day.value + year.value;
    return reduceDetail(sum);
  }
  function personalMonth(py, calMonth) {
    return reduceDetail(py + calMonth);
  }
  function personalDay(pm, calDay) {
    return reduceDetail(pm + calDay);
  }
  function masterDown(n) {
    if (n === 11) return 2;
    if (n === 22) return 4;
    return n;
  }
  function effectiveness(lp, exp, soul) {
    function pack(a, b, c) {
      return Math.abs(a - b) + Math.abs(b - c) + Math.abs(a - c);
    }
    const raw = pack(lp, exp, soul);
    const hasMaster = isMaster(lp) || isMaster(exp) || isMaster(soul);
    if (!hasMaster) return { value: raw, note: null };
    const averaged = (raw + pack(masterDown(lp), masterDown(exp), masterDown(soul))) / 2;
    return { value: averaged, note: "Masters averaged with their base digits, as Jones taught effectiveness." };
  }
  function parseDob(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d, iso };
  }
  function formatDob(iso) {
    const p = parseDob(iso);
    if (!p) return "";
    const dd = String(p.d).padStart(2, "0");
    const mm = String(p.m).padStart(2, "0");
    return dd + "/" + mm + "/" + p.y;
  }
  function castChart(input) {
    const first = (input.first || "").trim();
    const middle = (input.middle || "").trim();
    const last = (input.last || "").trim();
    const currentName = (input.currentName || "").trim();
    const dob = parseDob(input.dob);
    const parts = splitNameParts([first, middle, last].filter(Boolean).join(" "));
    if (!parts.length && !dob) return null;
    const full = [first, middle, last].filter(Boolean).join(" ");
    const expression = parts.length ? reduceNameParts(parts, "ALL") : null;
    const soul = parts.length ? reduceNameParts(parts, "V") : null;
    const personality = parts.length ? reduceNameParts(parts, "C") : null;
    const growth = first ? reduceNameParts(splitNameParts(first), "ALL") : null;
    const inclusion = parts.length ? inclusionTable(parts) : null;
    const temp = parts.length ? temperament(parts) : null;
    const lp = dob ? lifePathFromDate(dob.y, dob.m, dob.d) : null;
    const birthday = dob ? { raw: dob.d, det: reduceDetail(dob.d), value: reduce(dob.d) } : null;
    const maturity = lp && expression ? reduceDetail(lp.value + expression.value) : null;
    const secretSelf = inclusion ? 9 - inclusion.lessons.length : null;
    const challenge = dob ? challengeFromDate(dob.y, dob.m, dob.d) : null;
    const eff = lp && expression && soul ? effectiveness(lp.value, expression.value, soul.value) : null;
    const now = new Date();
    const asYear = input.asYear || now.getFullYear();
    const asMonth = now.getMonth() + 1;
    const asDay = now.getDate();
    const py = dob ? personalYear(dob.y, dob.m, dob.d, asYear) : null;
    const pMonth = py ? personalMonth(py.value, asMonth) : null;
    const pDay = pMonth ? personalDay(pMonth.value, asDay) : null;
    let current = null;
    if (currentName) {
      const cParts = splitNameParts(currentName);
      current = {
        name: currentName,
        expression: reduceNameParts(cParts, "ALL"),
        soul: reduceNameParts(cParts, "V"),
        personality: reduceNameParts(cParts, "C")
      };
    }
    const allKarmic = new Set();
    [lp, expression, soul, personality, birthday && birthday.det, growth].forEach((x) => {
      const list = x && (x.karmic || (x.det && x.det.karmic));
      if (list) list.forEach((k) => allKarmic.add(k));
    });
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      first, middle, last, full, parts, currentName, current,
      dob: dob && dob.iso,
      asYear,
      expression, soul, personality, growth, inclusion, temp,
      lp, birthday, maturity, secretSelf, challenge, eff,
      py, pMonth, pDay,
      karmic: [...allKarmic].sort((a, b) => a - b),
      savedAt: new Date().toISOString()
    };
  }
})();
