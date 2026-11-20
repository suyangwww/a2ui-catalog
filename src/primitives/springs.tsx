import React from 'react';
import { motion, useReducedMotion, type MotionStyle } from 'motion/react';
import { luminaMotion } from '@a2ui-catalog/tokens';

export const springTactile = luminaMotion.springs.tactile;
export const springFluid = luminaMotion.springs.fluid;
export const springSheet = luminaMotion.springs.sheet;
export const springStream = luminaMotion.springs.stream;

export function StreamingEntrance({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number | undefined;
  className?: string | undefined;
  style?: (React.CSSProperties & MotionStyle) | undefined;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      {...(style ? { style } : {})}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Smoothly interpolates numeric values embedded in formatted KPI strings
 * (e.g., "$142,850" or "+14.2%") on reactive DataModel updates.
 */
export function AnimatedMetricValue({ value }: { value: string }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState(value);
  const prevRef = React.useRef(value);

  React.useEffect(() => {
    if (reduced || prevRef.current === value) {
      prevRef.current = value;
      setDisplay(value);
      return;
    }

    const parseNum = (str: string) => {
      const m = str.match(/^([^0-9-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/);
      if (!m || m[1] === undefined || m[2] === undefined || m[3] === undefined) return null;
      const num = Number(m[2].replace(/,/g, ''));
      if (!Number.isFinite(num)) return null;
      const decMatch = m[2].split('.')[1];
      const decimals = decMatch ? decMatch.length : 0;
      const hasCommas = m[2].includes(',');
      return { prefix: m[1], num, suffix: m[3], decimals, hasCommas };
    };

    const a = parseNum(prevRef.current);
    const b = parseNum(value);
    prevRef.current = value;

    if (!a || !b || a.prefix !== b.prefix || a.suffix !== b.suffix) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const duration = 340;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const curr = a.num + (b.num - a.num) * eased;
      const formatted = b.hasCommas
        ? curr.toLocaleString('en-US', {
            minimumFractionDigits: b.decimals,
            maximumFractionDigits: b.decimals,
          })
        : curr.toFixed(b.decimals);
      setDisplay(`${b.prefix}${formatted}${b.suffix}`);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);

  return <span className="lumina-tabular">{display}</span>;
}
