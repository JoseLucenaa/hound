import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, Dog } from 'lucide-react';
import './Login.css';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      if (!data.token) {
        throw new Error("O servidor não enviou o token.");
      }

      localStorage.setItem('token', data.token);
      onLogin();

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
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

        {erro && (
          <div className="alert-error" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {erro}
          </div>
        )}

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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="login-footer">
          <p>Não tem uma conta? <button type="button" className="text-btn" onClick={onNavigateToRegister}>Crie agora</button></p>
        </div>
      </div>
    </div>
  );
}