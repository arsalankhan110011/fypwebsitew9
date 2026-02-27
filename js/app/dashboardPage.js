import { CONFIG } from "./config.js";
import { $, formatDate, scoreBadge, turbineRecommendation } from "./utils.js";
import { getState, setState } from "./state.js";
import { getUserLocation, nearestStation } from "./geo.js";
import { loadJson, loadCsv } from "./dataLoader.js";
import { setActiveNav } from "./navActive.js";

let stations = [];
let summary = [];

function findSummary(stationName) {
  return summary.find(r => r.station === stationName);
}

function fillStations(selectEl) {
  selectEl.innerHTML = stations.map(s => `<option value="${s.name}">${s.name}</option>`).join("");
}

function render(stationName, modeLabel = "Station selected") {
  const s = stations.find(x => x.name === stationName);
  const row = findSummary(stationName);
  if (!s || !row) return;

  const f1 = Number(row.forecast_1m_ms);
  const f3 = Number(row.forecast_3m_ms);
  const f6 = Number(row.forecast_6m_ms);

  const badge = scoreBadge(f1);

  $("#selectedStation").textContent = stationName;
  $("#modeLabel").textContent = modeLabel;
  $("#badge").textContent = badge.label;
  $("#badge").className = `badge ${badge.className}`;

  $("#f1").textContent = `${f1.toFixed(3)} m/s`;
  $("#f3").textContent = `${f3.toFixed(3)} m/s`;
  $("#f6").textContent = `${f6.toFixed(3)} m/s`;

  $("#d1").textContent = formatDate(row.date_1m);
  $("#d3").textContent = formatDate(row.date_3m);
  $("#d6").textContent = formatDate(row.date_6m);

  $("#dir").textContent = s.direction_hint || "—";
  $("#rec").textContent = turbineRecommendation(f1);

  // Update links
  $("#openStation").href = `station.html?station=${encodeURIComponent(stationName)}`;
  $("#openForecast").href = `forecast.html?station=${encodeURIComponent(stationName)}`;
  $("#openReport").href = `report.html?station=${encodeURIComponent(stationName)}`;
}

async function onUseMyLocation() {
  $("#locStatus").textContent = "Getting your location…";
  try {
    const loc = await getUserLocation();
    setState({ userLocation: loc });

    const near = nearestStation(loc.lat, loc.lon, stations);
    if (!near) throw new Error("No station found");
    const name = near.station.name;

    setState({ selectedStation: name, selectionMode: "nearest", nearestDistanceKm: near.distanceKm });
    $("#locStatus").textContent = `Nearest station: ${name} (~${near.distanceKm.toFixed(1)} km).`;
    render(name, `Nearest station (~${near.distanceKm.toFixed(1)} km)`);
    $("#stationSelect").value = name;
  } catch (e) {
    $("#locStatus").textContent = "Location failed or permission denied.";
  }
}

async function init() {
  setActiveNav("dashboard");
  stations = await loadJson(CONFIG.paths.stationsJson);
  summary  = await loadCsv(CONFIG.paths.forecastsSummaryCsv);

  fillStations($("#stationSelect"));

  const st = getState();
  const defaultStation = st.selectedStation || stations[0]?.name || "Peshawar";
  $("#stationSelect").value = defaultStation;

  render(defaultStation, st.selectionMode === "nearest" && st.nearestDistanceKm
    ? `Nearest station (~${Number(st.nearestDistanceKm).toFixed(1)} km)`
    : "Station selected"
  );

  $("#stationSelect").addEventListener("change", (e) => {
    const name = e.target.value;
    setState({ selectedStation: name, selectionMode: "station" });
    render(name, "Station selected");
  });

  $("#useLocation").addEventListener("click", onUseMyLocation);
}

document.addEventListener("DOMContentLoaded", init);