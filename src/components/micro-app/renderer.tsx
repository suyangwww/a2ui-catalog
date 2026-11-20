import React from 'react';
import { Maximize2, RotateCcw } from 'lucide-react';
import {
  AdaptiveOverlay,
  LuminaHostContext,
  readBoolean,
  readOptionalNumber,
  readOptionalString,
  readString,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function buildSandboxedSrcDoc(rawHtml: string, initialDark: boolean): string {
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:;">`;
  const bridge = `<style id="lumina-sandbox-vars">
:root[data-theme="light"]{color-scheme:light;--viz-bg:#ffffff;--viz-panel:#f6f6f8;--viz-elevated:#ededf2;--viz-text:#0d0d0f;--viz-muted:#5e5e66;--viz-border:rgba(0,0,0,0.09);--viz-accent:#0071e3;--viz-emerald:#10a37f;}
:root[data-theme="dark"]{color-scheme:dark;--viz-bg:#141417;--viz-panel:#1c1c21;--viz-elevated:#26262d;--viz-text:#f5f5f7;--viz-muted:#a1a1aa;--viz-border:rgba(255,255,255,0.12);--viz-accent:#2997ff;--viz-emerald:#10a37f;}
*,*::before,*::after{box-sizing:border-box;}
html,body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;background:var(--viz-bg);color:var(--viz-text);}
</style>
<script>
document.documentElement.setAttribute('data-theme', ${initialDark ? "'dark'" : "'light'"});
window.addEventListener('message', function(ev) {
  if (ev && ev.data && ev.data.type === 'lumina:theme') {
    var t = ev.data.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    window.dispatchEvent(new CustomEvent('lumina:theme', { detail: t }));
  }
});
</script>`;
  return `<!doctype html><html data-theme="${initialDark ? 'dark' : 'light'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${csp}${bridge}</head><body>${rawHtml}</body></html>`;
}

function SandboxFrame({
  title,
  srcDoc,
  theme,
  height,
  reloadKey,
}: {
  title: string;
  srcDoc: string;
  theme: 'light' | 'dark';
  height: number;
  reloadKey: number;
}) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  React.useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (win) {
      win.postMessage({ type: 'lumina:theme', theme }, '*');
    }
  }, [theme]);

  return (
    <iframe
      key={reloadKey}
      ref={iframeRef}
      title={title}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      srcDoc={srcDoc}
      onLoad={() => {
        iframeRef.current?.contentWindow?.postMessage({ type: 'lumina:theme', theme }, '*');
      }}
      style={{ height: `${height}px` }}
      className="lumina-micro-iframe"
    />
  );
}

export function MicroAppRenderer({ props }: LuminaReactRenderArgs): React.ReactNode {
  const host = React.useContext(LuminaHostContext);
  const title = readString(props.title, 'Interactive Sandbox');
  const subtitle = readOptionalString(props.subtitle);
  const badge = readOptionalString(props.badge);
  const html = readString(props.html);
  const height = readOptionalNumber(props.height) ?? 420;
  const expandable = readBoolean(props.expandable, true);
  const chromeless = readBoolean(props.chromeless, false);

  const [reloadKey, setReloadKey] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);

  const resolvedTheme: 'light' | 'dark' = host.theme === 'dark' ? 'dark' : 'light';
  const initialDarkRef = React.useRef(resolvedTheme === 'dark');
  const srcDoc = React.useMemo(
    () => buildSandboxedSrcDoc(html, initialDarkRef.current),
    [html],
  );

  return (
    <section
      className="lumina-micro-app is-sandbox"
      style={weightStyle(props.weight)}
      aria-label={title}
    >
      {!chromeless && (
        <div className="lumina-micro-sandbox-bar">
          <div className="lumina-micro-sandbox-titles">
            <strong>{title}</strong>
            {subtitle && <span className="lumina-micro-sandbox-sub">{subtitle}</span>}
          </div>
          <div className="lumina-micro-sandbox-actions">
            {badge && <span className="lumina-micro-sandbox-badge">{badge}</span>}
            <button
              type="button"
              className="lumina-micro-icon-btn"
              aria-label={`Reset ${title}`}
              title="Reset sandbox"
              onClick={() => setReloadKey((k) => k + 1)}
            >
              <RotateCcw size={13} />
            </button>
            {expandable && (
              <button
                type="button"
                className="lumina-micro-icon-btn"
                aria-label={`Expand ${title}`}
                title="Expand"
                onClick={() => setExpanded(true)}
              >
                <Maximize2 size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      <SandboxFrame
        title={title}
        srcDoc={srcDoc}
        theme={resolvedTheme}
        height={height}
        reloadKey={reloadKey}
      />

      <AdaptiveOverlay open={expanded} onOpenChange={setExpanded} title={title} size="lg">
        <SandboxFrame
          title={`${title} (Expanded)`}
          srcDoc={srcDoc}
          theme={resolvedTheme}
          height={Math.max(height, 520)}
          reloadKey={reloadKey}
        />
      </AdaptiveOverlay>
    </section>
  );
}
