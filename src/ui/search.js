import { rankSearch, reasonLabel } from './search-engine.js';
import { fR, esc } from '../utils/format.js';
import { goF } from './navigation.js';
import { personName, t } from './i18n.js';

export function initSearch() {
  const sI = document.getElementById("si");
  const dd = document.getElementById("dd");
  if (!sI || !dd) return;
  const MAX_RESULTS = 12;
  const state = { rows: [], active: -1 };
  let inputTimer = null;

  dd.setAttribute("role", "listbox");

  function applyActive() {
    const rows = dd.querySelectorAll(".ddi");
    rows.forEach((el, i) => {
      const active = i === state.active;
      el.classList.toggle("act", active);
      el.setAttribute("aria-selected", active ? "true" : "false");
      if (active) sI.setAttribute("aria-activedescendant", el.id);
    });
    if (state.active < 0) sI.removeAttribute("aria-activedescendant");
  }

  function choose(idx) {
    const r = state.rows[idx];
    if (!r) return;
    goF(r.person.id);
    dd.classList.remove("open");
    sI.removeAttribute("aria-activedescendant");
    sI.value = "";
    state.rows = [];
    state.active = -1;
  }

  function render(q) {
    if (!q.trim()) {
      dd.classList.remove("open");
      sI.removeAttribute("aria-activedescendant");
      state.rows = [];
      state.active = -1;
      return;
    }
    state.rows = rankSearch(q, MAX_RESULTS);
    state.active = state.rows.length ? 0 : -1;

    if (!state.rows.length) {
      dd.innerHTML = `<div class="dde">${esc(t('no_matches'))}</div>`;
      dd.classList.add("open");
      sI.removeAttribute("aria-activedescendant");
      return;
    }

    dd.innerHTML = state.rows.map((r, i) => {
      const p = r.person;
      return `<div class="ddi${i === state.active ? " act" : ""}" id="sr-opt-${i}" role="option" aria-selected="${i === state.active ? "true" : "false"}" data-id="${p.id}" data-idx="${i}">
        <b>${p.g === "F" ? "\u2640 " : ""}${esc(personName(p))}</b>
        <em>${esc(fR(p.re))} · ${esc(p.dy || "?")} · ${esc(reasonLabel(r.reason))}</em>
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

  sI.addEventListener("input", () => {
    if (inputTimer) clearTimeout(inputTimer);
    inputTimer = setTimeout(() => {
      inputTimer = null;
      render(sI.value);
    }, 80);
  });
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
      sI.removeAttribute("aria-activedescendant");
    }
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".swrap")) dd.classList.remove("open");
  });
}
