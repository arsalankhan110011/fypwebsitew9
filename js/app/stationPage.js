import { CONFIG } from "./config.js";
import { loadJson, loadCsv } from "./dataLoader.js";
import { qs, formatDate, scoreBadge, turbineRecommendation } from "./utils.js";
import { setActiveNav } from "./navActive.js";
import { setState } from "./state.js";

let stations = [];
let summary = [];

function findSummary(name) { return summary.find(r => r.station === name); }

async function init() {
  setActiveNav("station");
  stations = await loadJson(CONFIG.paths.stationsJson);
  summary = await loadCsv(CONFIG.paths.forecastsSummaryCsv);

  const stationName = qs("station") || "Peshawar";
  const s = stations.find(x => x.name === stationName) || stations[0];
  const row = findSummary(s.name);

  setState({ selectedStation: s.name, selectionMode:"station" });

  document.getElementById("stationTitle").textContent = s.name;
  document.getElementById("coords").textContent = `${s.lat.toFixed(3)}, ${s.lon.toFixed(3)}`;
  document.getElementById("dir").textContent = s.direction_hint || "—";

  const f1 = Number(row.forecast_1m_ms), f3 = Number(row.forecast_3m_ms), f6 = Number(row.forecast_6m_ms);
  const b = scoreBadge(f1);
  const badge = document.getElementById("badge");
  badge.textContent = b.label;
  badge.className = `badge ${b.className}`;

  document.getElementById("f1").textContent = `${f1.toFixed(3)} m/s`;
  document.getElementById("f3").textContent = `${f3.toFixed(3)} m/s`;
  document.getElementById("f6").textContent = `${f6.toFixed(3)} m/s`;

  document.getElementById("d1").textContent = formatDate(row.date_1m);
  document.getElementById("d3").textContent = formatDate(row.date_3m);
  document.getElementById("d6").textContent = formatDate(row.date_6m);

  document.getElementById("rec").textContent = turbineRecommendation(f1);

  document.getElementById("goForecast").href = `forecast.html?station=${encodeURIComponent(s.name)}`;
  document.getElementById("goReport").href = `report.html?station=${encodeURIComponent(s.name)}`;
}

document.addEventListener("DOMContentLoaded", init);