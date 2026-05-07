import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Dog, Plus, MessageSquare, Image as ImageIcon, History, Settings, Moon, Sun } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon-small">
            <Dog size={20} color="#fff" />
          </div>
          <span className="logo-text">Hound AI</span>
        </div>
      </div>

      <div className="sidebar-new-chat">
        <button className="new-chat-btn">
          <Plus size={18} />
          Nova Conversa
        </button>
      </div>

      <div className="sidebar-menu">
        <p className="menu-label">Recursos</p>
        <ul className="menu-list">
          <li className="menu-item active">
            <MessageSquare size={18} />
            <span>Chat AI</span>
          </li>
          <li className="menu-item">
            <ImageIcon size={18} />
            <span>Gerar Imagens</span>
          </li>
          <li className="menu-item">
            <History size={18} />
            <span>Histórico</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="premium-banner">
          <div className="premium-icon">💎</div>
          <div className="premium-text">
            <strong>Hound Premium</strong>
            <span>Desbloqueie recursos avançados</span>
          </div>
        </div>

        <div className="user-profile">
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?img=11" alt="User" />
          </div>
          <div className="user-info">
            <span className="user-name">Usuário</span>
            <span className="user-plan">Plano Grátis</span>
          </div>
          <button className="theme-toggle-small" onClick={toggleTheme}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
