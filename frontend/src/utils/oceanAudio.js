// Utility to synthesize realistic deep-sea animal hydroacoustic sound using Web Audio API

let audioCtx = null;
let activeOscillators = [];

export function playSpeciesSound(speciesId) {
  stopSpeciesSound();

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.exponentialRampToValueAtTime(0.25, now + 0.4);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    masterGain.connect(audioCtx.destination);

    // Deep sub-bass frequency rumble (shark / whale hydroacoustic roar)
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
    osc1.stop(now + 3.2);
    osc2.stop(now + 3.2);

    activeOscillators = [osc1, osc2];

    return 3200; // Duration in ms
  } catch (err) {
    console.warn("Could not play ocean audio:", err);
    return null;
  }
}

export function stopSpeciesSound() {
  try {
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // already stopped
      }
    });
    activeOscillators = [];
  } catch (e) {
    // ignore
  }
}
