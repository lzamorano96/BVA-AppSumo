# Data Dictionary

## Inputs (input-schema.json)
| Field | Type | Default | Notes |
|---|---|---|---|
| unitsSold | integer | 1500 | units sold in campaign |
| unitPrice | number | 89 | price per unit (USD) |
| refundRate | percent | 0.15 | est. refund fraction |
| costPerCredit | number | 0.12 | credit unit cost |
| upfrontCredits | integer | 100 | credits/user at launch |
| monthlyCredits | integer | 25 | credits/user/month |
| activeUsers | integer | 1500 | active user count |

## Benchmarks (benchmarks.json)
- `marketingChannels` — 6 channels, each: label + reach/rate metric + defaultValue.
- `revShareTiers` — stepped rev-share (25% / 30% / 40%).
- `credits` — cost-per-credit + upfront/monthly credit assumptions.

## Outputs (calcEngine results object)
| Path | Meaning | Feeds |
|---|---|---|
| metrics.netRevenue | gross − refunds | KPI |
| metrics.partnerPayout | tiered rev-share total | KPI, [B] |
| metrics.blendedRate | effective payout % | [B] label |
| metrics.marketingValue | sum of 6 channels | KPI, [E] |
| metrics.totalValue | payout + marketingValue | KPI, [F] |
| series.costOverTime | 12-month cost array | [C] |
| series.marketingMix | channel % of total | [E] |
| comparisons.revenueWaterfall | gross→refunds→net→payout | [A] |
| comparisons.payoutTiers | T1/T2/T3 amounts | [B] |
| comparisons.marketingChannels | 6 channels ranked | [D] |
| comparisons.totalValueStack | payout + 6 layers | [F] |
