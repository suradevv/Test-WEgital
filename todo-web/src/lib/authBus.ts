type Handler = () => void;
const subs = new Set<Handler>();

export function onUnauthorized(h: Handler): () => void {
  subs.add(h);
  return () => { subs.delete(h); };
}

export function triggerUnauthorized() {
  subs.forEach(h => h());
}