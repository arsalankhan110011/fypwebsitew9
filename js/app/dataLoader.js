export async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load JSON: " + path);
  return await res.json();
}

// Lightweight CSV parser (handles your simple CSVs)
export async function loadCsv(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load CSV: " + path);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = line.split(",").map(c => c.trim());
    const row = {};
    headers.forEach((h, i) => row[h] = cols[i]);
    return row;
  });
}