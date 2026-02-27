import { CONFIG } from "./config.js";
import { loadJson, loadCsv } from "./dataLoader.js";
import { setActiveNav } from "./navActive.js";
import { setState } from "./state.js";
import { scoreBadge } from "./utils.js";

let stations = [];
let summary = [];

function getF1(stationName) {
  const r = summary.find(x => x.station === stationName);
  return r ? Number(r.forecast_1m_ms) : 0;
}

async function init() {
  setActiveNav("map");
  stations = await loadJson(CONFIG.paths.stationsJson);
  summary = await loadCsv(CONFIG.paths.forecastsSummaryCsv);

  const map = L.map("map", { scrollWheelZoom:true }).setView([34.6, 71.6], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // markers
  stations.forEach(s => {
    const f1 = getF1(s.name);
    const badge = scoreBadge(f1);
    const marker = L.circleMarker([s.lat, s.lon], {
      radius: 9,
      weight: 2,
      color: "#0F172A",
      fillColor: badge.className === "good" ? "#22C55E" : badge.className === "mid" ? "#F59E0B" : "#EF4444",
      fillOpacity: 0.85
    }).addTo(map);

    marker.bindPopup(`
      <b>${s.name}</b><br/>
      Lead-1 forecast: ${f1.toFixed(3)} m/s<br/>
      Direction: ${s.direction_hint || "—"}<br/>
      <a href="station.html?station=${encodeURIComponent(s.name)}">Open station page</a>
    `);

    marker.on("click", () => {
      setState({ selectedStation: s.name, selectionMode: "station" });
    });
  });

  // heatmap intensity based on Lead-1 forecast (normalized)
  const values = stations.map(s => getF1(s.name));
  const max = Math.max(...values, 1);

  const heatPts = stations.map(s => [s.lat, s.lon, Math.max(0.1, getF1(s.name) / max)]);
  const heat = L.heatLayer(heatPts, { radius: 35, blur: 22, maxZoom: 10 }).addTo(map);

  document.getElementById("toggleHeat").addEventListener("change", (e) => {
    if (e.target.checked) heat.addTo(map);
    else map.removeLayer(heat);
  });
}

document.addEventListener("DOMContentLoaded", init);