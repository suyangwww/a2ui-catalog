import React from 'react';
import { createRoot } from 'react-dom/client';
import '@a2ui-catalog/tokens/styles.css';
import '../../packages/react/src/styles/lumina-react.css';
import './preview.css';
import { PreviewApp } from './PreviewApp.js';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <PreviewApp />
    </React.StrictMode>,
  );
}
