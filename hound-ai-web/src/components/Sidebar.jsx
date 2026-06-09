import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook de navegação
import { useTheme } from '../context/ThemeContext';
import { 
  Dog, 
  Plus, 
  MessageSquare, 
  Image as ImageIcon, 
  History, 
  Settings, 
  Moon, 
  Sun,
  LogOut // Importando o ícone de Sair
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate(); // Inicializando a navegação

  // Função para lidar com o Logout
  const handleLogout = () => {
    // 1. Remove o token de autenticação do armazenamento local
    localStorage.removeItem('token'); 
  
  // 3. Use o redirecionamento nativo do navegador
  window.location.href = '/login';
  };

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

      

      <div className="sidebar-menu">
        <p className="menu-label">Recursos</p>
        <ul className="menu-list">
          <li className="menu-item active">
            <MessageSquare size={18} />
            <span>Chat AI</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        {/* Adicionando o botão de Sair */}
        <ul className="menu-list">
          <li className="menu-item" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff4d4f' }}>
            <LogOut size={18} />
            <span>Sair</span>
          </li>
        </ul>

        
      </div>
    </aside>
  );
}