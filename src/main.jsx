import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PreferencesProvider } from './context/PreferencesContext';
import { AudioProvider } from './context/AudioContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Quran App Error:", error, errorInfo);
  }

  handleReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#070b13',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#38bdf8' }}>
            Quran Application
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '320px', marginBottom: '20px' }}>
            A temporary issue occurred while loading. Tap below to reload fresh.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 24px',
              backgroundColor: '#38bdf8',
              color: '#070b13',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reload Quran App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PreferencesProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </PreferencesProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
