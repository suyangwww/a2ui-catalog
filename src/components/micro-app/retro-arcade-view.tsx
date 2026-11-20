import React from 'react';
import {
  createInitialArcadeState,
  paintArcadeCanvas,
  stepArcadeTick,
  type ArcadeMode,
  type Point,
} from './retro-arcade-engine.js';

export function RetroArcadeView({
  title,
  badge,
  initialMode,
}: {
  title: string;
  badge?: string | undefined;
  initialMode: ArcadeMode;
}): React.ReactNode {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = React.useState<ArcadeMode>(initialMode);
  const [status, setStatus] = React.useState<'standby' | 'running' | 'paused' | 'over'>('standby');
  const [bannerTitle, setBannerTitle] = React.useState<string>(initialMode.toUpperCase());
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState<Record<ArcadeMode, number>>({
    snake: 0,
    breakout: 0,
    pong: 0,
  });

  const gameRef = React.useRef(createInitialArcadeState());

  const resetGame = React.useCallback((targetMode: ArcadeMode) => {
    gameRef.current = createInitialArcadeState();
    setScore(0);
    setStatus('standby');
    setBannerTitle(targetMode.toUpperCase());
    paintArcadeCanvas(canvasRef.current, gameRef.current, targetMode);
  }, []);

  React.useEffect(() => {
    resetGame(mode);
  }, [mode, resetGame]);

  React.useEffect(() => {
    if (status !== 'running') return;
    let raf = 0;
    let last = 0;

    const addPts = (pts: number) => {
      gameRef.current.score += pts;
      const next = gameRef.current.score;
      setScore(next);
      setBest((prev) => ({ ...prev, [mode]: Math.max(prev[mode], next) }));
    };

    const loop = (ts: number) => {
      if (!last) last = ts;
      const dt = Math.min(40, ts - last);
      last = ts;
      const gameOverMsg = stepArcadeTick(gameRef.current, mode, dt, addPts);
      if (gameOverMsg) {
        setBannerTitle(gameOverMsg);
        setStatus('over');
        return;
      }
      paintArcadeCanvas(canvasRef.current, gameRef.current, mode);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode, status]);

  const steer = (dir: 'up' | 'down' | 'left' | 'right', down: boolean) => {
    const g = gameRef.current;
    g.keys[dir] = down;
    if (!down) return;
    if (mode === 'snake') {
      const map: Record<string, Point> = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
      };
      const v = map[dir];
      if (v && !(v.x === -g.dir.x && v.y === -g.dir.y)) g.nextDir = v;
    } else if (mode === 'breakout' && status === 'running') {
      g.paddleX = Math.max(0, Math.min(250, g.paddleX + (dir === 'left' ? -22 : dir === 'right' ? 22 : 0)));
      paintArcadeCanvas(canvasRef.current, g, mode);
    } else if (mode === 'pong' && status === 'running') {
      g.paddleY = Math.max(0, Math.min(265, g.paddleY + (dir === 'up' ? -22 : dir === 'down' ? 22 : 0)));
      paintArcadeCanvas(canvasRef.current, g, mode);
    }
  };

  const togglePlay = () => {
    if (status === 'over') {
      resetGame(mode);
      setStatus('running');
      return;
    }
    setStatus((s) => (s === 'running' ? 'paused' : 'running'));
    setBannerTitle('PAUSED');
  };

  const rulesText =
    mode === 'snake'
      ? 'EAT THE FRUIT · AVOID WALLS'
      : mode === 'breakout'
        ? 'BREAK ALL THE BRICKS · MOVE ◀ ▶'
        : 'FIRST TO 7 POINTS · MOVE ▲ ▼';

  return (
    <div className="lumina-arcade-stage">
      <div className="lumina-arcade-brand">
        <span className="lumina-arcade-brand-title">{title}</span>
        {badge && <span className="lumina-arcade-edition">{badge}</span>}
      </div>

      <div className="lumina-arcade-modes" role="group" aria-label="Choose arcade cartridge">
        {(['snake', 'breakout', 'pong'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            className={`lumina-arcade-mode-btn ${mode === m ? 'is-active' : ''}`.trim()}
            onClick={() => setMode(m)}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="lumina-arcade-shell">
        <div className="lumina-arcade-bezel-top">
          <span>
            PIXELBOY <span className="lumina-arcade-star">★</span>
          </span>
          <span>8-BIT SYSTEM</span>
        </div>

        <div className="lumina-arcade-screen-frame">
          <div className="lumina-arcade-hud lumina-tabular">
            <span>SCORE {String(score).padStart(3, '0')}</span>
            <span>BEST {String(best[mode]).padStart(3, '0')}</span>
          </div>

          <div className="lumina-arcade-lcd-wrap">
            <canvas ref={canvasRef} width={320} height={320} aria-label="Playable retro arcade LCD" />
            {status !== 'running' && (
              <div className="lumina-arcade-overlay">
                <div className="lumina-arcade-over-title">{bannerTitle}</div>
                <div className="lumina-arcade-over-desc">{rulesText}</div>
                <button type="button" className="lumina-arcade-start-cta" onClick={togglePlay}>
                  {status === 'paused' ? '▶ RESUME' : status === 'over' ? '↻ PLAY AGAIN' : '▶ START GAME'}
                </button>
              </div>
            )}
          </div>

          <div className="lumina-arcade-status-bar lumina-tabular">
            <span>
              ● POWER{' '}
              <strong className={status === 'running' ? 'is-on' : ''}>
                {status === 'running' ? 'ON' : status.toUpperCase()}
              </strong>
            </span>
            <span>LEVEL {String(1 + Math.floor(score / 5)).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="lumina-arcade-controls">
          <div className="lumina-arcade-dpad">
            <span />
            {(['up', 'left', 'right', 'down'] as const).map((dir) => {
              const glyph = dir === 'up' ? '▲' : dir === 'left' ? '◀' : dir === 'right' ? '▶' : '▼';
              return (
                <React.Fragment key={dir}>
                  {dir === 'right' && <span className="lumina-arcade-dpad-hub">✦</span>}
                  {dir === 'down' && <span />}
                  <button
                    type="button"
                    className="lumina-arcade-key"
                    aria-label={`Move ${dir}`}
                    onMouseDown={() => steer(dir, true)}
                    onMouseUp={() => steer(dir, false)}
                    onClick={() => steer(dir, true)}
                  >
                    {glyph}
                  </button>
                  {dir === 'up' && <span />}
                </React.Fragment>
              );
            })}
            <span />
          </div>

          <div className="lumina-arcade-ab">
            <button type="button" className="lumina-arcade-round" onClick={() => resetGame(mode)}>
              B
            </button>
            <button type="button" className="lumina-arcade-round" onClick={togglePlay}>
              A
            </button>
          </div>
        </div>

        <div className="lumina-arcade-pills">
          <div className="lumina-arcade-pill-wrap">
            <button type="button" className="lumina-arcade-pill" onClick={() => resetGame(mode)}>
              SELECT
            </button>
            <span>RESET</span>
          </div>
          <div className="lumina-arcade-pill-wrap">
            <button type="button" className="lumina-arcade-pill" onClick={togglePlay}>
              START
            </button>
            <span>PAUSE / PLAY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
