
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Mark application as successfully mounted to stop the global timeout timer
    (window as any).reactMounted = true;
    console.debug("KITSW Compass: React Application Mounted Successfully");
  } catch (err: any) {
    console.error("KITSW Compass Mount Failure:", err);
    if ((window as any).onerror) {
      (window as any).onerror(`Mount Failed: ${err.message}`, "index.tsx", 0, 0, err);
    }
  }
} else {
  console.error("KITSW Compass: Critical Error - Root element not found");
}
