import React from 'react';
import { SXS_IMAGES } from './openai-sxs-assets';
import type { OpenAiSxsShowcaseItem } from './openai-sxs-data';

function PromptBubble({ text }: { text: string }) {
  return (
    <div className="oai-prompt-row">
      <div className="oai-prompt-bubble">{text}</div>
    </div>
  );
}

function BicycleOpenAiMock({ prompt }: { prompt: string }) {
  const [group, setGroup] = React.useState<'all' | 'drive' | 'control' | 'frame'>('all');
  const [pin, setPin] = React.useState<number>(0);
  const [gear, setGear] = React.useState(4);
  const [rpm, setRpm] = React.useState(80);

  const pins = [
    { id: 0, grp: 'drive', x: 24, y: 63, title: '7-Cog Rear Cassette', tag: '11–28T', body: 'Rear derailleur steps chain tension across 7 sprockets from climbing torque to flat-out speed.' },
    { id: 1, grp: 'drive', x: 46, y: 66, title: '44T Front Chainring', tag: '44T', body: 'Crank arms convert pedal cadence into linear chain pull along the lower drivetrain run.' },
    { id: 2, grp: 'control', x: 64, y: 21, title: 'Indexed Thumb Shifter', tag: 'Cockpit', body: 'Discrete cable clicks index rear cogs while dual levers actuate rim brake calipers.' },
    { id: 3, grp: 'frame', x: 48, y: 42, title: 'Double-Diamond Frame', tag: 'Chromoly', body: 'Two triangulated tubes balance lateral stiffness with vertical road compliance.' },
  ];

  const ratio = (1.25 + gear * 0.38).toFixed(2);
  const speed = (rpm * (0.16 + gear * 0.045)).toFixed(1);

  return (
    <div className="oai-mock-page">
      <PromptBubble text={prompt} />
      <div className="oai-card">
        <div className="oai-row-between">
          <div>
            <div className="oai-h3">7-Speed Commuter Bicycle</div>
            <div className="oai-sub">Interactive subsystem schematic · Select a group or pin</div>
          </div>
          <div className="oai-pill-tabs">
            {([
              ['all', 'All systems'],
              ['drive', 'Drivetrain'],
              ['control', 'Brakes & Steering'],
              ['frame', 'Frame'],
            ] as const).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                className={`oai-pill-tab ${group === k ? 'is-active' : ''}`}
                onClick={() => setGroup(k)}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="oai-diagram-box">
          <svg viewBox="0 0 640 260" className="oai-bike-svg" aria-hidden="true">
            <circle cx="152" cy="172" r="66" fill="none" stroke="currentColor" strokeOpacity="0.32" strokeWidth="8" />
            <circle cx="488" cy="172" r="66" fill="none" stroke="currentColor" strokeOpacity="0.32" strokeWidth="8" />
            <circle cx="152" cy="172" r="18" fill="none" stroke="#10a37f" strokeWidth="3" />
            <circle cx="294" cy="175" r="24" fill="none" stroke="#10a37f" strokeWidth="3.5" />
            <path d="M152 156 L294 152 L294 196 L152 188 Z" fill="none" stroke="#10a37f" strokeWidth="2.5" strokeDasharray="6 4" />
            <path d="M152 172 L248 92 L416 92 L294 175 Z" fill="none" stroke="currentColor" strokeOpacity="0.72" strokeWidth="5" strokeLinejoin="round" />
            <path d="M248 92 L294 175 M232 82 L268 82" stroke="currentColor" strokeOpacity="0.72" strokeWidth="5" strokeLinecap="round" />
            <path d="M488 172 L404 58 L434 52" fill="none" stroke="currentColor" strokeOpacity="0.78" strokeWidth="5" strokeLinecap="round" />
          </svg>
          {pins.map((p, idx) => {
            const muted = group !== 'all' && group !== p.grp;
            return (
              <button
                key={p.id}
                type="button"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`oai-pin ${pin === idx ? 'is-active' : ''} ${muted ? 'is-muted' : ''}`}
                onClick={() => setPin(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
          <span className="oai-rpm-tag">{rpm} RPM · Gear {gear}</span>
        </div>

        <div className="oai-2col">
          {pins.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`oai-mini-card ${pin === idx ? 'is-active' : ''}`}
              onClick={() => setPin(idx)}
            >
              <div className="oai-row-between">
                <strong>{p.title}</strong>
                <span className="oai-tag">{p.tag}</span>
              </div>
              <p>{p.body}</p>
            </button>
          ))}
        </div>

        <div className="oai-subcard">
          <div className="oai-2col">
            <label className="oai-slider-lbl">
              <div className="oai-row-between">
                <span>Selected rear gear</span>
                <strong>Gear {gear}</strong>
              </div>
              <input
                type="range"
                min={1}
                max={7}
                value={gear}
                data-oai-gear-slider="1"
                onChange={(e) => setGear(Number(e.target.value))}
              />
            </label>
            <label className="oai-slider-lbl">
              <div className="oai-row-between">
                <span>Pedal cadence</span>
                <strong>{rpm} RPM</strong>
              </div>
              <input
                type="range"
                min={50}
                max={110}
                step={5}
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="oai-2col" style={{ marginTop: 8 }}>
            <div className="oai-stat-box">
              <span>Gear Ratio</span>
              <strong>{ratio}x</strong>
            </div>
            <div className="oai-stat-box">
              <span>Estimated Speed</span>
              <strong>{speed} km/h</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SfRouteOpenAiMock({ prompt }: { prompt: string }) {
  const [activeStop, setActiveStop] = React.useState(0);
  const [cat, setCat] = React.useState('All');
  const stops = [
    { name: 'Ferry Building', time: '9:00 AM', cat: 'Food', x: 76, y: 42, note: 'Artisan coffee & bayfront arcade' },
    { name: 'Chinatown + Cable Car', time: '10:30 AM', cat: 'Culture', x: 66, y: 47, note: 'Dragon Gate walk & Powell-Hyde climb' },
    { name: 'Lombard Street', time: '12:00 PM', cat: 'Views', x: 56, y: 31, note: 'Eight brick hairpin switchbacks' },
    { name: 'Pier 39 · Wharf', time: '1:15 PM', cat: 'Food', x: 60, y: 22, note: 'Prime deck for 1:30 PM Blue Angels flyover' },
    { name: 'Palace of Fine Arts', time: '3:15 PM', cat: 'Culture', x: 37, y: 28, note: 'Greco-Roman rotunda & lagoon' },
    { name: 'Crissy Field', time: '5:00 PM', cat: 'Views', x: 25, y: 26, note: 'Golden Gate promenade -> Alamo Square sunset' },
  ];
  const visible = stops.filter((s) => cat === 'All' || s.cat === cat);
  const chosen = stops[activeStop] ?? stops[0]!;

  return (
    <div className="oai-mock-page">
      <PromptBubble text={prompt} />
      <div className="oai-prose-block">
        <div className="oai-h3">San Francisco in one day</div>
        <p className="oai-p">
          I’d plan a <strong>9 AM–7 PM route</strong> that starts downtown, takes you through the city’s iconic streets and waterfront, and finishes with panoramic views at sunset.
        </p>
        <div className="oai-3photo">
          <img src={SXS_IMAGES.sfGoldenGate} alt="Golden Gate Bridge" />
          <img src={SXS_IMAGES.sfLombard} alt="Lombard Street" />
          <img src={SXS_IMAGES.sfPalace} alt="Palace of Fine Arts" />
        </div>
        <p className="oai-p">
          <strong>There’s a bonus if you’re going today:</strong> it’s Fleet Week, and the Blue Angels practice between 1 PM and 5 PM over the bay.{' '}
          <span className="oai-cite-pill">San Francisco Chronicle</span>
        </p>

        <div className="oai-map-box">
          <svg viewBox="0 0 640 300" className="oai-map-svg" aria-hidden="true">
            <rect width="640" height="300" className="oai-water" />
            <path d="M 88 300 L 96 142 L 154 78 L 285 68 L 412 58 L 516 112 L 538 300 Z" className="oai-land" />
            <rect x="96" y="178" width="160" height="32" rx="6" className="oai-park" />
            <polyline points="486,126 422,141 358,93 384,66 237,84 160,78" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="oai-map-top">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="oai-map-pill" aria-label="Filter SF stops">
              <option value="All">All groups</option>
              <option value="Food">Food</option>
              <option value="Culture">Culture</option>
              <option value="Views">Views</option>
            </select>
            <span className="oai-map-pill">Expand ⤢</span>
          </div>
          {visible.map((s) => {
            const idx = stops.indexOf(s);
            return (
              <button
                key={s.name}
                type="button"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                className={`oai-map-pin ${idx === activeStop ? 'is-active' : ''}`}
                onClick={() => setActiveStop(idx)}
              >
                <span className="oai-map-dot">{idx + 1}</span>
                <span className="oai-map-lbl">{s.name}</span>
              </button>
            );
          })}
          <div className="oai-map-footer">
            <strong>{activeStop + 1}. {chosen.name}</strong> · <span>{chosen.time}</span> — {chosen.note}
          </div>
        </div>
      </div>
    </div>
  );
}

function LambRoastOpenAiMock({ prompt }: { prompt: string }) {
  const [guests, setGuests] = React.useState(6);
  const [veg, setVeg] = React.useState(1);
  const [done, setDone] = React.useState<string[]>(['s1', 's2']);
  const [copied, setCopied] = React.useState(false);

  const meatEaters = Math.max(0, guests - veg);
  const steps = [
    { id: 's1', time: 'Sat PM', title: 'Bake orange & olive oil cake ahead' },
    { id: 's2', time: '9:30 AM', title: 'Score lamb shoulder & rub garlic-herb paste' },
    { id: 's3', time: '10:00 AM', title: 'Slow-roast covered at 160°C over lemon & wine (3h)' },
    { id: 's4', time: '1:00 PM', title: 'Roast spiced whole cauliflower & potatoes at 210°C' },
    { id: 's5', time: '1:45 PM', title: 'Toss tomato-herb salad & warm pita bread' },
  ];

  return (
    <div className="oai-mock-page">
      <PromptBubble text={prompt} />
      <div className="oai-stack">
        <div className="oai-dish-row">
          <img src={SXS_IMAGES.herbSalad} alt="Tomato salad" />
          <div>
            <div className="oai-eyebrow">FRESH SIDE</div>
            <strong>Tomato, cucumber &amp; herb salad</strong>
            <p>Cherry tomatoes, cucumber, red onion, parsley, mint &amp; red-wine vinaigrette.</p>
          </div>
        </div>
        <div className="oai-dish-row">
          <img src={SXS_IMAGES.oliveCake} alt="Olive oil cake" />
          <div>
            <div className="oai-eyebrow">DESSERT</div>
            <strong>Orange &amp; olive oil cake</strong>
            <p>With Greek yogurt, honey and pistachios. Made the previous day.</p>
          </div>
        </div>

        <div className="oai-card">
          <div className="oai-h3">Shopping quantities — adjust as RSVPs come in</div>
          <div className="oai-2col">
            <div className="oai-stepper">
              <span>Total guests</span>
              <div>
                <button type="button" onClick={() => setGuests((g) => Math.max(2, g - 1))}>−</button>
                <strong data-oai-guests="1">{guests}</strong>
                <button type="button" data-oai-inc-guests="1" onClick={() => setGuests((g) => Math.min(16, g + 1))}>+</button>
              </div>
            </div>
            <div className="oai-stepper">
              <span>Vegetarians</span>
              <div>
                <button type="button" onClick={() => setVeg((v) => Math.max(0, v - 1))}>−</button>
                <strong>{veg}</strong>
                <button type="button" onClick={() => setVeg((v) => Math.min(8, v + 1))}>+</button>
              </div>
            </div>
          </div>

          <div className="oai-kv-rows">
            <div><span>Bone-in lamb shoulder</span><strong>{(meatEaters * 0.46).toFixed(1)} kg</strong></div>
            <div><span>Whole spiced cauliflower</span><strong>{Math.ceil(Math.max(1, veg) / 2)} large</strong></div>
            <div><span>Lemon-oregano potatoes</span><strong>{(guests * 0.3).toFixed(1)} kg</strong></div>
            <div><span>Barrel-aged feta &amp; hummus</span><strong>{guests * 45} g · {guests * 50} g</strong></div>
            <div><span>Warm pita bread</span><strong>{Math.ceil(guests * 1.35)} pieces</strong></div>
          </div>
          <button
            type="button"
            className="oai-ghost-wide"
            onClick={() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? '✓ Copied shopping quantities' : 'Copy shopping quantities'}
          </button>
        </div>

        <div className="oai-card">
          <div className="oai-row-between">
            <div className="oai-h3">Sunday Cooking Timeline</div>
            <span className="oai-tag">{done.length} of {steps.length}</span>
          </div>
          {steps.map((st) => {
            const checked = done.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                className={`oai-check-row ${checked ? 'is-done' : ''}`}
                onClick={() =>
                  setDone((prev) => (prev.includes(st.id) ? prev.filter((x) => x !== st.id) : [...prev, st.id]))
                }
              >
                <span className="oai-check-dot">{checked ? '✓' : ''}</span>
                <span className="oai-check-time">{st.time}</span>
                <span className="oai-check-txt">{st.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DogVestOpenAiMock({ prompt }: { prompt: string }) {
  const [vibe, setVibe] = React.useState<'trail' | 'urban' | 'cozy'>('trail');
  const [color, setColor] = React.useState('Olive');
  const cards = [
    { id: 'trail' as const, label: '01 · Trail utility', desc: 'Rugged, sporty, built for adventures.', img: SXS_IMAGES.vestTrail },
    { id: 'urban' as const, label: '02 · Urban minimal', desc: 'Clean architectural lines for city walks.', img: SXS_IMAGES.vestUrban },
    { id: 'cozy' as const, label: '03 · Cozy premium', desc: 'Soft quilted warmth for crisp mornings.', img: SXS_IMAGES.vestCozy },
  ];
  const swatches = [
    { name: 'Olive', hex: '#636B46' },
    { name: 'Graphite', hex: '#2B2E33' },
    { name: 'Sand', hex: '#D4C5AA' },
    { name: 'Rust', hex: '#C86428' },
    { name: 'Slate', hex: '#4A7292' },
  ];
  const active = cards.find((c) => c.id === vibe) ?? cards[0]!;

  return (
    <div className="oai-mock-page">
      <PromptBubble text={prompt} />
      <div className="oai-stack">
        <div>
          <div className="oai-h3">Dog vest moodboard</div>
          <div className="oai-sub">Three design directions for a stylish, functional dog vest. Pick a vibe to explore.</div>
        </div>
        <div className="oai-3photo is-tall">
          {cards.map((c) => (
            <button
              key={c.id}
              type="button"
              data-oai-vibe={c.id}
              className={`oai-vibe-card ${vibe === c.id ? 'is-active' : ''}`}
              onClick={() => setVibe(c.id)}
            >
              <img src={c.img} alt={c.label} />
              <div className="oai-vibe-foot">
                <span>{c.label}</span>
                {vibe === c.id && <span className="oai-vibe-check">✓</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="oai-card">
          <div className="oai-h3">{active.label}</div>
          <div className="oai-sub">{active.desc} · Colorway: {color}</div>
          <div className="oai-2col">
            <figure className="oai-fig">
              <img src={SXS_IMAGES.fabricRipstop} alt="Fabric inspiration" />
              <figcaption>Fabric inspiration</figcaption>
            </figure>
            <figure className="oai-fig">
              <img src={SXS_IMAGES.hardwareBuckle} alt="Hardware & details" />
              <figcaption>Hardware &amp; details</figcaption>
            </figure>
          </div>
          <div className="oai-sub" style={{ fontWeight: 600 }}>Color direction</div>
          <div className="oai-swatches">
            {swatches.map((sw) => (
              <button
                key={sw.name}
                type="button"
                data-oai-swatch={sw.name}
                className={`oai-swatch ${color === sw.name ? 'is-active' : ''}`}
                onClick={() => setColor(sw.name)}
              >
                <span className="oai-swatch-circle" style={{ backgroundColor: sw.hex }}>
                  {color === sw.name ? '✓' : ''}
                </span>
                <span>{sw.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StemQuizOpenAiMock({ prompt }: { prompt: string }) {
  const [tab, setTab] = React.useState<'gdp' | 'clt'>('gdp');
  const [c, setC] = React.useState(600);
  const [inv, setInv] = React.useState(225);
  const [g, setG] = React.useState(200);
  const [nx, setNx] = React.useState(50);
  const [samples, setSamples] = React.useState(250);
  const [bins, setBins] = React.useState([2, 14, 48, 96, 61, 23, 6]);
  const [picked, setPicked] = React.useState<string | null>(null);

  const total = c + inv + g + nx;
  const posSum = Math.max(1, c + inv + g + Math.max(0, nx));

  const drawMore = () => {
    setSamples((s) => s + 100);
    setBins((prev) => prev.map((b, idx) => b + [1, 6, 18, 38, 22, 11, 4][idx]!));
  };

  const maxBin = Math.max(1, ...bins);

  return (
    <div className="oai-mock-page">
      <PromptBubble text={prompt} />
      <div className="oai-stack">
        <div className="oai-pill-tabs">
          <button type="button" className={`oai-pill-tab ${tab === 'gdp' ? 'is-active' : ''}`} onClick={() => setTab('gdp')}>
            GDP Formula (C+I+G+NX)
          </button>
          <button type="button" data-oai-tab-clt="1" className={`oai-pill-tab ${tab === 'clt' ? 'is-active' : ''}`} onClick={() => setTab('clt')}>
            Central Limit Theorem
          </button>
        </div>

        {tab === 'gdp' ? (
          <div className="oai-card">
            <div className="oai-h3">Total GDP (Y) = ${total}B</div>
            <div className="oai-gdp-bar">
              <div style={{ width: `${(c / posSum) * 100}%`, background: '#3b82f6' }}>C ${c}B</div>
              <div style={{ width: `${(inv / posSum) * 100}%`, background: '#10a37f' }}>I ${inv}B</div>
              <div style={{ width: `${(g / posSum) * 100}%`, background: '#6366f1' }}>G ${g}B</div>
              {nx > 0 && <div style={{ width: `${(nx / posSum) * 100}%`, background: '#d97706' }}>NX</div>}
            </div>
            {nx < 0 && (
              <div className="oai-warn-note">Trade deficit (NX = ${nx}B): imports exceed exports, subtracting from headline GDP.</div>
            )}
            <div className="oai-2col">
              <label className="oai-slider-lbl">
                <div className="oai-row-between"><span>Consumption (C)</span><strong>${c}B</strong></div>
                <input type="range" min={200} max={900} step={25} value={c} onChange={(e) => setC(Number(e.target.value))} />
              </label>
              <label className="oai-slider-lbl">
                <div className="oai-row-between"><span>Investment (I)</span><strong>${inv}B</strong></div>
                <input type="range" min={50} max={500} step={25} value={inv} onChange={(e) => setInv(Number(e.target.value))} />
              </label>
              <label className="oai-slider-lbl">
                <div className="oai-row-between"><span>Government (G)</span><strong>${g}B</strong></div>
                <input type="range" min={50} max={500} step={25} value={g} onChange={(e) => setG(Number(e.target.value))} />
              </label>
              <label className="oai-slider-lbl">
                <div className="oai-row-between"><span>Net Exports (NX)</span><strong>${nx}B</strong></div>
                <input type="range" min={-150} max={150} step={25} data-oai-nx="1" value={nx} onChange={(e) => setNx(Number(e.target.value))} />
              </label>
            </div>
          </div>
        ) : (
          <div className="oai-card">
            <div className="oai-row-between">
              <div>
                <div className="oai-h3">Central Limit Theorem Sampler</div>
                <div className="oai-sub">Samples drawn: {samples} · Bell curve convergence</div>
              </div>
              <button type="button" data-oai-draw="1" className="oai-primary-pill" onClick={drawMore}>
                + Draw 100 samples
              </button>
            </div>
            <div className="oai-hist">
              {bins.map((b, i) => (
                <div key={i} className="oai-hist-col">
                  <div className="oai-hist-bar" style={{ height: `${Math.max(8, (b / maxBin) * 120)}px` }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="oai-card">
          <div className="oai-row-between">
            <div className="oai-h3">If imports rise by $80B alone, what happens to GDP?</div>
            <span className="oai-tag">1 of 2</span>
          </div>
          {[
            { id: 'a', letter: 'A', txt: 'GDP increases by $80B because total spending rose.' },
            { id: 'b', letter: 'B', txt: 'Net exports (NX) fall by $80B, lowering headline GDP by $80B.' },
            { id: 'c', letter: 'C', txt: 'Government spending (G) automatically offsets the change.' },
          ].map((opt) => {
            const isSel = picked === opt.id;
            const cls = isSel ? (opt.id === 'b' ? 'is-correct' : 'is-wrong') : '';
            return (
              <button
                key={opt.id}
                type="button"
                data-oai-quiz={opt.id}
                className={`oai-quiz-opt ${cls}`}
                onClick={() => setPicked(opt.id)}
              >
                <span className="oai-quiz-badge">{opt.letter}</span>
                <div>
                  <div>{opt.txt}</div>
                  {isSel && (
                    <div className="oai-quiz-exp">
                      {opt.id === 'b'
                        ? 'Correct. NX = Exports - Imports, so higher standalone imports reduce NX by $80B.'
                        : 'Not quite — imports were produced abroad, reducing Net Exports (NX).'}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function OpenAiReferencePane({
  item,
  theme,
}: {
  item: OpenAiSxsShowcaseItem;
  theme: 'light' | 'dark';
}): React.ReactNode {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [arcadeTab, setArcadeTab] = React.useState<'console' | 'drum'>('console');
  const [drumPlaying, setDrumPlaying] = React.useState(true);
  const [drumStep, setDrumStep] = React.useState(0);
  const [drumGrid, setDrumGrid] = React.useState<boolean[][]>(() => [
    [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    [false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false],
    [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  ]);

  React.useEffect(() => {
    if (arcadeTab !== 'drum' || !drumPlaying) return undefined;
    const id = window.setInterval(() => setDrumStep((s) => (s + 1) % 16), 125);
    return () => window.clearInterval(id);
  }, [arcadeTab, drumPlaying]);

  React.useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (win) {
      win.postMessage({ type: 'lumina-sxs-theme', theme }, '*');
    }
  }, [theme, item.id, arcadeTab]);

  if (item.id === 'pixel-palace') {
    const tracks = [
      { name: 'KICK', color: '#df856c', key: 'A' },
      { name: 'SNARE', color: '#e2b866', key: 'S' },
      { name: 'CH', color: '#7da6d8', key: 'D' },
      { name: 'OH', color: '#9c8ade', key: 'F' },
      { name: 'CLAP', color: '#8ec49b', key: 'G' },
      { name: 'TOM', color: '#d48bb8', key: 'H' },
    ];
    return (
      <div className="oai-iframe-wrap">
        <div className="oai-sub-switcher">
          <button
            type="button"
            className={`oai-pill-tab ${arcadeTab === 'console' ? 'is-active' : ''}`}
            onClick={() => setArcadeTab('console')}
          >
            Official Pixel Palace CDN
          </button>
          <button
            type="button"
            data-oai-drum-tab="1"
            className={`oai-pill-tab ${arcadeTab === 'drum' ? 'is-active' : ''}`}
            onClick={() => setArcadeTab('drum')}
          >
            ChatGPT Drum Lab 01
          </button>
        </div>
        {arcadeTab === 'console' ? (
          <iframe
            ref={iframeRef}
            title={item.title}
            src={`${item.iframeUrl}?theme=${theme}`}
            className="oai-ref-iframe"
            onLoad={() => iframeRef.current?.contentWindow?.postMessage({ type: 'lumina-sxs-theme', theme }, '*')}
          />
        ) : (
          <div className="oai-drum-mock">
            <div className="oai-row-between">
              <div>
                <strong>DRUM / LAB 01</strong>
                <div className="oai-sub">Rhythm playground · 16-step machine</div>
              </div>
              <span className="oai-ready-dot">● READY</span>
            </div>
            <div className="lumina-drum-panel">
              <div className="lumina-drum-transport">
                <button
                  type="button"
                  className={`lumina-drum-play-btn ${drumPlaying ? 'is-playing' : ''}`}
                  onClick={() => setDrumPlaying((p) => !p)}
                >
                  {drumPlaying ? 'Pause' : '▶ Play'}
                </button>
                <button type="button" className="lumina-drum-ghost-btn" onClick={() => setDrumPlaying(false)}>
                  ■ Stop
                </button>
                <span className="lumina-drum-ghost-btn is-right">Randomize</span>
              </div>
              <div className="lumina-drum-knobs">
                <div className="lumina-drum-knob"><span>TEMPO <strong>120 BPM</strong></span><input type="range" min={70} max={180} defaultValue={120} /></div>
                <div className="lumina-drum-knob"><span>SWING <strong>0%</strong></span><input type="range" min={0} max={60} defaultValue={0} /></div>
                <div className="lumina-drum-knob"><span>VOLUME <strong>75%</strong></span><input type="range" min={0} max={100} defaultValue={75} /></div>
              </div>
            </div>
            <div className="lumina-drum-panel">
              <div className="lumina-drum-seq-top">
                <div>
                  <strong>Step sequencer</strong>
                  <span className="lumina-drum-seq-hint">Tap cells to program your groove</span>
                </div>
              </div>
              <div className="oai-drum-rows">
                {tracks.map((tr, r) => (
                  <div key={tr.name} className="oai-drum-row">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span className="lumina-drum-dot" style={{ backgroundColor: tr.color }} />
                      {tr.name}
                    </span>
                    <div className="oai-drum-cells">
                      {drumGrid[r]!.map((on, c) => (
                        <button
                          key={c}
                          type="button"
                          aria-label={`OpenAI ${tr.name} step ${c + 1}`}
                          style={on ? { backgroundColor: tr.color } : undefined}
                          className={`oai-drum-cell ${drumPlaying && drumStep === c ? 'is-head' : ''}`}
                          onClick={() =>
                            setDrumGrid((prev) =>
                              prev.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? !v : v)) : row)),
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lumina-drum-pads">
              {tracks.slice(0, 4).map((tr) => (
                <div key={tr.name} className="lumina-drum-pad">
                  <div className="lumina-drum-pad-top">
                    <span className="lumina-drum-dot" style={{ backgroundColor: tr.color }} />
                    <kbd>{tr.key}</kbd>
                  </div>
                  <strong>{tr.name}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (item.iframeUrl) {
    return (
      <div className="oai-iframe-wrap">
        <iframe
          ref={iframeRef}
          title={item.title}
          src={`${item.iframeUrl}?theme=${theme}`}
          className="oai-ref-iframe"
          onLoad={() => iframeRef.current?.contentWindow?.postMessage({ type: 'lumina-sxs-theme', theme }, '*')}
        />
      </div>
    );
  }

  switch (item.id) {
    case 'bicycle-7speed':
      return <BicycleOpenAiMock prompt={item.prompt} />;
    case 'sf-one-day':
      return <SfRouteOpenAiMock prompt={item.prompt} />;
    case 'lamb-roast':
      return <LambRoastOpenAiMock prompt={item.prompt} />;
    case 'dog-vest':
      return <DogVestOpenAiMock prompt={item.prompt} />;
    case 'gdp-clt-quiz':
      return <StemQuizOpenAiMock prompt={item.prompt} />;
    default:
      return null;
  }
}
