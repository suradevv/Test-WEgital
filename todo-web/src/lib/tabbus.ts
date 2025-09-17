export const tabBus = new BroadcastChannel('todos');

export function sendCreated(item: any) {
  tabBus.postMessage({ type: 'created', payload: item });
}
export function sendUpdated(item: any) {
  tabBus.postMessage({ type: 'updated', payload: item });
}
export function sendDeleted(id: string) {
  tabBus.postMessage({ type: 'deleted', payload: id });
}
