// js/app/dataPage.js
import { CONFIG } from "./config.js";
import { loadJson } from "./dataLoader.js";

async function init() {
  try {
    const stations = await loadJson(CONFIG.paths.stationsJson);
    const body = document.getElementById("stationsBody");
    body.innerHTML = "";

    stations.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><b>${s.name}</b></td>
        <td>${Number(s.lat).toFixed(3)}</td>
        <td>${Number(s.lon).toFixed(3)}</td>
        <td>${s.direction_hint || "—"}</td>
      `;
      body.appendChild(tr);
    });
  } catch (e) {
    const body = document.getElementById("stationsBody");
    body.innerHTML = `<tr><td colspan="4" class="muted">Failed to load station list.</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", init);