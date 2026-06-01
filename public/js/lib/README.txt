Vendored libraries (pinned versions).

M4 deliverable: drop Chart.js 4.x UMD build here as `chart.umd.min.js`.
  Source: https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js
  License: MIT (open-source)

Vendored (not CDN-linked) so the partner-facing site is offline-safe and
version-locked. index.html already references js/lib/chart.umd.min.js.
