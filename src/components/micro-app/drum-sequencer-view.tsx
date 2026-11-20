import React from 'react';
import { Dices, Play, Square } from 'lucide-react';

interface TrackSpec {
  id: string;
  short: string;
  name: string;
  keyHint: string;
  color: string;
  freq: number;
  initial: number[];
}

const TRACKS: readonly TrackSpec[] = [
  { id: 'kick', short: 'KICK', name: 'Kick', keyHint: 'A', color: '#D7846E', freq: 62, initial: [0, 4, 8, 12] },
  { id: 'snare', short: 'SNARE', name: 'Snare', keyHint: 'S', color: '#DBB266', freq: 185, initial: [4, 12] },
  { id: 'ch', short: 'CH', name: 'Closed Hat', keyHint: 'D', color: '#80A6D6', freq: 640, initial: [0, 2, 4, 6, 8, 10, 12, 14] },
  { id: 'oh', short: 'OH', name: 'Open Hat', keyHint: 'F', color: '#9B8FD6', freq: 520, initial: [6, 14] },
  { id: 'clap', short: 'CLAP', name: 'Clap', keyHint: 'G', color: '#96C29C', freq: 310, initial: [4, 12] },
  { id: 'tom', short: 'TOM', name: 'Tom', keyHint: 'H', color: '#C985B4', freq: 118, initial: [] },
];

function triggerDrumVoice(ctx: AudioContext | null, track: TrackSpec, volume: number) {
  if (!ctx || volume <= 0) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = track.id === 'ch' || track.id === 'oh' ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(track.freq * 1.6, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, track.freq * 0.55), now + 0.11);
    gain.gain.setValueAtTime((volume / 100) * 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (track.id === 'oh' ? 0.22 : 0.12));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch {
    // Ignore audio errors in headless environments
  }
}

export function DrumSequencerView({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string | undefined;
  badge?: string | undefined;
}): React.ReactNode {
  const audioRef = React.useRef<AudioContext | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [tempo, setTempo] = React.useState(120);
  const [swing, setSwing] = React.useState(0);
  const [volume, setVolume] = React.useState(75);
  const [playhead, setPlayhead] = React.useState(0);
  const [grid, setGrid] = React.useState<boolean[][]>(() =>
    TRACKS.map((t) => Array.from({ length: 16 }, (_, s) => t.initial.includes(s))),
  );

  const ensureAudio = () => {
    if (audioRef.current || typeof window === 'undefined') return audioRef.current;
    const Ctor = window.AudioContext;
    if (typeof Ctor === 'function') {
      try {
        audioRef.current = new Ctor();
      } catch {
        audioRef.current = null;
      }
    }
    return audioRef.current;
  };

  React.useEffect(() => {
    if (!playing) return;
    const stepMs = Math.max(60, Math.round(60000 / tempo / 4));
    const id = setInterval(() => {
      setPlayhead((prev) => {
        const next = (prev + 1) % 16;
        TRACKS.forEach((tr, rIdx) => {
          if (grid[rIdx]?.[next]) {
            triggerDrumVoice(audioRef.current, tr, volume);
          }
        });
        return next;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [grid, playing, tempo, volume]);

  const toggleCell = (row: number, step: number) => {
    setGrid((prev) =>
      prev.map((r, rIdx) => (rIdx === row ? r.map((v, sIdx) => (sIdx === step ? !v : v)) : r)),
    );
  };

  const randomize = () => {
    setGrid(
      TRACKS.map((_, rIdx) =>
        Array.from({ length: 16 }, (__, sIdx) =>
          rIdx === 0 ? sIdx % 4 === 0 || Math.random() < 0.15 : Math.random() < 0.24,
        ),
      ),
    );
  };

  return (
    <div className="lumina-drum-lab">
      <div className="lumina-drum-header">
        <div>
          <div className="lumina-drum-title">{title}</div>
          {subtitle && <div className="lumina-drum-sub">{subtitle}</div>}
        </div>
        {badge && <span className="lumina-drum-ready">● {badge}</span>}
      </div>

      <div className="lumina-drum-panel">
        <div className="lumina-drum-transport">
          <button
            type="button"
            className={`lumina-drum-play-btn ${playing ? 'is-playing' : ''}`.trim()}
            onClick={() => {
              ensureAudio();
              setPlaying((p) => !p);
            }}
          >
            <Play size={13} />
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
          <button
            type="button"
            className="lumina-drum-ghost-btn"
            onClick={() => {
              setPlaying(false);
              setPlayhead(0);
            }}
          >
            <Square size={12} />
            <span>Stop</span>
          </button>
          <button type="button" className="lumina-drum-ghost-btn is-right" onClick={randomize}>
            <Dices size={13} />
            <span>Randomize</span>
          </button>
        </div>

        <div className="lumina-drum-knobs">
          <label className="lumina-drum-knob">
            <span>
              TEMPO <strong className="lumina-tabular">{tempo} BPM</strong>
            </span>
            <input
              type="range"
              min={70}
              max={180}
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
            />
          </label>
          <label className="lumina-drum-knob">
            <span>
              SWING <strong className="lumina-tabular">{swing}%</strong>
            </span>
            <input
              type="range"
              min={0}
              max={60}
              value={swing}
              onChange={(e) => setSwing(Number(e.target.value))}
            />
          </label>
          <label className="lumina-drum-knob">
            <span>
              VOLUME <strong className="lumina-tabular">{volume}%</strong>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="lumina-drum-panel">
        <div className="lumina-drum-seq-top">
          <div>
            <strong>Step sequencer</strong>
            <span className="lumina-drum-seq-hint">Tap cells to program your groove</span>
          </div>
          <button
            type="button"
            className="lumina-drum-ghost-btn"
            onClick={() => setGrid(TRACKS.map(() => new Array<boolean>(16).fill(false)))}
          >
            Clear pattern
          </button>
        </div>

        <div className="lumina-drum-matrix">
          {TRACKS.map((tr, rIdx) => (
            <div key={tr.id} className="lumina-drum-row">
              <span className="lumina-drum-track-name">
                <span className="lumina-drum-dot" style={{ backgroundColor: tr.color }} />
                {tr.short}
              </span>
              <div className="lumina-drum-steps">
                {Array.from({ length: 16 }, (_, sIdx) => {
                  const active = Boolean(grid[rIdx]?.[sIdx]);
                  const isHead = playing && playhead === sIdx;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      aria-label={`${tr.name} step ${sIdx + 1}`}
                      aria-pressed={active}
                      className={`lumina-drum-cell ${active ? 'is-on' : ''} ${isHead ? 'is-head' : ''}`.trim()}
                      style={active ? { backgroundColor: tr.color } : undefined}
                      onClick={() => toggleCell(rIdx, sIdx)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lumina-drum-pads">
        {TRACKS.map((tr) => (
          <button
            key={tr.id}
            type="button"
            className="lumina-drum-pad"
            onClick={() => triggerDrumVoice(ensureAudio(), tr, volume)}
          >
            <div className="lumina-drum-pad-top">
              <span className="lumina-drum-dot" style={{ backgroundColor: tr.color }} />
              <kbd>{tr.keyHint}</kbd>
            </div>
            <strong>{tr.name}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
