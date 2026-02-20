import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Pera Wallet / WalletConnect Polyfills
import { Buffer } from 'buffer';
window.Buffer = Buffer;
window.global = window;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
