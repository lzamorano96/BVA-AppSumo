# Data Flow

```
STAGE 1 — INGESTION  [dataIngestion.js]
  data/*.json (config, benchmarks, schema, presets) --fetch-->
  + user form inputs (DOM)
  -> parse, validate vs input-schema.json, coerce types
  => { inputs, benchmarks, config }   (validated state)

STAGE 2 — CALCULATION  [calcEngine.js]  (pure)
  net revenue (gross − refunds), tiered payout, 12-mo cost curve,
  6-channel marketing value, total value rollup
  => { metrics, series, comparisons }   (results object)

STAGE 3a — NUMERIC RENDER  [uiController.js]    STAGE 3b — CHART RENDER  [chartRenderer.js]
  format + paint KPI & channel cards            map results -> Chart.js datasets
                                                create-or-update charts A–F (no flicker)

STAGE 4 — VISUAL OUTPUT  (index.html)
  KPI cards + [A][B][C] (Act 1) + [D][E] (Act 2) + [F] (Act 3)
  -> [exporter.js] PDF / PNG / shareable URL

LOOP: any input change -> main.js re-runs Stage 1→2→3 (debounced ~250ms).
      Charts UPDATE in place, never destroy/recreate.
```

Guarantees: unidirectional flow; single state owner (`main.js`); validation gate
before calc; `calcEngine` is the only place math lives; `chartRenderer` the only
Chart.js consumer; `dataIngestion` the only fetch caller.
