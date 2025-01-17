export function saveLocal(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocal(key: string) {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
}

export function removeLocal(key: string) {
  localStorage.removeItem(key);
}

export function clearLocal() {
  localStorage.clear();
}
