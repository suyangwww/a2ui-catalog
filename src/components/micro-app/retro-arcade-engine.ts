export type ArcadeMode = 'snake' | 'breakout' | 'pong';

export interface Point {
  x: number;
  y: number;
}

export interface Brick {
  x: number;
  y: number;
  on: boolean;
}

export interface ArcadeEngineState {
  snake: Point[];
  dir: Point;
  nextDir: Point;
  fruit: Point;
  paddleX: number;
  paddleY: number;
  enemyY: number;
  ball: { x: number; y: number; vx: number; vy: number };
  bricks: Brick[];
  keys: Record<string, boolean>;
  acc: number;
  score: number;
}

const BRICK_PALETTE = ['#45664d', '#63815d', '#80956c', '#54745d', '#38584b'];

export function createInitialArcadeState(): ArcadeEngineState {
  const bricks: Brick[] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 8; x++) {
      bricks.push({ x: 12 + x * 38, y: 35 + y * 17, on: true });
    }
  }
  return {
    snake: [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    fruit: { x: 14, y: 10 },
    paddleX: 125,
    paddleY: 130,
    enemyY: 130,
    ball: { x: 160, y: 210, vx: 2.6, vy: -3.1 },
    bricks,
    keys: {},
    acc: 0,
    score: 0,
  };
}

export function paintArcadeCanvas(
  canvas: HTMLCanvasElement | null,
  g: ArcadeEngineState,
  activeMode: ArcadeMode,
): void {
  if (!canvas) return;
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext('2d');
  } catch {
    ctx = null;
  }
  if (!ctx) return;

  ctx.fillStyle = '#b8d0a0';
  ctx.fillRect(0, 0, 320, 320);

  if (activeMode === 'snake') {
    ctx.fillStyle = '#a5bf90';
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        if ((x + y) % 2 === 0) ctx.fillRect(x * 16, y * 16, 16, 16);
      }
    }
    ctx.fillStyle = '#c34c58';
    ctx.fillRect(g.fruit.x * 16 + 2, g.fruit.y * 16 + 2, 12, 12);
    g.snake.forEach((seg, idx) => {
      if (!ctx) return;
      ctx.fillStyle = idx === 0 ? '#294637' : '#42664d';
      ctx.fillRect(seg.x * 16 + 1, seg.y * 16 + 1, 14, 14);
    });
  } else if (activeMode === 'breakout') {
    g.bricks.forEach((b, idx) => {
      if (!ctx || !b.on) return;
      ctx.fillStyle = BRICK_PALETTE[Math.floor(idx / 8) % BRICK_PALETTE.length] ?? '#45664d';
      ctx.fillRect(b.x, b.y, 34, 12);
    });
    ctx.fillStyle = '#314e3b';
    ctx.fillRect(g.paddleX, 294, 70, 9);
    ctx.fillRect(g.ball.x - 4, g.ball.y - 4, 8, 8);
  } else {
    ctx.fillStyle = '#8ba780';
    for (let y = 0; y < 320; y += 22) ctx.fillRect(158, y, 4, 12);
    ctx.fillStyle = '#314e3b';
    ctx.fillRect(14, g.paddleY, 8, 55);
    ctx.fillRect(298, g.enemyY, 8, 55);
    ctx.fillRect(g.ball.x - 5, g.ball.y - 5, 10, 10);
  }
}

export function stepArcadeTick(
  g: ArcadeEngineState,
  mode: ArcadeMode,
  dt: number,
  onPoints: (pts: number) => void,
): string | null {
  if (mode === 'snake') {
    g.acc += dt;
    const speed = Math.max(70, 145 - g.score * 3);
    if (g.acc < speed) return null;
    g.acc = 0;
    g.dir = g.nextDir;
    const head = g.snake[0] ?? { x: 9, y: 10 };
    const next = { x: head.x + g.dir.x, y: head.y + g.dir.y };
    const eat = next.x === g.fruit.x && next.y === g.fruit.y;
    const hitSelf = g.snake
      .slice(0, eat ? undefined : -1)
      .some((s) => s.x === next.x && s.y === next.y);
    if (next.x < 0 || next.y < 0 || next.x >= 20 || next.y >= 20 || hitSelf) {
      return 'GAME OVER';
    }
    g.snake.unshift(next);
    if (eat) {
      onPoints(1);
      g.fruit = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } else {
      g.snake.pop();
    }
    return null;
  }

  if (mode === 'breakout') {
    if (g.keys.left) g.paddleX = Math.max(0, g.paddleX - 5);
    if (g.keys.right) g.paddleX = Math.min(250, g.paddleX + 5);
    g.ball.x += g.ball.vx;
    g.ball.y += g.ball.vy;
    if (g.ball.x < 5 || g.ball.x > 315) g.ball.vx *= -1;
    if (g.ball.y < 5) g.ball.vy = Math.abs(g.ball.vy);
    if (
      g.ball.vy > 0 &&
      g.ball.y >= 289 &&
      g.ball.y <= 302 &&
      g.ball.x >= g.paddleX &&
      g.ball.x <= g.paddleX + 70
    ) {
      g.ball.vy = -Math.abs(g.ball.vy);
      g.ball.vx = (g.ball.x - (g.paddleX + 35)) / 11;
    }
    for (const b of g.bricks) {
      if (b.on && g.ball.x >= b.x - 4 && g.ball.x <= b.x + 38 && g.ball.y >= b.y - 4 && g.ball.y <= b.y + 16) {
        b.on = false;
        g.ball.vy *= -1;
        onPoints(1);
        break;
      }
    }
    if (g.ball.y > 324) return 'GAME OVER';
    if (g.bricks.every((b) => !b.on)) return 'YOU WIN!';
    return null;
  }

  if (g.keys.up) g.paddleY = Math.max(0, g.paddleY - 5);
  if (g.keys.down) g.paddleY = Math.min(265, g.paddleY + 5);
  g.enemyY += Math.max(-2.4, Math.min(2.4, g.ball.y - 27 - g.enemyY));
  g.ball.x += g.ball.vx;
  g.ball.y += g.ball.vy;
  if (g.ball.y < 5 || g.ball.y > 315) g.ball.vy *= -1;
  if (g.ball.x <= 24 && g.ball.x >= 12 && g.ball.y >= g.paddleY - 5 && g.ball.y <= g.paddleY + 58) {
    g.ball.vx = Math.abs(g.ball.vx) * 1.04;
  }
  if (g.ball.x >= 294 && g.ball.x <= 308 && g.ball.y >= g.enemyY - 5 && g.ball.y <= g.enemyY + 58) {
    g.ball.vx = -Math.abs(g.ball.vx) * 1.04;
  }
  if (g.ball.x > 325) {
    onPoints(1);
    g.ball = { x: 160, y: 160, vx: -2.7, vy: 2.1 };
  }
  if (g.ball.x < 0) return 'CPU WINS';
  if (g.score >= 7) return 'YOU WIN!';
  return null;
}
