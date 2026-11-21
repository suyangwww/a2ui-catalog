import React from 'react';
import { MessageProcessor, type SurfaceModel } from '@a2ui/web_core';
import type { ReactCatalogComponent } from '@a2ui/react';
import { processLuminaMessages } from '@a2ui-catalog/core';
import { LuminaProvider, LuminaSurface, luminaReactCatalog } from '@a2ui-catalog/react';
import { ArrowRight, Play, X } from 'lucide-react';
import {
  DEEPER_TOURS,
  HOME_CATALOG_FAMILIES,
  HOME_DEMO_SCENARIOS,
  QUICK_TOUR_CHAPTERS,
  QUICK_TOUR_VIDEO,
  type DeeperTourItem,
  type HomeDemoScenario,
} from './home-data';
import './HomePage.css';

interface HomePageProps {
  theme: 'light' | 'dark';
  totalComponents: number;
  onOpenShowcases: () => void;
  onOpenPlaybook: () => void;
  onSelectComponent: (componentName: string) => void;
}

export function HomePage({
  theme,
  totalComponents,
  onOpenShowcases,
  onOpenPlaybook,
  onSelectComponent,
}: HomePageProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = React.useState(0);
  const [activeTourModal, setActiveTourModal] = React.useState<DeeperTourItem | null>(null);
  const [scenarioId, setScenarioId] = React.useState<HomeDemoScenario['id']>('dinner');
  const [demoSurfaces, setDemoSurfaces] = React.useState<SurfaceModel<ReactCatalogComponent>[]>([]);
  const [activeFamilyId, setActiveFamilyId] = React.useState(HOME_CATALOG_FAMILIES[0].id);
  const [showDevNames, setShowDevNames] = React.useState(false);

  const activeScenario =
    HOME_DEMO_SCENARIOS.find((s) => s.id === scenarioId) ?? HOME_DEMO_SCENARIOS[0];
  const activeFamily =
    HOME_CATALOG_FAMILIES.find((f) => f.id === activeFamilyId) ?? HOME_CATALOG_FAMILIES[0];
  const activeChapter = QUICK_TOUR_CHAPTERS[activeChapterIdx] ?? QUICK_TOUR_CHAPTERS[0];

  React.useEffect(() => {
    const proc = new MessageProcessor<ReactCatalogComponent>([luminaReactCatalog], () => {});
    processLuminaMessages(proc, activeScenario.messages);
    setDemoSurfaces(Array.from(proc.model.surfacesMap.values()));
  }, [activeScenario]);

  React.useEffect(() => {
    if (!activeTourModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTourModal(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTourModal]);

  const jumpToChapter = (idx: number) => {
    const chapter = QUICK_TOUR_CHAPTERS[idx];
    if (!chapter) return;
    setActiveChapterIdx(idx);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = chapter.startSec;
      void vid.play().catch(() => {});
    }
  };

  const handleVideoTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const t = vid.currentTime;
    let matched = 0;
    for (let i = 0; i < QUICK_TOUR_CHAPTERS.length; i++) {
      if (t >= QUICK_TOUR_CHAPTERS[i].startSec) {
        matched = i;
      }
    }
    if (matched !== activeChapterIdx) {
      setActiveChapterIdx(matched);
    }
  };

  return (
    <main className="home-page">
      <div className="home-inner">
        {/* 1. Plain-English Hero */}
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-eyebrow">
              A2UI Lumina Catalog · Open Visual Toolkit for AI Assistants
            </p>
            <h1 className="home-title">
              Turn long AI text replies into clear cards, charts, and tap-friendly controls.
            </h1>
            <p className="home-lead">
              Most AI assistants still answer everything with walls of paragraphs.{' '}
              <strong>Lumina</strong> gives AI a trusted menu of{' '}
              <strong>{totalComponents} ready-made visual building blocks</strong>—so people can
              drag a budget slider, split a dinner bill, inspect a map, or approve an action in one
              tap on any screen.
            </p>
          </div>

          <div className="home-hero-actions">
            <a
              id="home-cta-watch"
              href="#home-walkthrough"
              className="home-cta-primary"
              onClick={() => {
                const vid = videoRef.current;
                if (vid && vid.paused) {
                  void vid.play().catch(() => {});
                }
              }}
            >
              <Play size={15} />
              <span>Watch 60-Second Tour</span>
            </a>
            <a id="home-cta-try" href="#home-playground" className="home-cta-secondary">
              <span>Try Plain Text vs. Lumina</span>
            </a>
            <a id="home-cta-browse" href="#home-catalog" className="home-cta-link">
              <span>Browse all {totalComponents} building blocks</span>
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="home-facts-strip" aria-label="Catalog highlights">
            <div className="home-fact">
              <span className="home-fact-num">{totalComponents}</span>
              <span className="home-fact-label">Visual Building Blocks</span>
              <span className="home-fact-sub">Charts, maps, pickers, approvals &amp; side docs</span>
            </div>
            <div className="home-fact">
              <span className="home-fact-num">24</span>
              <span className="home-fact-label">Instant Helpers</span>
              <span className="home-fact-sub">Live math, currency formatting &amp; safety checks</span>
            </div>
            <div className="home-fact">
              <span className="home-fact-num">3 Screens</span>
              <span className="home-fact-label">Desktop, Tablet &amp; Phone</span>
              <span className="home-fact-sub">Adapts layout &amp; Light/Dark mode automatically</span>
            </div>
            <div className="home-fact">
              <span className="home-fact-num">0 Raw Code</span>
              <span className="home-fact-label">Safe by Design (A2UI v1.0)</span>
              <span className="home-fact-sub">AI sends plain facts; the app renders trusted UI</span>
            </div>
          </div>
        </section>

        {/* 2. Hero Showcase Video Walkthrough */}
        <section id="home-walkthrough" className="home-section">
          <div className="home-section-head">
            <div>
              <h2 className="home-section-title">See Lumina in One Minute</h2>
              <p className="home-section-sub">
                One quick, plain-English walkthrough—press Play or jump directly to any chapter.
              </p>
            </div>
            <span className="home-meta-note">
              {QUICK_TOUR_VIDEO.durationLabel} · Narrated · No tech background needed
            </span>
          </div>

          <div className="home-video-card">
            <div className="home-chapter-bar" role="tablist" aria-label="Walkthrough chapters">
              {QUICK_TOUR_CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.id}
                  id={`home-chap-${chap.id}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeChapterIdx}
                  className={`home-chapter-btn ${idx === activeChapterIdx ? 'is-active' : ''}`}
                  onClick={() => jumpToChapter(idx)}
                >
                  <span className="home-chapter-time">{chap.timeLabel}</span>
                  <span className="home-chapter-title">{chap.title}</span>
                </button>
              ))}
            </div>

            <div className="home-video-stage">
              <video
                ref={videoRef}
                className="home-video-el"
                src={QUICK_TOUR_VIDEO.videoUrl}
                poster={QUICK_TOUR_VIDEO.posterUrl}
                controls
                preload="metadata"
                playsInline
                onTimeUpdate={handleVideoTimeUpdate}
              />
            </div>

            <div className="home-video-caption-bar">
              <p className="home-video-caption">“{activeChapter.caption}”</p>
            </div>
          </div>

          <div className="home-deeper-grid" aria-label="Optional deeper video walkthroughs">
            {DEEPER_TOURS.map((tour) => (
              <button
                key={tour.id}
                id={`home-tour-${tour.id}`}
                type="button"
                className="home-deeper-card"
                onClick={() => setActiveTourModal(tour)}
              >
                <div>
                  <div className="home-deeper-title">
                    <Play size={13} />
                    <span>{tour.title}</span>
                  </div>
                  <p className="home-deeper-desc">{tour.description}</p>
                </div>
                <span className="home-duration-pill">{tour.duration}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Live Interactive "Try the Difference Yourself" */}
        <section id="home-playground" className="home-section">
          <div className="home-section-head">
            <div>
              <h2 className="home-section-title">Try the Difference Yourself</h2>
              <p className="home-section-sub">
                Pick an everyday task and compare a standard text-only AI reply against a live
                interactive Lumina card.
              </p>
            </div>

            <div className="home-seg-tabs" role="tablist" aria-label="Comparison scenarios">
              {HOME_DEMO_SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  id={`home-scen-${scen.id}`}
                  type="button"
                  role="tab"
                  aria-selected={scen.id === scenarioId}
                  className={`home-seg-btn ${scen.id === scenarioId ? 'is-active' : ''}`}
                  onClick={() => setScenarioId(scen.id)}
                >
                  {scen.tabLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="home-compare-grid">
            <div className="home-compare-plain">
              <div className="home-compare-top">
                <span className="home-compare-label">Standard Plain-Text AI Reply</span>
                <span className="home-compare-hint">Requires reading &amp; re-typing</span>
              </div>
              <div className="home-prompt-bubble">{activeScenario.prompt}</div>
              <div className="home-plain-reply">
                {activeScenario.plainTextParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            <div className="home-compare-lumina" data-home-live-demo={activeScenario.id}>
              <div className="home-compare-top">
                <span className="home-compare-label is-accent">{activeScenario.luminaBadge}</span>
                <span className="home-compare-hint">{activeScenario.luminaHint}</span>
              </div>
              <div className="home-live-surface">
                <LuminaProvider theme={theme} viewport="desktop">
                  {demoSurfaces.map((s) => (
                    <LuminaSurface key={s.id} surface={s} />
                  ))}
                </LuminaProvider>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How It Works in 3 Plain-English Steps */}
        <section className="home-section">
          <div>
            <h2 className="home-section-title">How It Works (In Plain English)</h2>
            <p className="home-section-sub">
              Think of Lumina like a curated LEGO set shared between the AI assistant and your app.
            </p>
          </div>

          <div className="home-steps-grid">
            <article className="home-step-card">
              <span className="home-step-num">STEP 01</span>
              <h3 className="home-step-title">The Catalog Is the Menu</h3>
              <p className="home-step-body">
                Your app gives the AI a trusted list of {totalComponents} visual building
                blocks—charts, tables, maps, sliders, receipts, and approval cards.
              </p>
            </article>
            <article className="home-step-card">
              <span className="home-step-num">STEP 02</span>
              <h3 className="home-step-title">The AI Fills In the Facts</h3>
              <p className="home-step-body">
                The AI never writes fragile website code. It simply chooses which blocks to show and
                sends the numbers, labels, and sources.
              </p>
            </article>
            <article className="home-step-card">
              <span className="home-step-num">STEP 03</span>
              <h3 className="home-step-title">Every Screen Adapts Automatically</h3>
              <p className="home-step-body">
                Wide comparison tables and side reports on a laptop automatically turn into
                swipeable cards and bottom sheets on a phone.
              </p>
            </article>
          </div>
        </section>

        {/* 5. Scannable 49-Component Catalog by Everyday Job */}
        <section id="home-catalog" className="home-section">
          <div className="home-section-head">
            <div>
              <h2 className="home-section-title">
                What’s Inside the Catalog (All {totalComponents} Building Blocks)
              </h2>
              <p className="home-section-sub">
                Grouped by what a person is trying to do—click any card to inspect it live.
              </p>
            </div>

            <label className="home-dev-toggle" htmlFor="home-toggle-dev-names">
              <input
                id="home-toggle-dev-names"
                type="checkbox"
                checked={showDevNames}
                onChange={(e) => setShowDevNames(e.target.checked)}
              />
              <span>Show developer component names</span>
            </label>
          </div>

          <div className="home-family-pills" role="tablist" aria-label="Component job categories">
            {HOME_CATALOG_FAMILIES.map((fam) => (
              <button
                key={fam.id}
                id={`home-fam-${fam.id}`}
                type="button"
                role="tab"
                aria-selected={fam.id === activeFamilyId}
                className={`home-family-pill ${fam.id === activeFamilyId ? 'is-active' : ''}`}
                onClick={() => setActiveFamilyId(fam.id)}
              >
                {fam.label}
              </button>
            ))}
          </div>

          <div className="home-family-box">
            <div className="home-family-head">
              <h3 className="home-family-headline">{activeFamily.headline}</h3>
              <p className="home-family-summary">{activeFamily.summary}</p>
            </div>

            <div className="home-items-grid">
              {activeFamily.items.map((item) => (
                <button
                  key={item.dev}
                  type="button"
                  className="home-item-card"
                  onClick={() => onSelectComponent(item.dev)}
                >
                  <div className="home-item-top">
                    <span className="home-item-human">{item.human}</span>
                    {showDevNames && <code className="home-item-dev">{item.dev}</code>}
                  </div>
                  <p className="home-item-desc">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Progressive Disclosure Drawer for Engineers & Builders */}
        <section className="home-section">
          <details className="home-dev-drawer">
            <summary>
              <div>
                <div className="home-dev-summary-title">
                  For Engineers &amp; Product Builders — Technical Specs, Local Demo &amp;
                  Architecture
                </div>
                <div className="home-dev-summary-sub">
                  A2UI v1.0 compliance · React / SwiftUI / Compose / Flutter readiness · pnpm dev
                  quick start
                </div>
              </div>
              <span className="home-dev-chevron" aria-hidden="true">
                ▼
              </span>
            </summary>

            <div className="home-dev-body">
              <div className="home-dev-col">
                <h3>Run All 3 Local Apps (No API Key Required)</h3>
                <pre className="home-dev-pre">{`pnpm install && pnpm build
pnpm dev
# Explorer (:5173) · Studio (:5174) · A2A Agent (:10002)`}</pre>
              </div>

              <div className="home-dev-col">
                <h3>Multi-Platform &amp; Protocol Guarantees</h3>
                <ul className="home-dev-list">
                  <li>
                    <strong>100% A2UI v1.0 Superset:</strong> Includes all 18 official Basic Catalog
                    primitives &amp; 14 standard functions, plus 31 agentic components &amp; 10
                    reactive math/UX functions.
                  </li>
                  <li>
                    <strong>Framework-Free Core &amp; Tokens:</strong> Compiled{' '}
                    <code>catalog.json</code> and W3C design tokens extend cleanly to Angular,
                    Flutter, iOS (SwiftUI), and Android (Jetpack Compose).
                  </li>
                </ul>
              </div>

              <div className="home-dev-links">
                <button type="button" className="home-cta-secondary" onClick={onOpenShowcases}>
                  Open Interactive Showcases &amp; JSON Inspector
                </button>
                <button type="button" className="home-cta-secondary" onClick={onOpenPlaybook}>
                  Read the 5-Recipe Practical Playbook
                </button>
              </div>
            </div>
          </details>
        </section>
      </div>

      {/* Modal Player for Optional Deeper Walkthroughs */}
      {activeTourModal && (
        <div
          className="home-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={activeTourModal.title}
          onClick={() => setActiveTourModal(null)}
        >
          <div className="home-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="home-modal-head">
              <div>
                <div className="home-modal-title">
                  {activeTourModal.title} ({activeTourModal.duration})
                </div>
                <div className="home-meta-note">{activeTourModal.description}</div>
              </div>
              <button
                type="button"
                className="home-modal-close"
                aria-label="Close video dialog"
                onClick={() => setActiveTourModal(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="home-video-stage">
              <video
                className="home-video-el"
                src={activeTourModal.videoUrl}
                poster={activeTourModal.posterUrl}
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
