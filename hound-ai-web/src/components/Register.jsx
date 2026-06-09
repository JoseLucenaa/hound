import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, Dog, ArrowLeft } from 'lucide-react';
import './Register.css';

export default function Register({ onNavigateToLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setLoading(true);

    try {
      // Ajuste a URL abaixo para a porta onde seu backend Node está rodando (ex: http://localhost:3000/cadastrar)
      const response = await fetch('http://localhost:3001/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao cadastrar usuário');
      }

      setMensagem('Cadastro realizado com sucesso!');
      
      // Limpa o formulário e redireciona para o login após 2 segundos
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);

    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container fade-in">
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="register-card slide-up">
        <div className="register-header">
          <div className="logo-icon">
            <Dog size={32} color="#fff" />
          </div>
          <h1>Criar Conta</h1>
          <p>Junte-se ao Hound AI</p>
        </div>

        {erro && <div className="alert-error">{erro}</div>}
        {mensagem && <div className="alert-success">{mensagem}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
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
              placeholder="Mínimo de 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar Conta'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="register-footer">
          <button type="button" className="text-btn" onClick={onNavigateToLogin}>
            <ArrowLeft size={16} />
            Já tem uma conta? Faça login
          </button>
        </div>
      </div>
    </div>
  );
}