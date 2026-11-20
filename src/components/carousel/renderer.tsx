import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  childRefKey,
  normalizeChildList,
  readOptionalString,
  readString,
  renderChildRef,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

export function CarouselRenderer({ props, buildChild }: LuminaReactRenderArgs): React.ReactNode {
  const railRef = React.useRef<HTMLDivElement>(null);
  const children = normalizeChildList(props.children);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const itemWidth = readString(props.itemWidth, 'standard');
  const title = readOptionalString(props.title);
  const showIndicators = props.showIndicators !== false;

  const scrollByDir = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const step = Math.max(240, el.clientWidth * 0.78);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = railRef.current;
    if (!el || children.length <= 1) return;
    const maxScroll = Math.max(1, el.scrollWidth - el.clientWidth);
    const ratio = el.scrollLeft / maxScroll;
    setActiveIndex(Math.round(ratio * (children.length - 1)));
  };

  return (
    <div className="lumina-carousel" style={weightStyle(props.weight)}>
      {(title || showIndicators) && (
        <div className="lumina-carousel-header">
          {title ? <div className="lumina-section-title">{title}</div> : <span />}
          {children.length > 1 && (
            <div className="lumina-carousel-controls">
              <button
                type="button"
                className="lumina-carousel-arrow"
                aria-label="Scroll left"
                onClick={() => scrollByDir(-1)}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="lumina-carousel-arrow"
                aria-label="Scroll right"
                onClick={() => scrollByDir(1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
      <div
        ref={railRef}
        onScroll={handleScroll}
        className={`lumina-carousel-rail lumina-carousel-width-${itemWidth}`}
      >
        {children.map((ref, idx) => (
          <div key={childRefKey(ref, idx)} className="lumina-carousel-slide">
            {renderChildRef(buildChild, ref, idx)}
          </div>
        ))}
      </div>
      {showIndicators && children.length > 1 && (
        <div className="lumina-carousel-dots" aria-hidden="true">
          {children.map((_, i) => (
            <span
              key={i}
              className={`lumina-carousel-dot ${i === activeIndex ? 'is-active' : ''}`.trim()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
