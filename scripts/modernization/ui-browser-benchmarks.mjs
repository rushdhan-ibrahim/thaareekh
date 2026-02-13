#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx] ?? 0;
}

function summarize(values) {
  if (!values.length) {
    return { samples: 0, mean: 0, p95: 0, min: 0, max: 0 };
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    samples: values.length,
    mean: total / values.length,
    p95: percentile(values, 95),
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

function toMs(value) {
  return Number(value.toFixed(3));
}

function roundStats(stats) {
  return {
    samples: stats.samples,
    mean: toMs(stats.mean),
    p95: toMs(stats.p95),
    min: toMs(stats.min),
    max: toMs(stats.max)
  };
}

function sleep(ms) {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, ms);
  });
}

async function waitFor(check, timeoutMs, intervalMs = 80) {
  const started = performance.now();
  while (performance.now() - started < timeoutMs) {
    // eslint-disable-next-line no-await-in-loop
    const value = await check();
    if (value) return value;
    // eslint-disable-next-line no-await-in-loop
    await sleep(intervalMs);
  }
  return null;
}

function findChromeBinary() {
  return CHROME_CANDIDATES.find((path) => existsSync(path)) ?? null;
}

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.socket = null;
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = [];
  }

  async connect() {
    await new Promise((resolvePromise, rejectPromise) => {
      const socket = new WebSocket(this.webSocketUrl);
      this.socket = socket;
      socket.addEventListener('open', () => resolvePromise());
      socket.addEventListener('message', (event) => this.handleMessage(String(event.data)));
      socket.addEventListener('error', (event) => {
        rejectPromise(new Error(`CDP websocket error: ${String(event?.message ?? 'unknown')}`));
      });
      socket.addEventListener('close', () => {
        const err = new Error('CDP websocket closed unexpectedly.');
        for (const { reject } of this.pending.values()) {
          reject(err);
        }
        this.pending.clear();
      });
    });
  }

  close() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  handleMessage(raw) {
    let message;
    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }

    if (typeof message.id === 'number') {
      const entry = this.pending.get(message.id);
      if (!entry) return;
      this.pending.delete(message.id);
      if (message.error) {
        entry.reject(
          new Error(
            `CDP command failed (${entry.method}): ${message.error.message ?? 'unknown error'}`
          )
        );
        return;
      }
      entry.resolve(message.result ?? {});
      return;
    }

    if (!message.method) return;
    const retained = [];
    for (const waiter of this.waiters) {
      const methodMatch = waiter.method === message.method;
      const sessionMatch = waiter.sessionId == null || waiter.sessionId === message.sessionId;
      if (methodMatch && sessionMatch) {
        waiter.resolve(message);
      } else {
        retained.push(waiter);
      }
    }
    this.waiters = retained;
  }

  send(method, params = {}, sessionId = null, timeoutMs = 15000) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(`CDP socket is not open for command ${method}.`));
    }
    const id = this.nextId;
    this.nextId += 1;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolvePromise, rejectPromise) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        rejectPromise(new Error(`CDP command timeout (${method}).`));
      }, timeoutMs);
      this.pending.set(id, {
        method,
        resolve: (value) => {
          clearTimeout(timer);
          resolvePromise(value);
        },
        reject: (err) => {
          clearTimeout(timer);
          rejectPromise(err);
        }
      });
      this.socket.send(JSON.stringify(payload));
    });
  }

  waitForEvent(method, sessionId = null, timeoutMs = 15000) {
    return new Promise((resolvePromise, rejectPromise) => {
      const timer = setTimeout(() => {
        this.waiters = this.waiters.filter((entry) => entry.resolve !== resolvePromise);
        rejectPromise(new Error(`CDP event timeout (${method}).`));
      }, timeoutMs);
      this.waiters.push({
        method,
        sessionId,
        resolve: (value) => {
          clearTimeout(timer);
          resolvePromise(value);
        }
      });
    });
  }
}

function evaluateExpr(client, sessionId, expression, timeoutMs = 20000) {
  return client.send(
    'Runtime.evaluate',
    {
      expression,
      awaitPromise: true,
      returnByValue: true
    },
    sessionId,
    timeoutMs
  );
}

async function runLegacyUiScenario(client, sessionId, targetUrl) {
  const loadPromise = client.waitForEvent('Page.loadEventFired', sessionId, 20000);
  await client.send('Page.navigate', { url: targetUrl }, sessionId, 20000);
  await loadPromise;
  const result = await evaluateExpr(
    client,
    sessionId,
    `(async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const waitFor = async (predicate, timeoutMs = 14000) => {
        const start = performance.now();
        while (performance.now() - start < timeoutMs) {
          if (predicate()) return true;
          await sleep(80);
        }
        return false;
      };

      const ready = await waitFor(() => {
        const svg = document.getElementById('sv');
        const graphGroup = document.querySelector('#sv .gg');
        return Boolean(svg && graphGroup);
      });

      if (!ready) {
        return { status: 'unavailable', reason: 'legacy_graph_not_ready' };
      }

      const nav = performance.getEntriesByType('navigation')[0];
      const boot = {
        dom_content_loaded_ms: Number(nav?.domContentLoadedEventEnd ?? 0),
        load_event_ms: Number(nav?.loadEventEnd ?? 0)
      };

      const firstInteractionSamples = [];
      const panelToggle = document.getElementById('fp');
      if (panelToggle instanceof HTMLElement) {
        for (let i = 0; i < 18; i += 1) {
          const t0 = performance.now();
          panelToggle.click();
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
          firstInteractionSamples.push(performance.now() - t0);
          panelToggle.click();
          await new Promise(requestAnimationFrame);
        }
      }

      const filterSamples = [];
      const panel = document.getElementById('filterPanel');
      const chip = document.querySelector('[data-cf="i"]');
      if (panelToggle instanceof HTMLElement && chip instanceof HTMLElement) {
        if (!panel?.classList.contains('open')) {
          panelToggle.click();
          await new Promise(requestAnimationFrame);
        }
        for (let i = 0; i < 20; i += 1) {
          const t0 = performance.now();
          chip.click();
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
          filterSamples.push(performance.now() - t0);
          chip.click();
          await new Promise(requestAnimationFrame);
        }
      }

      const panZoomSamples = [];
      const frameSamples = [];
      const svg = document.getElementById('sv');
      if (svg instanceof SVGElement) {
        const rect = svg.getBoundingClientRect();
        if (rect.width > 20 && rect.height > 20) {
          for (let i = 0; i < 24; i += 1) {
            const t0 = performance.now();
            const frameStart = performance.now();
            let sawZoom = false;
            const onZoom = () => {
              sawZoom = true;
            };
            window.addEventListener('zoom-changed', onZoom, { once: true });
            svg.dispatchEvent(
              new WheelEvent('wheel', {
                deltaY: i % 2 === 0 ? -110 : 110,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
                bubbles: true,
                cancelable: true
              })
            );
            await new Promise(requestAnimationFrame);
            await new Promise(requestAnimationFrame);
            frameSamples.push(performance.now() - frameStart);
            if (sawZoom) {
              panZoomSamples.push(performance.now() - t0);
            }
          }
        }
      }

      return {
        status: 'ok',
        boot,
        first_interaction_samples: firstInteractionSamples,
        filter_toggle_samples: filterSamples,
        pan_zoom_samples: panZoomSamples,
        pan_zoom_frame_samples: frameSamples
      };
    })()`
  );
  return result?.result?.value ?? { status: 'unavailable', reason: 'legacy_eval_no_value' };
}

export async function runUiBrowserBenchmarks(projectRoot) {
  const chromeBinary = findChromeBinary();
  if (!chromeBinary) {
    return {
      status: 'unavailable',
      reason: 'chrome_not_found',
      note: 'No Chrome/Chromium binary detected for browser trace lanes.'
    };
  }

  const chromePort = 9242;
  const userDataDir = await mkdtemp(join(tmpdir(), 'maldives-ui-bench-'));
  const legacyUrl = `file://${resolve(projectRoot, 'index.html')}`;

  let chrome = null;
  let client = null;
  try {
    chrome = spawn(
      chromeBinary,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--allow-file-access-from-files',
        '--no-first-run',
        '--no-default-browser-check',
        `--remote-debugging-port=${chromePort}`,
        `--user-data-dir=${userDataDir}`,
        'about:blank'
      ],
      {
        stdio: 'ignore'
      }
    );

    const version = await waitFor(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    }, 10000);

    if (!version?.webSocketDebuggerUrl) {
      return {
        status: 'unavailable',
        reason: 'cdp_endpoint_unavailable',
        note: 'Chrome launched but DevTools endpoint was unavailable.'
      };
    }

    client = new CdpClient(version.webSocketDebuggerUrl);
    await client.connect();
    const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });
    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);

    const legacy = await runLegacyUiScenario(client, sessionId, legacyUrl);
    if (legacy?.status !== 'ok') {
      return {
        status: 'unavailable',
        reason: legacy?.reason ?? 'legacy_benchmark_unavailable',
        legacy
      };
    }

    const firstStats = summarize(legacy.first_interaction_samples ?? []);
    const filterStats = summarize(legacy.filter_toggle_samples ?? []);
    const panStats = summarize(legacy.pan_zoom_samples ?? []);
    const frameStats = summarize(legacy.pan_zoom_frame_samples ?? []);
    const fps = frameStats.mean > 0 ? 1000 / frameStats.mean : 0;

    return {
      status: 'ok',
      source: 'legacy-graph-ui',
      target_url: legacyUrl,
      boot_ms: {
        dom_content_loaded: toMs(legacy.boot?.dom_content_loaded_ms ?? 0),
        load_event: toMs(legacy.boot?.load_event_ms ?? 0)
      },
      first_interaction_latency_ms: roundStats(firstStats),
      filter_toggle_latency_ms: roundStats(filterStats),
      pan_zoom_latency_ms: roundStats(panStats),
      pan_zoom_frame_ms: roundStats(frameStats),
      pan_zoom_estimated_fps: toMs(fps),
      note: 'Measured via headless Chrome DevTools protocol with scripted interactions.'
    };
  } catch (error) {
    return {
      status: 'unavailable',
      reason: 'ui_benchmark_error',
      error: String(error?.message ?? error)
    };
  } finally {
    try {
      client?.close();
    } catch {}
    if (chrome) {
      try {
        chrome.kill('SIGTERM');
      } catch {}
    }
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = resolve(process.cwd());
  const payload = await runUiBrowserBenchmarks(root);
  console.log(JSON.stringify(payload, null, 2));
}
