# Source Coverage Audit

Date: 2026-02-08  
Mode: research

## Snapshot
| Metric | Value |
|---|---|
| People | 187 |
| Edges | 471 |
| Registered sources | 72 |
| Edges with no evidence refs | 0 |
| Single-source edges | 390 |
| Multi-source edges | 81 |
| Single-source weak-quality edges (C/D/?) | 214 |

## Source quality distribution (registry)
| Quality | Count |
|---|---|
| A | 16 |
| B | 45 |
| C | 11 |
| D | 0 |
| ? | 0 |

## Edge evidence usage by source quality
| Quality | Claim references | Share |
|---|---|---|
| A | 8 | 1.4% |
| B | 335 | 59.4% |
| C | 221 | 39.2% |
| D | 0 | 0.0% |
| ? | 0 | 0.0% |

## Person source usage by source quality
| Quality | Person-source refs | Share |
|---|---|---|
| A | 15 | 8.8% |
| B | 148 | 86.5% |
| C | 8 | 4.7% |
| D | 0 | 0.0% |
| ? | 0 | 0.0% |

## Top edge evidence sources
| Source | Edge claim refs |
|---|---|
| SRC-DERIVED-RULES (C, derived-family-rules) | 214 |
| SRC-MRF-KINGS (B, maldivesroyalfamily.com) | 133 |
| SRC-WIKI-MONARCHS (B, en.wikipedia.org) | 52 |
| SRC-MRF-HILAALY (B, maldivesroyalfamily.com) | 23 |
| SRC-WIKI-IBRAHIM-NASIR (B, en.wikipedia.org) | 22 |
| SRC-WIKI-MAUMOON (B, en.wikipedia.org) | 12 |
| SRC-WIKI-MUIZZU (B, en.wikipedia.org) | 10 |
| SRC-MRF-MIDU-ROYAL (B, maldivesroyalfamily.com) | 7 |
| SRC-MRF-UTHEEM (B, maldivesroyalfamily.com) | 7 |
| SRC-WIKI-WAHEED (B, en.wikipedia.org) | 7 |
| SRC-WIKI-ABDUL-GAYOOM-IBRAHIM (B, en.wikipedia.org) | 6 |
| SRC-WIKI-NASHEED (B, en.wikipedia.org) | 6 |

## Top person-profile sources
| Source | Person refs |
|---|---|
| SRC-MRF-KINGS (B, maldivesroyalfamily.com) | 26 |
| SRC-WIKI-IBRAHIM-NASIR (B, en.wikipedia.org) | 14 |
| SRC-WIKI-MONARCHS (B, en.wikipedia.org) | 13 |
| SRC-MRF-HILAALY (B, maldivesroyalfamily.com) | 9 |
| SRC-WIKI-MAUMOON (B, en.wikipedia.org) | 8 |
| SRC-WIKI-MUIZZU (B, en.wikipedia.org) | 8 |
| SRC-WIKI-HEADS-STATE (C, en.wikipedia.org) | 6 |
| SRC-WIKI-MUHAMMAD-FAREED (B, en.wikipedia.org) | 6 |
| SRC-MRF-HURAA (B, maldivesroyalfamily.com) | 5 |
| SRC-MRF-UTHEEM (B, maldivesroyalfamily.com) | 5 |
| SRC-WIKI-WAHEED (B, en.wikipedia.org) | 5 |
| SRC-WIKI-NASHEED (B, en.wikipedia.org) | 4 |

## Domain concentration (source registry)
| Domain | Sources | Share |
|---|---|---|
| en.wikipedia.org | 30 | 41.7% |
| presidency.gov.mv | 9 | 12.5% |
| maldivesroyalfamily.com | 7 | 9.7% |
| saruna.mnu.edu.mv | 4 | 5.6% |
| edition.mv | 3 | 4.2% |
| royalark.net | 2 | 2.8% |
| persee.fr | 2 | 2.8% |
| archives.gov.mv | 2 | 2.8% |
| tufs.repo.nii.ac.jp | 2 | 2.8% |
| derived-family-rules | 1 | 1.4% |
| atolltimes.mv | 1 | 1.4% |
| openlibrary.org | 1 | 1.4% |

## Dynasty-level person coverage gaps
| Dynasty | People | With source_refs | Missing source_refs | With aliases | With titles |
|---|---|---|---|---|---|
| Hilaaly | 40 | 14 | 26 | 13 | 5 |
| Lunar | 30 | 4 | 26 | 0 | 3 |
| Huraagey | 24 | 14 | 10 | 10 | 10 |
| Unknown | 6 | 1 | 5 | 0 | 0 |
| Utheemu | 12 | 8 | 4 | 6 | 4 |
| Dhiyamigili | 5 | 2 | 3 | 1 | 1 |
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
