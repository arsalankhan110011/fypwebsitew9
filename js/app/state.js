const KEY = "windcast_state_v1";

export function getState() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function setState(partial) {
  const prev = getState();
  const next = { ...prev, ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}