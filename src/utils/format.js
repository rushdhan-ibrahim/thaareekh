export function fR(r) {
  if (!r) return '';
  return r.map(x => x[0] + "\u2013" + x[1]).join("; ");
}

export function esc(s) {
  return (s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
