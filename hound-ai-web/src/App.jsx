import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Layout from './components/Layout';
import ChatArea from './components/ChatArea';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <Layout>
          <ChatArea />
        </Layout>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </ThemeProvider>
  );
}

export default App;
