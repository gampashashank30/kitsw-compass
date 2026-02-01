import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Confirmation flag for the safety timeout in index.html
    (window as any).reactMounted = true;
  } catch (err: any) {
    console.error("KITSW Compass: Boot Error", err);
    if ((window as any).onerror) {
      (window as any).onerror(`System Boot Failure: ${err.message}`, "index.tsx", 0, 0, err);
    }
  }
}