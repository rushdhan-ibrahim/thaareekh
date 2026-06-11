import { computeTreePlacement } from './tree-placement-core.js';

self.addEventListener('message', event => {
  const msg = event.data;
  if (!msg || msg.type !== 'tree-placement-request' || !msg.key || !msg.payload) return;
  const startedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  try {
    const result = computeTreePlacement(msg.payload);
    const endedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    self.postMessage({
      type: 'tree-placement-result',
      key: msg.key,
      result,
      elapsedMs: Math.max(0, endedAt - startedAt)
    });
  } catch (err) {
    self.postMessage({
      type: 'tree-placement-error',
      key: msg.key,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});
