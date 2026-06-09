import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Register from './components/Register'; 
import Layout from './components/Layout';
import ChatArea from './components/ChatArea';

function App() {
  // Aqui está a mágica: O estado inicial verifica o LocalStorage!
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const tokenSalvo = localStorage.getItem('token');
    return tokenSalvo !== null; // Se tem token, começa como true. Se não, começa como false.
  });
  
  const [authView, setAuthView] = useState('login'); 

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <Layout>
          <ChatArea />
        </Layout>
      ) : (
        authView === 'login' ? (
          <Login 
            onLogin={() => setIsAuthenticated(true)} 
            onNavigateToRegister={() => setAuthView('register')} 
          />
        ) : (
          <Register 
            onNavigateToLogin={() => setAuthView('login')} 
          />
        )
      )}
    </ThemeProvider>
  );
}

export default App;