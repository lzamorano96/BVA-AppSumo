# Business Value Assessment Calculator — Project Plan

> Pre-implementation blueprint. Root folder: **Business Value Assessment Claude** (AppSumo Work Downloads space → local dedicated project dir). Deploy target: **Firebase Hosting** (static, serves `public/` only).

## Charting & stack decisions
- **Chart.js 4.x** (MIT, vendored in `public/js/lib/`) — bar / line / doughnut / stacked.
- Vanilla HTML/CSS/JS, **no bundler** — deploys to Firebase Hosting as-is.
- **JSON** for config, benchmarks, schema, presets.

## Modules (see each file header for detail)
| Module | File | Responsibility |
|---|---|---|
| Data Ingestion | `public/js/modules/dataIngestion.js` | fetch + parse JSON, validate inputs vs schema. ONLY module that fetches. |
| Calculation Engine | `public/js/modules/calcEngine.js` | PURE math → results object. No DOM/fetch/charts. |
| UI Controller | `public/js/modules/uiController.js` | bind inputs, format, paint KPI/channel cards, states. |
| Chart Rendering | `public/js/modules/chartRenderer.js` | ONLY module using Chart.js. create/update-in-place/destroy. |
| Exporter | `public/js/modules/exporter.js` | PDF / PNG / shareable URL. |
| Bootstrap | `public/js/main.js` | orchestrates ingest → calc → render; owns single state. |

## Wireframe (approved)
Full-width KPI cards → **Act 1** Revenue & Cost (two-column: input panel + charts A/B/C)
→ **Act 2** Marketing Value (FULL WIDTH: charts D/E + 6 channel cards)
→ **Act 3** Total Partnership Value (FULL WIDTH: stacked value bar F).
Input panel spans Act 1 only; Acts 2 & 3 break out to full page width.
See `wireframe.md`.

## Charts → real AppSumo categories
- **[A]** revenue waterfall: gross → −refunds → net → partner payout
- **[B]** tiered rev-share stacked bar → $32,890 (blended 29%)
- **[C]** 12-month cost decline: upfront $7,800 · peak M1 $2,066 · M12 $1,150
- **[D]** 6 marketing channels ranked (Reviews $52.5k → Community $7.5k)
- **[E]** marketing-value doughnut (mix % of $175k)
- **[F]** total value stack: payout + 6 marketing layers → $207,890+

## Milestones
| # | Milestone | Target |
|---|---|---|
| M0 | Scaffold (this) | 2026-06-03 |
| M1 | Data layer | 2026-06-08 |
| M2 | Calculation engine | 2026-06-12 |
| M3 | UI shell + styles | 2026-06-17 |
| M4 | Chart integration | 2026-06-23 |
| M5 | Wiring + export | 2026-06-26 |
| M6 | Firebase deploy | 2026-06-30 |
| M7 | Partner-ready polish | 2026-07-03 |

_Full checklist lives in the conversation plan; this file is the in-repo reference._
