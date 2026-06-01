// calcEngine.js — Calculation Engine module (M2).
//
// PURE functions only: no DOM, no fetch, no Chart.js. Independently unit-testable.
// `assess()` transforms validated inputs + benchmarks + config into the results object
// consumed by uiController (numbers) and chartRenderer (charts A–F).
//
// results = {
//   metrics:     { grossRevenue, refundAmount, netRevenue,
//                  partnerPayout, blendedRate,
//                  marketingValue, totalValue,
//                  upfrontCost, peakMonthlyCost, month12Cost, cumulativeCost12 },
//   series:      { costOverTime: [{month, monthly, cumulative}], marketingMix: [{key,label,value,pct}] },
//   comparisons: { revenueWaterfall, payoutTiers, marketingChannels, totalValueStack },
// }

export function assess(inputs, benchmarks, config = {}) {
  const horizon = config.costHorizonMonths || 12;

  const revenue = computeRevenue(inputs);
  const payout  = computeTieredPayout(revenue.netRevenue, benchmarks.revShareTiers);
  const market  = computeMarketingValue(benchmarks.marketingChannels);
  const cost    = computeCostCurve(inputs, benchmarks.credits, horizon);

  const totalValue = round2(payout.partnerPayout + market.marketingValue);

  // Cost recovery: how much of the payout survives the first 12 months of credit
  // costs, and how many months the payout fully covers before cumulative cost catches up.
  const netCashToPartner = round2(payout.partnerPayout - cost.cumulativeCost);
  let coveredMonths = 0;
  for (const p of cost.series) {
    if (p.cumulative <= payout.partnerPayout) coveredMonths = p.month; else break;
  }
  const fullyCovered = cost.cumulativeCost <= payout.partnerPayout;

  return {
    metrics: {
      grossRevenue:     revenue.grossRevenue,
      refundAmount:     revenue.refundAmount,
      netRevenue:       revenue.netRevenue,
      partnerPayout:    payout.partnerPayout,
      blendedRate:      payout.blendedRate,
      marketingValue:   market.marketingValue,
      totalValue,
      upfrontCost:      cost.upfrontCost,
      peakMonthlyCost:  cost.peakMonthlyCost,
      month12Cost:      cost.lastMonthCost,
      cumulativeCost12: cost.cumulativeCost,
      netCashToPartner,
      coveredMonths,
      fullyCovered,
    },
    series: {
      costOverTime: cost.series,
      marketingMix: market.mix,
    },
    comparisons: {
      revenueWaterfall: buildWaterfall(revenue, payout),
      payoutTiers:      payout.tiers,
      marketingChannels: market.channels,           // sorted desc
      totalValueStack:  buildValueStack(payout, market),
    },
  };
}

// --- Revenue: gross - refunds = net -------------------------------------------
export function computeRevenue({ unitsSold, unitPrice, refundRate }) {
  const grossRevenue = round2(unitsSold * unitPrice);
  const refundAmount = round2(grossRevenue * refundRate);
  const netRevenue   = round2(grossRevenue - refundAmount);
  return { grossRevenue, refundAmount, netRevenue };
}

// --- Stepped rev-share over net revenue ---------------------------------------
export function computeTieredPayout(netRevenue, tiers) {
  const out = [];
  let partnerPayout = 0;
  for (const t of tiers) {
    const upper = t.to == null ? netRevenue : Math.min(t.to, netRevenue);
    const span  = Math.max(0, upper - t.from);
    const amount = round2(span * t.rate);
    if (span > 0) out.push({ tier: t.tier, rate: t.rate, from: t.from, to: t.to, span: round2(span), amount });
    partnerPayout += amount;
  }
  partnerPayout = round2(partnerPayout);
  const blendedRate = netRevenue > 0 ? partnerPayout / netRevenue : 0;
  return { partnerPayout, blendedRate, tiers: out };
}

// --- Marketing value: sum of 6 channel default valuations ---------------------
export function computeMarketingValue(channelDefs) {
  const channels = Object.entries(channelDefs)
    .map(([key, c]) => ({ key, label: c.label, value: c.defaultValue }))
    .sort((a, b) => b.value - a.value);
  const marketingValue = round2(channels.reduce((s, c) => s + c.value, 0));
  const mix = channels.map((c) => ({ ...c, pct: marketingValue ? c.value / marketingValue : 0 }));
  return { marketingValue, channels, mix };
}

// --- Credit cost curve: upfront + monthly geometric decline to -declineByM12 --
export function computeCostCurve({ activeUsers, upfrontCredits, monthlyCredits, costPerCredit }, credits, horizon) {
  const upfrontCost     = round2(activeUsers * upfrontCredits * costPerCredit);
  const peakMonthlyCost = round2(activeUsers * monthlyCredits * costPerCredit);

  // Geometric monthly decay so month `horizon` equals peak * (1 - declineByM12).
  const decline = credits.monthlyDeclineByM12 ?? 0;
  const decay = horizon > 1 ? Math.pow(1 - decline, 1 / (horizon - 1)) : 1;

  const series = [];
  let cumulative = upfrontCost;
  for (let m = 1; m <= horizon; m++) {
    const monthly = round2(peakMonthlyCost * Math.pow(decay, m - 1));
    cumulative = round2(cumulative + monthly);
    series.push({ month: m, monthly, cumulative });
  }
  return {
    upfrontCost,
    peakMonthlyCost,
    lastMonthCost: series[series.length - 1].monthly,
    cumulativeCost: series[series.length - 1].cumulative,
    series,
  };
}

// --- Chart shapes -------------------------------------------------------------
function buildWaterfall(revenue, payout) {
  return [
    { label: 'Gross Revenue',  value: revenue.grossRevenue, kind: 'total' },
    { label: 'Refunds',        value: -revenue.refundAmount, kind: 'decrease' },
    { label: 'Net Revenue',    value: revenue.netRevenue,    kind: 'subtotal' },
    { label: 'Partner Payout', value: payout.partnerPayout,  kind: 'result' },
  ];
}

function buildValueStack(payout, market) {
  return [
    { label: 'Partner Payout', value: payout.partnerPayout, key: 'payout' },
    ...market.channels.map((c) => ({ label: c.label, value: c.value, key: c.key })),
  ];
}

function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
