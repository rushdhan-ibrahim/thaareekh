export function cs(v) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
}

export function eC(e) {
  if (e.c === "i") return cs("--ei");
  if (e.c === "u") return cs("--eu");
  return cs({ parent: "--ep", sibling: "--es", spouse: "--esp", kin: "--ek" }[e.t] || "--ep");
}

export function nC(dy) {
  return cs("--dy-" + (dy || "unknown").toLowerCase()) || cs("--dy-unknown");
}
