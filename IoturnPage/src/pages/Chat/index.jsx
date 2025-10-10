import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "../../components/ChatMessage";
import TypingIndicator from "../../components/TypingIndicator";
import Sidebar from "../../components/Sidebar";
import { Send, Sparkles } from "lucide-react";
import "./chat.css";

const API_BASE_URL = "http://10.110.12.12:3000";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          text: "Olá! Sou o menssageiro da IoTurn. Me diga o que você precisa que eu vou correndo buscar a informação para você.",
          sender: "bot",
        },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reseta a altura para recalcular o scrollHeight
      textarea.style.height = "auto";
      // Define a nova altura com base no conteúdo, sem limite
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessage = { id: `user-${Date.now()}`, text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue(""); // Limpar o input irá acionar o useEffect para encolher o textarea
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/askGemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = {
        id: data.cacheId,
        text: data.data,
        sender: "bot",
      };
      let messageToProcess;

      if (typeof botMessage === "string") {
        messageToProcess = botMessage;
      } else {
        messageToProcess = JSON.stringify(botMessage);
      }
      const sendMessage = messageToProcess.replace(/["']/g, "");
      setMessages((prev) => [...prev, sendMessage]);
    } catch (error) {
      console.error("Falha ao comunicar com a API:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId, isLike) => {
    console.log(
      `Feedback para ${messageId}: ${isLike ? "Gostei" : "Não gostei"}`
    );
    try {
      await fetch(`${API_BASE_URL}/feedbackGemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyReturned: messageId,
          feedback: isLike ? 1 : 0,
        }),
      });
    } catch (error) {
      console.error("Falha ao enviar feedback:", error);
    }
  };

  return (
    <div className="h-screen bg-white text-gray-800 flex font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-20 flex flex-col overflow-hidden">
        {/* Cabeçalho de texto como na imagem de referência */}
        <div className="px-8 pt-8 max-w-4xl w-full mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
              <Sparkles />
            </div>
            <div>
              <h1 className="font-bold text-lg text-black">HERMES AI</h1>
            </div>
          </div>
          <hr className="mt-4 border-gray-200" />
        </div>

        <div
          ref={chatContainerRef}
          className="chat-container-fade flex-1 overflow-y-auto flex flex-col gap-6 p-8 max-w-4xl w-full mx-auto"
        >
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onFeedback={handleFeedback}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        <div className="px-8 pb-8 pt-4 max-w-4xl w-full mx-auto">
          <hr className="mb-4 border-gray-200" />
          <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Digite sua mensagem..."
              className="flex-1 resize-none p-3 px-4 bg-white border border-gray-200 text-gray-800 rounded-lg text-base outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-400 overflow-y-hidden"
              rows="1"
            ></textarea>
            <button
              type="submit"
              className="w-11 h-11 bg-gray-100 rounded-full text-gray-500 flex-shrink-0 flex items-center justify-center text-lg transition-colors hover:bg-gray-200"
            >
              <Send className="rotate-45 -translate-x-0.5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chat;
