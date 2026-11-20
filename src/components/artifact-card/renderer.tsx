import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Code2,
  Database,
  FileSpreadsheet,
  FileText,
  Map,
  Sparkles,
} from 'lucide-react';
import {
  AdaptiveOverlay,
  LuminaHostContext,
  invokeAction,
  readOptionalString,
  readString,
  renderChildRef,
  springTactile,
  weightStyle,
  type LuminaReactRenderArgs,
} from '../../primitives/index.js';

function ArtifactKindIcon({ kind }: { kind: string }) {
  switch (kind) {
    case 'code':
      return <Code2 size={18} />;
    case 'itinerary':
      return <Map size={18} />;
    case 'dataset':
      return <Database size={18} />;
    case 'report':
      return <FileSpreadsheet size={18} />;
    case 'plan':
      return <Sparkles size={18} />;
    default:
      return <FileText size={18} />;
  }
}

export function ArtifactCardRenderer({
  props,
  buildChild,
}: LuminaReactRenderArgs): React.ReactNode {
  const host = React.useContext(LuminaHostContext);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const title = readString(props.title);
  const subtitle = readOptionalString(props.subtitle);
  const kind = readString(props.kind, 'document');
  const version = readOptionalString(props.version);
  const preview = readOptionalString(props.preview);
  const hasChild = Boolean(props.child);

  const handleOpen = () => {
    void invokeAction(props.action);
    if (hasChild) {
      const content = renderChildRef(buildChild, props.child);
      if (host.openArtifact) {
        host.openArtifact({ title, subtitle, kind, version, content });
      } else {
        setSheetOpen(true);
      }
    }
  };

  const wStyle = weightStyle(props.weight);

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        className="lumina-artifact-card"
        {...(wStyle ? { style: wStyle } : {})}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={springTactile}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        <div className="lumina-artifact-head">
          <span className="lumina-artifact-icon">
            <ArtifactKindIcon kind={kind} />
          </span>
          <div className="lumina-artifact-meta">
            <div className="lumina-artifact-title-row">
              <span className="lumina-artifact-title">{title}</span>
              {version && <span className="lumina-artifact-version">{version}</span>}
            </div>
            {subtitle && <div className="lumina-artifact-subtitle">{subtitle}</div>}
          </div>
          <span className="lumina-artifact-open-pill">
            <span>Open</span>
            <ArrowUpRight size={14} />
          </span>
        </div>
        {preview && <div className="lumina-artifact-preview">{preview}</div>}
      </motion.div>
      {hasChild && !host.openArtifact && (
        <AdaptiveOverlay
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title={title}
          description={subtitle}
          size="lg"
          drawerOnDesktop
        >
          {renderChildRef(buildChild, props.child)}
        </AdaptiveOverlay>
      )}
    </>
  );
}
