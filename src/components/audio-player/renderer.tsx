import React from 'react';
import { motion } from 'motion/react';
import { Pause, Play, Volume2 } from 'lucide-react';
import {
  readOptionalString,
  readString,
  safeUrl,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function formatTimecode(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayerRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const url = safeUrl(props.url);
  const title = readString(props.description, 'Audio Track');
  const subtitle = readOptionalString(props.subtitle);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [rate, setRate] = React.useState<1 | 1.5 | 2>(1);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const cycleRate = () => {
    const next: 1 | 1.5 | 2 = rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1;
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="lumina-audio" style={weightStyle(props.weight)}>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <motion.button
        type="button"
        className="lumina-audio-play"
        aria-label={playing ? 'Pause' : 'Play'}
        whileTap={{ scale: 0.93 }}
        transition={springTactile}
        onClick={togglePlay}
      >
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </motion.button>
      <div className="lumina-audio-body">
        <div className="lumina-audio-top">
          <div className="lumina-audio-title-wrap">
            <Volume2 size={14} className="lumina-muted-icon" />
            <span className="lumina-audio-title">{title}</span>
            {subtitle && <span className="lumina-audio-subtitle">{subtitle}</span>}
          </div>
          <span className="lumina-audio-time lumina-tabular">
            {formatTimecode(current)} / {formatTimecode(duration)}
          </span>
        </div>
        <div className="lumina-audio-progress-row">
          <input
            type="range"
            aria-label="Audio seek"
            className="lumina-audio-scrub"
            min={0}
            max={duration || 100}
            step={0.1}
            value={current}
            style={{ '--pct': `${pct}%` }}
            onChange={(e) => {
              const t = Number(e.target.value);
              setCurrent(t);
              if (audioRef.current) audioRef.current.currentTime = t;
            }}
          />
          <button type="button" className="lumina-audio-rate lumina-tabular" onClick={cycleRate}>
            {rate}x
          </button>
        </div>
      </div>
    </div>
  );
}
