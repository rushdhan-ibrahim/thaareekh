import { computeTreePlacement } from './tree-placement-core.ts';
import type { TreePlacementInput } from './tree-placement-core.ts';

type TreePlacementRequest = {
  type: 'tree-placement-request';
  key: string;
  payload: TreePlacementInput;
};

const ctx = self as any;

ctx.addEventListener('message', (event: MessageEvent<TreePlacementRequest>) => {
  const msg = event.data;
  if (!msg || msg.type !== 'tree-placement-request' || !msg.key || !msg.payload) return;
  const startedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  try {
    const result = computeTreePlacement(msg.payload);
    const endedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    ctx.postMessage({
      type: 'tree-placement-result',
      key: msg.key,
      result,
      elapsedMs: Math.max(0, endedAt - startedAt)
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    ctx.postMessage({
      type: 'tree-placement-error',
      key: msg.key,
      error: message
    });
  }
});

export {};
