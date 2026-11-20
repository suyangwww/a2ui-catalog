import React from 'react';
import ReactDOM from 'react-dom/client';
import '@a2ui-catalog/tokens/lumina-tokens.css';
import '@a2ui-catalog/react/styles.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
