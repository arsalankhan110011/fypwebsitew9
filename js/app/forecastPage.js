import { CONFIG } from "./config.js";
import { loadCsv } from "./dataLoader.js";
import { qs, formatDate } from "./utils.js";
import { setActiveNav } from "./navActive.js";
import { setState } from "./state.js";

let longRows = [];
let stations = [];

function rowsForStation(name) {
  return longRows.filter(r => r.station === name).sort((a,b) => Number(a.lead_months)-Number(b.lead_months));
}

function fillStations(selectEl) {
  selectEl.innerHTML = stations.map(s => `<option value="${s}">${s}</option>`).join("");
}

function render(name) {
  setState({ selectedStation:name, selectionMode:"station" });

  const rows = rowsForStation(name);
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.station}</td>
      <td>${r.lead_months}</td>
      <td>${formatDate(r.date)}</td>
      <td><b>${Number(r.forecast_ms).toFixed(3)}</b> m/s</td>
    `;
    tbody.appendChild(tr);
  });

  // chart: lead vs forecast
  const labels = rows.map(r => `Lead ${r.lead_months}`);
  const data = rows.map(r => Number(r.forecast_ms));

  const ctx = document.getElementById("chart");
  if (window.__chart) window.__chart.destroy();
  window.__chart = new Chart(ctx, {
    type:"bar",
    data:{ labels, datasets:[{ label:"Forecast (m/s)", data }] },
    options:{
      responsive:true,
      plugins:{ legend:{ display:true } },
      scales:{ y:{ title:{ display:true, text:"m/s" } } }
    }
  });

  document.getElementById("toStation").href = `station.html?station=${encodeURIComponent(name)}`;
  document.getElementById("toReport").href = `report.html?station=${encodeURIComponent(name)}`;
}

async function init() {
  setActiveNav("forecast");

  longRows = await loadCsv(CONFIG.paths.forecastsLongCsv);
  stations = Array.from(new Set(longRows.map(r => r.station))).sort();

  const select = document.getElementById("stationSelect");
  fillStations(select);

  const initial = qs("station") || stations[0];
  select.value = initial;
  render(initial);

  select.addEventListener("change", (e) => render(e.target.value));
}

document.addEventListener("DOMContentLoaded", init);