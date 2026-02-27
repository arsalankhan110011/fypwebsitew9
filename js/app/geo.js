export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function nearestStation(userLat, userLon, stations) {
  let best = null;
  let bestKm = Infinity;
  for (const s of stations) {
    const km = haversineKm(userLat, userLon, s.lat, s.lon);
    if (km < bestKm) { bestKm = km; best = s; }
  }
  return best ? { station: best, distanceKm: bestKm } : null;
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy:true, timeout:10000 }
    );
  });
}