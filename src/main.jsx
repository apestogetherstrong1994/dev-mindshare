import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import RevenueApp from './RevenueApp.jsx';

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return hash === '#/revenue' ? <RevenueApp /> : <App />;
}

createRoot(document.getElementById('root')).render(<Root />);
