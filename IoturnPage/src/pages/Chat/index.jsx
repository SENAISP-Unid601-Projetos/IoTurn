import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, User, Omega } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import {
  Box,
  Container,
  TextField,
  IconButton,
  Stack,
  Avatar,
  Typography,
  Divider,
  CssBaseline,
  Paper
} from "@mui/material";
import { keyframes } from '@mui/system';

// Animação para o indicador de digitação
const waveAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
`;

// Componente para o indicador de digitação
const TypingIndicator = () => (
    <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'action.hover' }}>
            <Omega size={24} />
        </Avatar>
        <Paper elevation={1} sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%', animation: `${waveAnimation} 1.2s infinite`, animationDelay: '0s' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%', animation: `${waveAnimation} 1.2s infinite`, animationDelay: '0.2s' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%', animation: `${waveAnimation} 1.2s infinite`, animationDelay: '0.4s' }} />
            </Stack>
        </Paper>
    </Stack>
);

// Componente para cada mensagem do chat
const ChatMessage = ({ message, onFeedback }) => {
  const [rated, setRated] = useState(false);
  const [selection, setSelection] = useState(null);

  const handleFeedbackClick = (isLike) => {
    setRated(true);
    setSelection(isLike ? 'like' : 'dislike');
    if (onFeedback) onFeedback(message.id, isLike);
  };

  const isUser = message.sender === 'user';

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
    >
      {!isUser && (
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Omega size={24} />
        </Avatar>
      )}
      <Box display="flex" flexDirection="column" alignItems={isUser ? 'flex-end' : 'flex-start'} maxWidth="75%">
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              borderRadius: isUser ? '12px 0 12px 12px' : '0 12px 12px 12px',
              bgcolor: isUser ? 'primary.main' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
          </Paper>
          {!isUser && message.id && (
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <IconButton
                      size="small"
                      onClick={() => handleFeedbackClick(true)}
                      disabled={rated}
                      sx={{ color: selection === 'like' ? 'success.main' : 'text.secondary' }}
                  >
                      <ThumbsUp size={16} />
                  </IconButton>
                  <IconButton
                      size="small"
                      onClick={() => handleFeedbackClick(false)}
                      disabled={rated}
                      sx={{ color: selection === 'dislike' ? 'error.main' : 'text.secondary' }}
                  >
                      <ThumbsDown size={16} />
                  </IconButton>
              </Stack>
          )}
      </Box>
       {isUser && (
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'action.hover' }}>
            <User />
        </Avatar>
      )}
    </Stack>
  );
};

const API_BASE_URL = "http://10.110.12.12:3000";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([{ id: `welcome-${Date.now()}`, text: "Olá! Sou o mensageiro da IoTurn. Me diga o que você precisa que eu vou correndo buscar a informação para você.", sender: "bot" }]);
    }, 500);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessage = { id: `user-${Date.now()}`, text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/askGemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
      const data = await response.json();
      setMessages((prev) => [...prev, { id: data.cacheId, text: data.data, sender: "bot" }]);
    } catch (error) {
      console.error("Falha ao comunicar com a API:", error);
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, text: "Desculpe, não consegui processar sua solicitação. Tente novamente mais tarde.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId, isLike) => {
    try {
      await fetch(`${API_BASE_URL}/feedbackGemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyReturned: messageId, feedback: isLike ? 1 : 0 }),
      });
    } catch (error) {
      console.error("Falha ao enviar feedback:", error);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', pl: `${80/8}rem` }}>
        <Container maxWidth="md" sx={{ pt: 4, px: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40 }}>
              <Sparkles />
            </Avatar>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>HERMES AI</Typography>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Container>

        <Container ref={chatContainerRef} maxWidth="md" sx={{ flexGrow: 1, overflowY: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.map((msg) => (<ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />))}
          {isTyping && <TypingIndicator />}
        </Container>

        <Container maxWidth="md" sx={{ pb: 4, pt: 2, px: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack component="form" onSubmit={handleSendMessage} direction="row" spacing={1.5} alignItems="flex-end">
            <TextField
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
              placeholder="Digite sua mensagem..."
              multiline
              variant="outlined"
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'background.paper' } }}
            />
            <IconButton type="submit" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
              <Send />
            </IconButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Chat;
