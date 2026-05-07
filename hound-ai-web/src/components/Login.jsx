import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, Dog } from 'lucide-react';
import './Login.css'; // Iremos criar estilos específicos aqui

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de login
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="login-container fade-in">
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="login-card slide-up">
        <div className="login-header">
          <div className="logo-icon">
            <Dog size={32} color="#fff" />
          </div>
          <h1>Hound AI</h1>
          <p>Seu assistente virtual perfeito</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Entrar
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem uma conta? <a href="#">Crie agora</a></p>
        </div>
      </div>
    </div>
  );
}
