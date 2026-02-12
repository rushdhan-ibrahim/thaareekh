# Source Coverage Audit

Date: 2026-02-10  
Mode: research

## Snapshot
| Metric | Value |
|---|---|
| People | 210 |
| Edges | 627 |
| Registered sources | 106 |
| Edges with no evidence refs | 0 |
| Single-source edges | 531 |
| Multi-source edges | 96 |
| Single-source weak-quality edges (C/D/?) | 317 |

## Source quality distribution (registry)
| Quality | Count |
|---|---|
| A | 27 |
| B | 64 |
| C | 15 |
| D | 0 |
| ? | 0 |

## Edge evidence usage by source quality
| Quality | Claim references | Share |
|---|---|---|
| A | 19 | 2.6% |
| B | 396 | 53.6% |
| C | 324 | 43.8% |
| D | 0 | 0.0% |
| ? | 0 | 0.0% |

## Person source usage by source quality
| Quality | Person-source refs | Share |
|---|---|---|
| A | 26 | 12.8% |
| B | 168 | 82.8% |
| C | 9 | 4.4% |
| D | 0 | 0.0% |
| ? | 0 | 0.0% |

## Top edge evidence sources
| Source | Edge claim refs |
|---|---|
| SRC-DERIVED-RULES (C, derived-family-rules) | 317 |
| SRC-MRF-KINGS (B, maldivesroyalfamily.com) | 148 |
| SRC-WIKI-MONARCHS (B, en.wikipedia.org) | 51 |
| SRC-ROYALARK-MALDIVES (B, royalark.net) | 27 |
| SRC-MRF-HILAALY (B, maldivesroyalfamily.com) | 27 |
| SRC-WIKI-IBRAHIM-NASIR (B, en.wikipedia.org) | 22 |
| SRC-ROYALARK-M16 (B, royalark.net) | 12 |
| SRC-WIKI-MAUMOON (B, en.wikipedia.org) | 12 |
| SRC-MRF-UTHEEM (B, maldivesroyalfamily.com) | 10 |
| SRC-WIKI-MUIZZU (B, en.wikipedia.org) | 10 |
| SRC-MRF-MIDU-ROYAL (B, maldivesroyalfamily.com) | 7 |
| SRC-WIKI-WAHEED (B, en.wikipedia.org) | 7 |

## Top person-profile sources
| Source | Person refs |
|---|---|
| SRC-MRF-KINGS (B, maldivesroyalfamily.com) | 32 |
| SRC-WIKI-MONARCHS (B, en.wikipedia.org) | 17 |
| SRC-WIKI-IBRAHIM-NASIR (B, en.wikipedia.org) | 14 |
| SRC-MRF-HILAALY (B, maldivesroyalfamily.com) | 9 |
| SRC-WIKI-MAUMOON (B, en.wikipedia.org) | 8 |
| SRC-WIKI-MUIZZU (B, en.wikipedia.org) | 8 |
| SRC-WIKI-HEADS-STATE (C, en.wikipedia.org) | 7 |
| SRC-ROYALARK-MALDIVES (B, royalark.net) | 7 |
| SRC-MRF-HURAA (B, maldivesroyalfamily.com) | 6 |
| SRC-WIKI-MUHAMMAD-FAREED (B, en.wikipedia.org) | 6 |
| SRC-IBN-BATTUTA-RIHLA (A, archive.org) | 5 |
| SRC-HAKLUYT-IBN-BATTUTA-V4 (A, archive.org) | 5 |

## Domain concentration (source registry)
| Domain | Sources | Share |
|---|---|---|
| en.wikipedia.org | 31 | 29.2% |
| maldivesroyalfamily.com | 9 | 8.5% |
| presidency.gov.mv | 9 | 8.5% |
| royalark.net | 4 | 3.8% |
| search.worldcat.org | 4 | 3.8% |
| saruna.mnu.edu.mv | 4 | 3.8% |
| archive.org | 4 | 3.8% |
| edition.mv | 3 | 2.8% |
| maritimeasiaheritage.cseas.kyoto-u.ac.jp | 3 | 2.8% |
| unknown | 3 | 2.8% |
| persee.fr | 2 | 1.9% |
| openlibrary.org | 2 | 1.9% |

## Dynasty-level person coverage gaps
| Dynasty | People | With source_refs | Missing source_refs | With aliases | With titles |
|---|---|---|---|---|---|
| Hilaaly | 54 | 17 | 37 | 13 | 5 |
| Lunar | 36 | 10 | 26 | 0 | 3 |
| Huraagey | 25 | 16 | 9 | 10 | 10 |
| Utheemu | 14 | 9 | 5 | 6 | 4 |
| Unknown | 6 | 2 | 4 | 0 | 0 |
| Dhiyamigili | 5 | 3 | 2 | 1 | 1 |
| Isdu | 3 | 1 | 2 | 0 | 0 |
| Devadu | 1 | 0 | 1 | 0 | 0 |
| Modern | 56 | 56 | 0 | 25 | 16 |
| Addu Line | 6 | 6 | 0 | 4 | 3 |
| Dhiyamigili-South | 3 | 3 | 0 | 2 | 3 |
| Isdu-Linked | 1 | 1 | 0 | 1 | 1 |

## Immediate risk flags
- High concentration in rule-derived evidence and a small set of specialist secondary sources.
- Early dynasties (especially Lunar and Hilaaly) still have large source coverage gaps at person level.
- Most edge claims are still single-source; corroboration is the priority for high-visibility bridges.
