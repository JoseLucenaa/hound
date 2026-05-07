import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import './ChatArea.css';

export default function ChatArea() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Eu sou o Hound AI. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensagem: userMessage.content })
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o servidor');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.resposta }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro de conexão. Certifique-se de que o backend está rodando.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-title">
          <h2>Hound AI Assistant</h2>
          <span className="status-indicator">Online</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'is-user' : 'is-ai'}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-bubble">
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper is-ai">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-bubble loading-bubble">
              <Loader2 className="spinner" size={20} />
              <span>Hound está digitando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <form className="input-form" onSubmit={handleSend}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem para o Hound..."
            rows={1}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={!input.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </form>
        <div className="input-footer">
          Hound AI pode cometer erros. Considere verificar informações importantes.
        </div>
      </div>
    </div>
  );
}
