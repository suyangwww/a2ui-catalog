import React from 'react';
import { motion } from 'motion/react';
import { Compass, Maximize2, Navigation } from 'lucide-react';
import {
  AdaptiveOverlay,
  invokeSetter,
  isCallable,
  isPlainRecord,
  readBoolean,
  readNumber,
  readOptionalString,
  readRecordArray,
  readString,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';
import {
  BasemapBackdropSvg,
  buildRoutePath,
  projectStops,
  type GeoBounds,
  type ProjectedStop,
} from './basemap-svg.js';

const CATEGORY_COLORS: Readonly<Record<string, string>> = {
  Food: '#D95F2B',
  Landmarks: '#1F2937',
  Views: '#0071E3',
  Nature: '#10A37F',
  Culture: '#5E5CE6',
};

function readGeoBounds(raw: unknown): GeoBounds | undefined {
  if (!isPlainRecord(raw)) return undefined;
  const minLat = readNumber(raw.minLat, NaN);
  const maxLat = readNumber(raw.maxLat, NaN);
  const minLng = readNumber(raw.minLng, NaN);
  const maxLng = readNumber(raw.maxLng, NaN);
  if ([minLat, maxLat, minLng, maxLng].some((n) => Number.isNaN(n))) return undefined;
  return { minLat, maxLat, minLng, maxLng };
}

function MapCanvas({
  features,
  routeStyle,
  stops,
  selectedId,
  onSelect,
  categories,
  activeCat,
  onSelectCat,
  expandable,
  onExpand,
  height,
}: {
  features: ReadonlyArray<Record<string, unknown>>;
  routeStyle: string;
  stops: ProjectedStop[];
  selectedId: string;
  onSelect: (id: string) => void;
  categories: string[];
  activeCat: string;
  onSelectCat: (cat: string) => void;
  expandable: boolean;
  onExpand?: (() => void) | undefined;
  height: number;
}) {
  const filtered =
    activeCat === 'all' ? stops : stops.filter((s) => s.category === activeCat);
  const routePath = buildRoutePath(filtered.length > 1 ? filtered : stops, routeStyle);
  const activeStop = stops.find((s) => s.id === selectedId) ?? stops[0];

  return (
    <div className="lumina-map-viewport" style={{ height: `${height}px` }}>
      <BasemapBackdropSvg features={features} />

      <svg
        viewBox="0 0 640 340"
        preserveAspectRatio="none"
        className="lumina-map-route-svg"
        aria-hidden="true"
      >
        {routePath && (
          <>
            <path
              d={routePath}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d={routePath}
              fill="none"
              stroke="#18181B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            />
          </>
        )}
      </svg>

      <div className="lumina-map-HUD-top">
        <div className="lumina-map-HUD-left">
          {categories.length > 1 && (
            <select
              className="lumina-map-cat-select"
              aria-label="Filter map stops by group"
              value={activeCat}
              onChange={(e) => onSelectCat(e.target.value)}
            >
              <option value="all">All groups</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
          <span className="lumina-map-pill-icon" aria-hidden="true">
            <Navigation size={13} />
          </span>
          <span className="lumina-map-pill-icon" aria-hidden="true">
            <Compass size={13} />
          </span>
        </div>

        {expandable && onExpand && (
          <button
            type="button"
            className="lumina-map-expand-btn"
            onClick={onExpand}
            aria-label="Expand route map"
          >
            <span>Expand</span>
            <Maximize2 size={12} />
          </button>
        )}
      </div>

      {filtered.map((stop) => {
        const isSelected = stop.id === activeStop?.id;
        const pinColor = CATEGORY_COLORS[stop.category] ?? '#0071E3';
        return (
          <motion.button
            key={stop.id}
            type="button"
            whileTap={{ scale: 0.94 }}
            transition={springTactile}
            className={`lumina-map-pin ${isSelected ? 'is-selected' : ''}`.trim()}
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            aria-label={`${stop.index + 1}. ${stop.title}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(stop.id)}
          >
            <span className="lumina-map-pin-badge" style={{ backgroundColor: pinColor }}>
              {stop.index + 1}
            </span>
            <span className="lumina-map-pin-label">{stop.title}</span>
          </motion.button>
        );
      })}

      {activeStop && (
        <div className="lumina-map-stop-card" role="status" aria-live="polite">
          <div className="lumina-map-stop-top">
            <span className="lumina-map-stop-idx">{activeStop.index + 1}</span>
            <strong className="lumina-map-stop-title">{activeStop.title}</strong>
            {activeStop.time && (
              <span className="lumina-map-stop-time lumina-tabular">{activeStop.time}</span>
            )}
          </div>
          {activeStop.subtitle && <p className="lumina-map-stop-desc">{activeStop.subtitle}</p>}
          {activeStop.detourNote && (
            <p className="lumina-map-detour">Worth a detour: {activeStop.detourNote}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function RouteMapRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const title = readOptionalString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const bounds = readGeoBounds(props.bounds);
  const features = readRecordArray(props.features);
  const routeStyle = readString(props.routeStyle, 'orthogonal');
  const expandable = readBoolean(props.expandable, true);
  const height = readNumber(props.height, 290);
  const rawStops = readRecordArray(props.stops);

  const normalized = rawStops.map((s, idx) => ({
    id: readString(s.id, `stop-${idx}`),
    title: readString(s.title, `Stop ${idx + 1}`),
    subtitle: readOptionalString(s.subtitle),
    time: readOptionalString(s.time),
    category: readString(s.category, 'Stops'),
    detourNote: readOptionalString(s.detourNote),
    lat: readNumber(s.lat, 0),
    lng: readNumber(s.lng, 0),
  }));

  const projected = projectStops(bounds, normalized);
  const categories = Array.from(new Set(normalized.map((s) => s.category)));

  const fallbackId = projected[0]?.id ?? '';
  const propVal = readString(props.value, fallbackId);
  const [localId, setLocalId] = React.useState(propVal);
  const [activeCat, setActiveCat] = React.useState(readString(props.categoryFilter, 'all'));
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    setLocalId(propVal);
  }, [propVal]);

  const selectedId = isCallable(props.setValue) ? propVal : localId;

  const selectStop = (id: string) => {
    if (isCallable(props.setValue)) {
      invokeSetter(props.setValue, id);
    } else {
      setLocalId(id);
    }
  };

  return (
    <section
      className="lumina-route-map"
      style={weightStyle(props.weight)}
      aria-label={title ?? 'Interactive route map'}
    >
      {(title || subtitle) && (
        <header className="lumina-route-map-header">
          {title && <h3 className="lumina-route-map-title">{title}</h3>}
          {subtitle && <p className="lumina-route-map-subtitle">{subtitle}</p>}
        </header>
      )}

      <MapCanvas
        features={features}
        routeStyle={routeStyle}
        stops={projected}
        selectedId={selectedId}
        onSelect={selectStop}
        categories={categories}
        activeCat={activeCat}
        onSelectCat={setActiveCat}
        expandable={expandable}
        onExpand={() => setExpanded(true)}
        height={height}
      />

      <AdaptiveOverlay
        open={expanded}
        onOpenChange={setExpanded}
        title={title ?? 'Route Map'}
        size="lg"
      >
        <MapCanvas
          features={features}
          routeStyle={routeStyle}
          stops={projected}
          selectedId={selectedId}
          onSelect={selectStop}
          categories={categories}
          activeCat={activeCat}
          onSelectCat={setActiveCat}
          expandable={false}
          height={420}
        />
      </AdaptiveOverlay>
    </section>
  );
}
