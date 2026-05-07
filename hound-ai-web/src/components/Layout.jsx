import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="app-layout fade-in">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
