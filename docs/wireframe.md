# UI Wireframe — Main Screen (approved)

```
┌────────────────────────────────────────────────────────────────────────┐
│  [logo]  Business Value Assessment — [Partner]   [Preset▾] [Export⤓]     │ Header
├────────────────────────────────────────────────────────────────────────┤
│  KPI CARDS — full width, 4 across                                        │
│  [ Net Revenue ] [ Partner Payout ] [ Marketing Value ] [ TOTAL VALUE ]  │
├──────────────────────┬─────────────────────────────────────────────────┤
│ INPUT PANEL (~30%)   │  ACT 1 · REVENUE & COST (~70%)                    │
│  Campaign            │  [A] Waterfall        [B] Tiered payout bar       │
│  Rev-Share Tiers     │  [C] Cost-over-time line (wide)                   │
│  Credit Costs        │                                                   │
│  Mktg Assumptions    │   (input panel spans Act 1 ONLY)                  │
│  [Calculate][Reset]  │                                                   │
├──────────────────────┴─────────────────────────────────────────────────┤
│  ACT 2 · MARKETING VALUE — FULL WIDTH                                    │
│  [D] 6-channel ranked horizontal bar     [E] Marketing-mix doughnut      │
│  [ 6 channel detail cards across ]                                       │
├──────────────────────────────────────────────────────────────────────────┤
│  ACT 3 · TOTAL PARTNERSHIP VALUE — FULL WIDTH                            │
│  [F] Horizontal stacked value bar → $207,890+  "$0 upfront mktg spend"   │
│  Assumptions & methodology (collapsible)                                 │
├──────────────────────────────────────────────────────────────────────────┤
│  Footer: methodology · sources · version · generated date                │
└──────────────────────────────────────────────────────────────────────────┘
```

Responsive: < 1024px the Act-1 two-column split collapses to single column;
KPI row and Acts 2/3 are already full width. CSS-grid implementation in `layout.css`.
