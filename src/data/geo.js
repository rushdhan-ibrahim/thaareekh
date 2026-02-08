const RAW_ANCHORS = [
  { id: 'MALE', en: 'Male', dv: 'މާލެ', x: 228, y: 96, aliases: ['male', 'male city', 'malé', 'male'] },
  { id: 'UTHEEMU', en: 'Utheemu', dv: 'އުތީމު', x: 212, y: 44, aliases: ['utheemu'] },
  { id: 'ISDHOO', en: 'Isdhoo', dv: 'އިސްދޫ', x: 236, y: 132, aliases: ['isdhoo', 'isdhu'] },
  { id: 'FUVAHMULAH', en: 'Fuvahmulah', dv: 'ފުވައްމުލަށް', x: 224, y: 196, aliases: ['fuvahmulah', 'fuvamulah'] },
  { id: 'ADDU', en: 'Addu', dv: 'އައްޑޫ', x: 216, y: 220, aliases: ['addu', 'hithadhoo', 'meedhoo', 'midu'] },
  { id: 'GOA', en: 'Goa', dv: 'ގޯއާ', x: 56, y: 80, aliases: ['goa'] },
  { id: 'MALDIVES', en: 'Maldives', dv: 'ދިވެހިރާއްޖެ', x: 224, y: 126, aliases: ['maldives', 'dives'] }
];

function norm(v) {
  return (v || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escReg(v) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const placeAnchors = RAW_ANCHORS.map(a => ({
  ...a,
  aliasesNorm: (a.aliases || []).map(norm).filter(Boolean)
}));

function matchesAlias(textNorm, aliasNorm) {
  if (!textNorm || !aliasNorm) return false;
  const rg = new RegExp(`(?:^|\\b)${escReg(aliasNorm)}(?:$|\\b)`, 'i');
  return rg.test(textNorm);
}

export function resolvePlace(raw) {
  const txt = norm(raw);
  if (!txt) return null;
  for (const anchor of placeAnchors) {
    if (anchor.aliasesNorm.some(a => matchesAlias(txt, a))) return anchor;
  }
  return null;
}

export function extractPlaceMentions(raw) {
  const txt = norm(raw);
  if (!txt) return [];
  return placeAnchors.filter(anchor => anchor.aliasesNorm.some(a => matchesAlias(txt, a)));
}

export function placeLabelForLang(anchorOrId, lang = 'en') {
  const anchor = typeof anchorOrId === 'string'
    ? placeAnchors.find(a => a.id === anchorOrId)
    : anchorOrId;
  if (!anchor) return '';
  return lang === 'dv' ? (anchor.dv || anchor.en) : anchor.en;
}

export { placeAnchors };
