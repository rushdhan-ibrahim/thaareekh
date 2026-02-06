import { people, edges } from '../data/sovereigns.merge.js';
import { fR, esc } from '../utils/format.js';
import { goF } from './navigation.js';

export function initSearch() {
  const sI = document.getElementById("si");
  const dd = document.getElementById("dd");
  const MAX_RESULTS = 12;
  const state = { rows: [], active: -1 };

  const norm = s => (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  function editDistance(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  const pc = new Map();
  people.forEach(p => pc.set(p.id, new Set()));
  edges.forEach(e => {
    pc.get(e.s)?.add(e.c);
    pc.get(e.d)?.add(e.c);
  });

  function parseQuery(raw) {
    const out = { dy: null, c: null, t: null, terms: [] };
    raw.trim().split(/\s+/).filter(Boolean).forEach(tok => {
      const i = tok.indexOf(":");
      if (i > 0) {
        const k = norm(tok.slice(0, i));
        const v = norm(tok.slice(i + 1));
        if (!v) return;
        if (k === "dy" || k === "dynasty") out.dy = v;
        else if (k === "c" || k === "conf") {
          const mapped = { confirmed: "c", inferred: "i", uncertain: "u", c: "c", i: "i", u: "u" }[v];
          if (mapped) out.c = mapped;
        } else if (k === "t" || k === "title") out.t = v;
        else out.terms.push(norm(tok));
        return;
      }
      out.terms.push(norm(tok));
    });
    return out;
  }

  function scorePerson(p, qParsed) {
    const nm = norm(p.nm);
    const rg = norm(p.rg || "");
    const dy = norm(p.dy || "");
    const nums = (p.n || []).map(x => String(x));
    const aliases = (p.aliases || []).map(norm);
    const regnal = (p.regnal_names || []).map(norm);
    const titles = (p.titles || []).map(norm);
    const hay = [nm, rg, dy, ...aliases, ...regnal, ...titles, nums.join(" ")].join(" ");

    if (qParsed.dy && !dy.includes(qParsed.dy)) return null;
    if (qParsed.c && !pc.get(p.id)?.has(qParsed.c)) return null;
    if (qParsed.t && !titles.some(t => t.includes(qParsed.t))) return null;
    if (!qParsed.terms.length && (qParsed.dy || qParsed.c || qParsed.t)) {
      const y = p.re?.[0]?.[0] ?? 99999;
      return { person: p, score: 20_000 - y, reason: "filter" };
    }

    let score = 0;
    let reason = "match";
    let hits = 0;

    for (const term of qParsed.terms) {
      const numQ = term.startsWith("#") ? term.slice(1) : term;
      let termHit = false;

      if (nums.includes(numQ)) { score += 120; reason = "number"; termHit = true; }
      if (nm === term) { score += 110; reason = "name"; termHit = true; }
      else if (nm.startsWith(term)) { score += 90; reason = "name"; termHit = true; }
      else if (nm.includes(term)) { score += 70; reason = "name"; termHit = true; }

      if (aliases.some(a => a === term)) { score += 80; reason = "alias"; termHit = true; }
      else if (aliases.some(a => a.includes(term))) { score += 55; reason = "alias"; termHit = true; }

      if (rg.includes(term) || regnal.some(r => r.includes(term))) {
        score += 45; if (reason === "match") reason = "regnal"; termHit = true;
      }
      if (titles.some(t => t.includes(term))) {
        score += 30; if (reason === "match") reason = "title"; termHit = true;
      }
      if (dy.includes(term)) {
        score += 20; if (reason === "match") reason = "dynasty"; termHit = true;
      }

      if (!termHit && term.length >= 4) {
        const fuzzyPool = [nm, ...aliases, ...regnal];
        const best = fuzzyPool.reduce((acc, v) => Math.min(acc, editDistance(term, v)), 999);
        if (best <= 2) {
          score += 38 - best * 8;
          if (reason === "match") reason = "fuzzy";
          termHit = true;
        }
      }
      if (termHit) hits++;
      else if (hay.includes(term)) hits += 0.5;
    }

    if (!hits) return null;
    if (hits < qParsed.terms.length) score -= (qParsed.terms.length - hits) * 18;
    if (qParsed.dy || qParsed.c || qParsed.t) score += 10;
    return { person: p, score, reason };
  }

  function rank(q) {
    const parsed = parseQuery(q);
    return people
      .map(p => scorePerson(p, parsed))
      .filter(Boolean)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const aY = a.person.re?.[0]?.[0] ?? 99999;
        const bY = b.person.re?.[0]?.[0] ?? 99999;
        return aY - bY;
      })
      .slice(0, MAX_RESULTS);
  }

  function applyActive() {
    const rows = dd.querySelectorAll(".ddi");
    rows.forEach((el, i) => el.classList.toggle("act", i === state.active));
  }

  function choose(idx) {
    const r = state.rows[idx];
    if (!r) return;
    goF(r.person.id);
    dd.classList.remove("open");
    sI.value = "";
    state.rows = [];
    state.active = -1;
  }

  function render(q) {
    if (!q.trim()) {
      dd.classList.remove("open");
      state.rows = [];
      state.active = -1;
      return;
    }
    state.rows = rank(q);
    state.active = state.rows.length ? 0 : -1;

    if (!state.rows.length) {
      dd.innerHTML = '<div class="dde">No matches</div>';
      dd.classList.add("open");
      return;
    }

    dd.innerHTML = state.rows.map((r, i) => {
      const p = r.person;
      return `<div class="ddi${i === state.active ? " act" : ""}" data-id="${p.id}" data-idx="${i}">
        <b>${p.g === "F" ? "\u2640 " : ""}${esc(p.nm)}</b>
        <em>${esc(fR(p.re))} · ${esc(p.dy || "?")} · ${esc(r.reason)}</em>
      </div>`;
    }).join("");
    dd.classList.add("open");

    dd.querySelectorAll(".ddi").forEach(el => {
      el.addEventListener("mouseenter", () => {
        state.active = Number(el.dataset.idx);
        applyActive();
      });
      el.addEventListener("mousedown", ev => {
        ev.preventDefault();
        choose(Number(el.dataset.idx));
      });
    });
  }

  sI.addEventListener("input", () => render(sI.value));
  sI.addEventListener("focus", () => render(sI.value));
  sI.addEventListener("keydown", e => {
    if (!dd.classList.contains("open") && (e.key === "ArrowDown" || e.key === "ArrowUp")) render(sI.value);
    if (!state.rows.length && e.key !== "Escape") return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.active = (state.active + 1) % state.rows.length;
      applyActive();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      state.active = (state.active - 1 + state.rows.length) % state.rows.length;
      applyActive();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      choose(state.active >= 0 ? state.active : 0);
      return;
    }
    if (e.key === "Escape") {
      dd.classList.remove("open");
      state.active = -1;
    }
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".swrap")) dd.classList.remove("open");
  });
}
