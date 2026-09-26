import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PreferencesProvider } from './context/PreferencesContext';
import { AudioProvider } from './context/AudioContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PreferencesProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </PreferencesProvider>
  </React.StrictMode>
);
