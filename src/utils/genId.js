export function genId(prefix) {
  return `${prefix}_${Date.now().toString(36).toUpperCase()}`;
}
