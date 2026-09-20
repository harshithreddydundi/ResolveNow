import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RealtimeProvider } from './context/RealtimeContext';
import AppRoutes from './routes/AppRoutes';
import { StartupAnimation } from './components/common/StartupAnimation';

function App() {
  const [showStartup, setShowStartup] = useState(true);

  useEffect(() => {
    const handleReplay = () => setShowStartup(true);
    window.addEventListener('replay-startup-animation', handleReplay);
    return () => window.removeEventListener('replay-startup-animation', handleReplay);
  }, []);

  return (
    <BrowserRouter>
      {showStartup && (
        <StartupAnimation onComplete={() => setShowStartup(false)} />
      )}
      <ThemeProvider>
        <AuthProvider>
          <RealtimeProvider>
            <AppRoutes />
          </RealtimeProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

