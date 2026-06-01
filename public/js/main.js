// main.js — App bootstrap & controller.
// Owns the single app-state object and routes data: ingest -> calc -> render.
// Holds NO business formulas and NO chart config.

import { loadData, loadPreset, readInputs, validate } from './modules/dataIngestion.js';
import { assess } from './modules/calcEngine.js';
import * as ui from './modules/uiController.js';
import { renderAll } from './modules/chartRenderer.js';
import { initExport, decodeStateFromUrl, syncUrl } from './modules/exporter.js';

const PRESETS = [
  { value: 'saas', label: 'SaaS — reference example' },
  { value: 'ecommerce', label: 'E-commerce — sample' },
];

const state = { config: null, benchmarks: null, schema: null, inputs: null, results: null };

async function bootstrap() {
  const { config, benchmarks, schema } = await loadData();
  Object.assign(state, { config, benchmarks, schema });

  ui.initFormat(config);
  ui.fillPresetOptions(PRESETS);
  ui.paintAssumptions(benchmarks);

  ui.bindInputs(schema, {
    onChange: recalc,
    onReset: () => applyDefaults(),
    onPreset: (name) => loadScenario(name),
  });

  initExport(() => state.inputs);

  // Restore from a shared URL if present; otherwise load the reference preset.
  const fromUrl = decodeStateFromUrl();
  if (fromUrl) {
    ui.fillInputs(fromUrl);
    recalc();
  } else {
    await loadScenario(PRESETS[0].value);
  }
  console.info('[BVA] M5 ready (charts + export).');
}

/** Read DOM -> validate -> calc -> paint. Charts wired at M4. */
function recalc() {
  const { inputs, errors } = readInputs(state.schema);
  const hasErrors = ui.showErrors(errors);
  if (hasErrors) return;

  state.inputs = inputs;
  state.results = assess(inputs, state.benchmarks, state.config);
  ui.paintKpis(state.results);
  ui.paintChannelCards(state.results, state.benchmarks);
  renderAll(state.results);
  syncUrl(state.inputs);
}

async function loadScenario(name) {
  try {
    const preset = await loadPreset(name);
    ui.fillInputs(preset.inputs);
    recalc();
  } catch (e) {
    ui.setStatus(`Could not load preset "${name}".`, 'error');
    console.error(e);
  }
}

function applyDefaults() {
  const defaults = {};
  for (const [k, rule] of Object.entries(state.schema.fields)) {
    if (rule.default !== undefined) defaults[k] = k === 'refundRate' ? rule.default : rule.default;
  }
  ui.fillInputs(defaults);
  recalc();
}

document.addEventListener('DOMContentLoaded', bootstrap);
