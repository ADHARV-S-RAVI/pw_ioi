import { Buffer } from 'buffer';
window.Buffer = Buffer;
window.global = window;
window.process = { env: {} };
globalThis.Buffer = Buffer;
globalThis.global = globalThis;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
