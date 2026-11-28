// Utility to stream realistic ocean hydroacoustic recordings from Freesound/Backend API with Web Audio fallback

let activeAudioElement = null;
let activeOscillators = [];
let audioCtx = null;
let currentAbortController = null;

// Cache queries in memory to avoid duplicate API calls
const audioUrlCache = new Map();

/**
 * Fallback synthesizer: produces muffled deep-sea ambient resonance
 */
function playSynthesizedSound(onEnd) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      if (onEnd) onEnd();
      return;
    }

    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const duration = 3.2;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.25, now + 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(audioCtx.destination);

    // Âm thanh trầm mô phỏng sóng âm đại dương
    const osc1 = audioCtx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(42, now);
    osc1.frequency.linearRampToValueAtTime(32, now + 1.2);
    osc1.frequency.linearRampToValueAtTime(26, now + 3.0);

    // Filter to give underwater muffled acoustic feel
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(320, now + 0.8);
    filter.frequency.exponentialRampToValueAtTime(60, now + 3.0);

    // Subtle resonance pulse
    const osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(58, now);
    osc2.frequency.exponentialRampToValueAtTime(38, now + 2.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    activeOscillators = [osc1, osc2];

    setTimeout(() => {
      activeOscillators = [];
      if (onEnd) onEnd();
    }, duration * 1000);
  } catch (err) {
    console.warn("Could not synthesize fallback audio:", err);
    if (onEnd) onEnd();
  }
}

/**
 * Play species sound from real hydrophone recordings or database URL
 * @param {object|string} species - Species object or identifier
 * @param {function} onEnd - Callback when audio finishes playing
 * @returns {Promise<boolean>}
 */
export async function playSpeciesSound(species, onEnd) {
  stopSpeciesSound();

  const speciesObj = typeof species === "object" ? species : { id: species };
  const directUrl = speciesObj?.soundUrl || speciesObj?.sound_url;

  // 1. If direct sound URL is available in database
  if (directUrl) {
    try {
      activeAudioElement = new Audio(directUrl);
      activeAudioElement.onended = () => {
        activeAudioElement = null;
        if (onEnd) onEnd();
      };
      activeAudioElement.onerror = () => {
        playSynthesizedSound(onEnd);
      };
      await activeAudioElement.play();
      return true;
    } catch {
      playSynthesizedSound(onEnd);
      return false;
    }
  }

  // 2. Query terms to search for bioacoustics recordings
  const searchTerm =
    speciesObj?.commonName ||
    speciesObj?.nameVi ||
    speciesObj?.nameEn ||
    speciesObj?.scientificName ||
    speciesObj?.slug ||
    speciesObj?.id ||
    "ocean underwater";

  // Check cache
  const cachedUrl = audioUrlCache.get(searchTerm);
  if (cachedUrl) {
    try {
      activeAudioElement = new Audio(cachedUrl);
      activeAudioElement.onended = () => {
        activeAudioElement = null;
        if (onEnd) onEnd();
      };
      activeAudioElement.onerror = () => {
        playSynthesizedSound(onEnd);
      };
      await activeAudioElement.play();
      return true;
    } catch {
      playSynthesizedSound(onEnd);
      return false;
    }
  }

  // 3. Fetch from backend audio-search endpoint
  try {
    currentAbortController = new AbortController();
    const res = await fetch(
      `/api/species/audio-search?q=${encodeURIComponent(searchTerm)}`,
      { signal: currentAbortController.signal }
    );

    if (!res.ok) throw new Error("Audio search failed");
    const json = await res.json();
    const items = json?.data || [];

    if (items.length > 0 && items[0]?.url) {
      const audioUrl = items[0].url;
      audioUrlCache.set(searchTerm, audioUrl);

      activeAudioElement = new Audio(audioUrl);
      activeAudioElement.onended = () => {
        activeAudioElement = null;
        if (onEnd) onEnd();
      };
      activeAudioElement.onerror = () => {
        playSynthesizedSound(onEnd);
      };
      await activeAudioElement.play();
      return true;
    } else {
      // Fallback to synthesized deep-sea acoustic wave
      playSynthesizedSound(onEnd);
      return false;
    }
  } catch (err) {
    if (err.name === "AbortError") return false;
    playSynthesizedSound(onEnd);
    return false;
  }
}

export function stopSpeciesSound() {
  if (currentAbortController) {
    try {
      currentAbortController.abort();
    } catch (_) {}
    currentAbortController = null;
  }

  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (_) {}
    activeAudioElement = null;
  }

  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (_) {}
  });
  activeOscillators = [];
}
