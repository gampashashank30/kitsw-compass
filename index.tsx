
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
    // Set global flag to stop the timeout timer
    (window as any).reactMounted = true;
  } catch (err: any) {
    console.error("Critical Render Error:", err);
    if ((window as any).onerror) {
      (window as any).onerror(err.message, "index.tsx", 0, 0, err);
    }
  }
}
