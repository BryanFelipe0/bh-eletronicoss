import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyTheme } from './config/theme';
import { reportMissingData } from './lib/links';
import './styles/global.css';

applyTheme();
reportMissingData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
