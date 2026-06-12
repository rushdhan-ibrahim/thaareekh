/**
 * The Scriptorium Sound — a fully synthesized WebAudio layer.
 * No samples, no network: an ocean of filtered noise, a breathing drone,
 * and small inked gestures for interaction. Everything sits far below
 * speech level and dies instantly when disabled.
 */
import { dynastyPitch, bellPitch, tickPitch, clamp01 } from './audio-maps.ts';

const STORE_KEY = 'maldives-genealogy:sound';

type EventName =
  | 'select'
  | 'hover'
  | 'edge-draw'
  | 'mode'
  | 'palette'
  | 'tick'
  | 'export'
  | 'enable-confirm'
  | 'step';

interface EventOpts {
  dy?: string | null;
  sovereign?: boolean;
  count?: number;
  progress?: number;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bedGain: GainNode | null = null;
let voiceGain: GainNode | null = null;
let bedRunning = false;
let enabled = false;
let armed = false;
let noiseBuf: AudioBuffer | null = null;
let lastHoverAt = 0;
let lastTickAt = 0;

function supported(): boolean {
  return typeof window !== 'undefined' && 'AudioContext' in window;
}

function readStored(): boolean {
  try {
    return localStorage.getItem(STORE_KEY) === 'on';
  } catch {
    return false;
  }
}

function persist(on: boolean): void {
  try {
    localStorage.setItem(STORE_KEY, on ? 'on' : 'off');
  } catch {
    /* private mode — session-only */
  }
}

function ensureContext(): AudioContext | null {
  if (!supported()) return null;
  if (ctx) return ctx;
  try {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.9;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -28;
    limiter.knee.value = 24;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.25;
    bedGain = ctx.createGain();
    bedGain.gain.value = 0;
    voiceGain = ctx.createGain();
    voiceGain.gain.value = 1;
    bedGain.connect(master);
    voiceGain.connect(master);
    master.connect(limiter);
    limiter.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Cached looping brown-noise buffer (4 s). */
function brownNoise(ac: AudioContext): AudioBuffer {
  if (noiseBuf) return noiseBuf;
  const len = ac.sampleRate * 4;
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  noiseBuf = buf;
  return buf;
}

function lfo(ac: AudioContext, hz: number, depth: number, target: AudioParam): OscillatorNode {
  const o = ac.createOscillator();
  o.type = 'sine';
  o.frequency.value = hz;
  const g = ac.createGain();
  g.gain.value = depth;
  o.connect(g);
  g.connect(target);
  o.start();
  return o;
}

function startBed(): void {
  const ac = ensureContext();
  if (!ac || !bedGain || bedRunning) return;
  bedRunning = true;
  // Ocean: looped brown noise through a slow-breathing lowpass.
  const src = ac.createBufferSource();
  src.buffer = brownNoise(ac);
  src.loop = true;
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 240;
  lp.Q.value = 0.4;
  lfo(ac, 0.018, 70, lp.frequency);
  const oceanG = ac.createGain();
  oceanG.gain.value = 0.05;
  src.connect(lp);
  lp.connect(oceanG);
  oceanG.connect(bedGain);
  src.start();
  // Drone: root + fifth, each breathing on its own slow cycle.
  const mk = (freq: number, base: number, lfoHz: number): void => {
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    o.detune.value = (Math.random() - 0.5) * 4;
    const g = ac.createGain();
    g.gain.value = base;
    lfo(ac, lfoHz, base * 0.45, g.gain);
    o.connect(g);
    g.connect(bedGain as GainNode);
    o.start();
  };
  mk(110, 0.022, 0.011);
  mk(164.81, 0.014, 0.007);
}

function fadeBed(to: number, secs: number): void {
  if (!ctx || !bedGain) return;
  const t = ctx.currentTime;
  bedGain.gain.cancelScheduledValues(t);
  bedGain.gain.setTargetAtTime(to, t, Math.max(0.05, secs / 3));
}

interface VoiceEnv {
  attack?: number;
  decay: number;
  peak: number;
}

function envGain(ac: AudioContext, { attack = 0.004, decay, peak }: VoiceEnv): GainNode {
  const g = ac.createGain();
  const t = ac.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(voiceGain as GainNode);
  return g;
}

function tone(freq: number, type: OscillatorType, env: VoiceEnv, glideTo?: number): void {
  if (!ctx) return;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, ctx.currentTime + (env.attack ?? 0.004) + env.decay);
  const g = envGain(ctx, env);
  o.connect(g);
  const stop = ctx.currentTime + (env.attack ?? 0.004) + env.decay + 0.05;
  o.start();
  o.stop(stop);
}

function noiseHit(filterType: BiquadFilterType, freq: number, q: number, env: VoiceEnv, sweepTo?: number): void {
  if (!ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = brownNoise(ctx);
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = freq;
  f.Q.value = q;
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + (env.attack ?? 0.004) + env.decay);
  const g = envGain(ctx, env);
  src.connect(f);
  f.connect(g);
  const stop = ctx.currentTime + (env.attack ?? 0.004) + env.decay + 0.05;
  src.start(0, Math.random() * 2);
  src.stop(stop);
}

function inkTap(dy?: string | null): void {
  const f = dynastyPitch(dy);
  tone(f * 2, 'triangle', { attack: 0.003, decay: 0.085, peak: 0.05 }, f);
  noiseHit('bandpass', 2400, 2.2, { attack: 0.001, decay: 0.03, peak: 0.018 });
}

function sovereignBell(dy?: string | null): void {
  const f = bellPitch(dy);
  tone(f, 'sine', { attack: 0.006, decay: 1.15, peak: 0.055 });
  tone(f * 2.76, 'sine', { attack: 0.004, decay: 0.5, peak: 0.02 });
  tone(f * 1.005, 'sine', { attack: 0.006, decay: 1.0, peak: 0.022 });
}

function paperWhisper(): void {
  noiseHit('bandpass', 1700, 1.1, { attack: 0.012, decay: 0.1, peak: 0.012 });
}

function quillScratch(count: number): void {
  const dur = Math.min(0.6, 0.22 + count * 0.045);
  noiseHit('bandpass', 3100, 4.5, { attack: 0.05, decay: dur, peak: 0.02 }, 2200);
}

function pageTurn(): void {
  noiseHit('lowpass', 3800, 0.7, { attack: 0.02, decay: 0.32, peak: 0.05 }, 320);
}

function chime(soft = false): void {
  tone(1318.51, 'sine', { attack: 0.005, decay: soft ? 0.28 : 0.4, peak: soft ? 0.02 : 0.035 });
  tone(1975.53, 'sine', { attack: 0.008, decay: soft ? 0.22 : 0.34, peak: soft ? 0.012 : 0.02 });
}

function decadeTick(progress: number): void {
  tone(tickPitch(clamp01(progress)), 'sine', { attack: 0.001, decay: 0.035, peak: 0.02 });
}

function waxPress(): void {
  tone(92, 'sine', { attack: 0.004, decay: 0.18, peak: 0.07 }, 58);
  noiseHit('lowpass', 900, 0.8, { attack: 0.002, decay: 0.05, peak: 0.025 });
}

/** Single entry point for every interaction sound. No-op while disabled. */
export function audioEvent(name: EventName, opts: EventOpts = {}): void {
  if (!enabled || !ctx || ctx.state !== 'running') return;
  try {
    switch (name) {
      case 'select':
        if (opts.sovereign) sovereignBell(opts.dy);
        else inkTap(opts.dy);
        break;
      case 'hover': {
        const now = performance.now();
        if (now - lastHoverAt < 90) return;
        lastHoverAt = now;
        paperWhisper();
        break;
      }
      case 'edge-draw':
        quillScratch(Math.max(1, opts.count ?? 1));
        break;
      case 'mode':
        pageTurn();
        break;
      case 'palette':
        chime();
        break;
      case 'tick': {
        const now = performance.now();
        if (now - lastTickAt < 70) return;
        lastTickAt = now;
        decadeTick(opts.progress ?? 0.5);
        break;
      }
      case 'export':
        waxPress();
        break;
      case 'step':
        inkTap(opts.dy);
        break;
      case 'enable-confirm':
        chime(true);
        break;
    }
  } catch {
    /* a failed grace note must never break the page */
  }
}

export function isAudioEnabled(): boolean {
  return enabled;
}

export function setAudioEnabled(on: boolean): void {
  enabled = Boolean(on) && supported();
  persist(enabled);
  if (enabled) {
    const ac = ensureContext();
    if (!ac) {
      enabled = false;
      return;
    }
    void ac.resume().then(() => {
      startBed();
      fadeBed(1, 2.2);
    });
  } else if (ctx) {
    fadeBed(0, 0.25);
    window.setTimeout(() => {
      void ctx?.suspend();
    }, 350);
  }
  document.dispatchEvent(new CustomEvent('sound-changed', { detail: { enabled } }));
}

/**
 * Arm the engine: restore persisted preference and bind the lifecycle.
 * The AudioContext itself is only created after a real user gesture.
 */
export function initAudio(): void {
  if (armed || !supported()) return;
  armed = true;
  const wantsOn = readStored();
  const onGesture = (): void => {
    document.removeEventListener('pointerdown', onGesture);
    document.removeEventListener('keydown', onGesture);
    if (wantsOn && !enabled) setAudioEnabled(true);
  };
  if (wantsOn) {
    document.addEventListener('pointerdown', onGesture, { passive: true });
    document.addEventListener('keydown', onGesture);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !enabled) return;
    if (document.hidden) void ctx.suspend();
    else void ctx.resume();
  });
}
