import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, ThumbsUp, ThumbsDown, User, Omega } from "lucide-react";
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
  Paper,
  Button
} from "@mui/material";
import { keyframes } from '@mui/system';

const waveAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-6px);
  }
`;

const TypingIndicator = () => (
    <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Omega size={24} color="#2979ff" />
        </Avatar>
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%', animation: `${waveAnimation} 1.2s infinite`, animationDelay: '0s' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%', animation: `${waveAnimation} 1.2s infinite`, animationDelay: '0.2s' }} />
                <Box sx={{ width: 8, height: 8, bgcolor: 'text.secondary', borderRadius: '50%', animation: `${waveAnimation} 1.2s infinite`, animationDelay: '0.4s' }} />
            </Stack>
        </Paper>
    </Stack>
);

const ChatMessage = ({ message, onFeedback }) => {
  const [feedback, setFeedback] = useState({ rated: false, selection: null });

  const handleFeedbackClick = (isLike) => {
    setFeedback({ rated: true, selection: isLike ? 'like' : 'dislike' });
    if (onFeedback) onFeedback(message.id, isLike);
  };

  const isUser = message.sender === 'user';
  if (isUser) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="flex-start" justifyContent="flex-end">
            <Typography sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'primary.main', color: 'primary.contrastText', maxWidth: '75%' }}>
                {message.text}
            </Typography>
        </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ maxWidth: '75%' }}>
        <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', mt: 0.5 }}>
            <Omega size={24} color="#2979ff" />
        </Avatar>
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', width: '100%' }}>
            <Stack spacing={1}>
                {message.question ? (
                    <Typography variant="body1">Recebi sua pergunta: "{message.question}"</Typography>
                ) : (
                    <Typography variant="h6">Hermes AI</Typography>
                )}
                <Typography variant="body1">{message.text}</Typography>
                {message.question && (
                    <>
                        <Divider sx={{ pt: 1 }} />
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">Esta resposta foi útil?</Typography>
                            <Button
                                startIcon={<ThumbsUp size={16} />}
                                onClick={() => handleFeedbackClick(true)}
                                disabled={feedback.rated}
                                size="small"
                                sx={{
                                    color: feedback.selection === 'like' ? 'success.main' : 'text.secondary',
                                    textTransform: 'none',
                                    transition: 'transform 0.1s ease',
                                    '&:active': { transform: 'scale(0.95)'}
                                }}
                            >
                                Útil
                            </Button>
                            <Button
                                startIcon={<ThumbsDown size={16} />}
                                onClick={() => handleFeedbackClick(false)}
                                disabled={feedback.rated}
                                size="small"
                                sx={{
                                    color: feedback.selection === 'dislike' ? 'error.main' : 'text.secondary',
                                    textTransform: 'none',
                                    transition: 'transform 0.1s ease',
                                    '&:active': { transform: 'scale(0.95)'}
                                }}
                            >
                                Não útil
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </Paper>
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
      setMessages([{
        id: `welcome-${Date.now()}`,
        text: "Olá! Como posso ajudar com suas máquinas industriais hoje?",
        sender: "bot",
      }]);
    }, 500);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e, messageText) => {
    if (e) e.preventDefault();
    const text = messageText || inputValue.trim();
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
      setMessages((prev) => [...prev, { id: data.cacheId, text: data.data, sender: "bot", question: text }]);
    } catch (error) {
      console.error("Falha ao comunicar com a API:", error);
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, text: "Desculpe, não consegui processar sua solicitação.", sender: "bot", question: text }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = async (messageId, isLike) => {
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
      <CssBaseline />
      
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="md" sx={{ py: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
              <Avatar variant="rounded" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                  <Omega color="#2979ff"/>
              </Avatar>
              <Box flexGrow={1}>
                  <Typography variant="h6" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Hermes AI <Sparkles size={16} color="#dbab09" />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                      O mensageiro dos deuses trazendo dados do Olimpo digital com asas velozes
                  </Typography>
              </Box>
          </Stack>
        </Container>
      </Box>

      <Container
        ref={chatContainerRef}
        maxWidth="md"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'background.paper' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'text.secondary', borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { bgcolor: 'primary.main' },
        }}
      >
        <Stack spacing={2}>
            {messages.map((msg) => (<ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />))}
            {isTyping && <TypingIndicator />}
        </Stack>
      </Container>
      
      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md" sx={{ py: 2 }}>
            <Stack spacing={1} component="form" onSubmit={handleSendMessage}>
              <TextField
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
		multiline
                placeholder="Pergunte ao Hermes sobre suas máquinas IoT..."
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: { borderRadius: '12px', bgcolor: 'background.paper' },
                  endAdornment: (
                    <IconButton type="submit" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                      <Box component={Send} sx={{ transform: "rotate(45deg) translateX(-1px)" }} />
                    </IconButton>
                  )
                }}
              />
              <Typography variant="caption" color="text.secondary" align="center">
                Pressione Enter para enviar • Shift + Enter para nova linha
              </Typography>
            </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Chat;
