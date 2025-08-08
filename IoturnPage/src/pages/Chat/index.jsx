import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ChatMessage from '../../components/ChatMessage';
import TypingIndicator from '../../components/TypingIndicator';
import logo from '../../assets/LogoSemBorda2.png';
import './chat.css';

const API_BASE_URL = 'http://10.110.12.59:3000';

const Chat = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          text: 'Olá! Sou o assistente virtual da IoTurn. Como posso ajudar?',
          sender: 'bot',
        },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [inputValue]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessage = { id: `user-${Date.now()}`, text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/askGemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = {
        id: data.cacheId, 
        text: data.data,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Falha ao comunicar com a API:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: '⚠️ Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId, isLike) => {
    console.log(`Feedback para ${messageId}: ${isLike ? 'Gostei' : 'Não gostei'}`);
    try {
      await fetch(`${API_BASE_URL}/feedbackGemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyReturned: messageId,
          feedback: isLike ? 1 : 0,
        }),
      });
    } catch (error) {
      console.error('Falha ao enviar feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2a3a] to-[#90b6e4] text-white flex flex-col">
      <header className="flex justify-between items-center p-4 lg:p-6 relative z-10">
        <Link to="/">
          <img src={logo} alt="Logo IoTurn" className="h-16" />
        </Link>
        <button onClick={() => setMenuOpen(true)} className="text-white text-3xl bg-transparent border-none cursor-pointer">
          &#9776;
        </button>
      </header>
      
      <nav className={`fixed top-0 h-full w-64 bg-black/30 backdrop-blur-md p-6 transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
           style={{ right: 0 }}
      >
        <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white text-4xl bg-transparent border-none cursor-pointer">
          &times;
        </button>
        <ul className="mt-20 list-none p-0">
          <li className="mb-4">
            <Link to="/selecao" className="text-white text-lg no-underline hover:text-[#2d86e5]">Página Inicial</Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1 max-w-3xl w-[90%] mx-auto flex flex-col p-4 overflow-hidden">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-6 p-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 items-end mt-4 p-4">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 resize-none p-3 px-4 bg-white text-black rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-400"
            rows="1"
          ></textarea>
          <button
            type="submit"
            className="w-11 h-11 bg-[#4471a1] rounded-full text-white flex-shrink-0 flex items-center justify-center text-lg transition-colors hover:bg-[#2164ac]"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chat;
