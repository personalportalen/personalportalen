import './index.css';
import './app/App.css';
import App from './app/App.jsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { validateEnv } from './shared/config/validateEnv.js';
import { env } from './shared/config/env.js';

validateEnv();

const app = (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

createRoot(document.getElementById('root')).render(
  env.isDev ? app : <StrictMode>{app}</StrictMode>,
);
