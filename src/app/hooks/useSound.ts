import { useCallback, useEffect, useRef, useState } from "react";

type Wave = "square" | "sine" | "triangle" | "sawtooth";

const STORAGE_KEY = "oracle:muted";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.18;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, [muted]);

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = muted ? 0 : 0.18;
    }
    try { localStorage.setItem(STORAGE_KEY, muted ? "1" : "0"); } catch {}
  }, [muted]);

  const beep = useCallback((freq: number, dur: number, wave: Wave = "square", when = 0, vol = 1) => {
    const ctx = ensureCtx();
    if (!ctx || !masterRef.current) return;
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(masterRef.current);
    osc.start(t); osc.stop(t + dur + 0.02);
  }, [ensureCtx]);

  const slide = useCallback((f1: number, f2: number, dur: number, wave: Wave = "square", vol = 1) => {
    const ctx = ensureCtx();
    if (!ctx || !masterRef.current) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(f1, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(masterRef.current);
    osc.start(t); osc.stop(t + dur + 0.02);
  }, [ensureCtx]);

  const playCoin = useCallback(() => {
    // Falling clink then bright ding arpeggio as it lands
    slide(1600, 420, 0.45, "square", 0.6);
    beep(784,  0.08, "square",   0.55, 0.7); // G5
    beep(988,  0.08, "square",   0.63, 0.7); // B5
    beep(1318, 0.22, "triangle", 0.71, 0.9); // E6
  }, [slide, beep]);

  const playWarmUp = useCallback(() => {
    slide(120, 900, 0.6, "sawtooth", 0.35);
  }, [slide]);

  const playSelect = useCallback(() => {
    beep(660, 0.05, "square", 0,    0.8);
    beep(990, 0.09, "square", 0.05, 0.9);
  }, [beep]);

  const playType = useCallback(() => {
    beep(1400 + Math.random() * 300, 0.012, "square", 0, 0.35);
  }, [beep]);

  const playChime = useCallback(() => {
    beep(880,  0.25, "sine", 0,    0.6);
    beep(1175, 0.25, "sine", 0.06, 0.5); // D6
    beep(1568, 0.35, "sine", 0.12, 0.55);// G6
  }, [beep]);

  const playReset = useCallback(() => {
    slide(900, 250, 0.28, "square", 0.6);
  }, [slide]);

  const toggleMute = useCallback(() => {
    ensureCtx();
    setMuted(m => !m);
  }, [ensureCtx]);

  return { muted, toggleMute, playCoin, playWarmUp, playSelect, playType, playChime, playReset };
}
