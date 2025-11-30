import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Grid,
    Button,
    LinearProgress,
    Avatar,
    useTheme,
    Divider,
} from "@mui/material";
import {
    ThumbsUp,
    ThumbsDown,
    Send,
    Sparkles,
    Bot,
} from "lucide-react";
import ApiService from "../../services/ApiServices";
import ChatEmptyState from "./components/ChatEmptyState";
import ChatLoadingIndicator from "./components/ChatLoadingIndicator";
import FeedbackButton from "./components/FeedbackButton";

export default function HermesAIPage() {
    const theme = useTheme();
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState({});
    const [loadingProgress, setLoadingProgress] = useState(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let interval;
        if (isLoading) {
            setLoadingProgress(0);
            interval = setInterval(() => {
                setLoadingProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 15;
                });
            }, 300);
        } else {
            setLoadingProgress(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const content = input.trim();
        if (!content || isLoading) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const apiResponse = await ApiService.postRequest("/hermes/ask/1", {
                message: content,
            });

            setLoadingProgress(100);

            let aiResponseContent = "Desculpe, não consegui processar sua pergunta.";
            const cacheId = apiResponse.cacheId;

            if (apiResponse && apiResponse.data) {
                try {
                    const parsedData = JSON.parse(apiResponse.data);

                    if (typeof parsedData === 'string') {
                        aiResponseContent = parsedData;
                    } else if (parsedData && parsedData.resposta) {
                        aiResponseContent = parsedData.resposta;
                    }
                } catch (parseError) {
                    console.error("Falha ao parsear o campo de dados do Hermes:", parseError);
                }
            }

            const assistantMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: aiResponseContent,
                timestamp: new Date(),
                cacheId: cacheId,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Hermes AI error:", error);
            const errorMessage = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content:
                    "Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleFeedback = async (messageId, feedback) => {
        const currentFeedbackData = feedbacks[messageId];
        const newFeedbackValue = feedback;

        // LÓGICA DE CLIQUE ÚNICO: Se já existe um feedback, ignora o novo clique.
        if (currentFeedbackData) {
            return;
        }

        setFeedbacks((prev) => ({
            ...prev,
            [messageId]: { value: newFeedbackValue }
        }));

        const message = messages.find(m => m.id === messageId);
        const keyReturned = message?.cacheId;
        const feedbackValue = feedback === 'positive' ? 1 : 0;

        if (keyReturned) {
            try {
                await ApiService.postRequest("/hermes/feedback", {
                    feedback: feedbackValue,
                    keyReturned: keyReturned,
                });
            } catch (error) {
                console.error("Failed to send feedback:", error);
            }
        }
    };

    const handleSuggestionClick = (question) => {
        setInput(question);
    };

    return (
        <Box
            sx={{
                height: "calc(100vh - 72px)",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.default",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Avatar
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 40,
                        height: 40,
                    }}
                >
                    <Bot size={20} />
                </Avatar>
                <Box>
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        Hermes AI
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Seu assistente de monitoramento IoT
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ height: "4px", my: 2 }}>
                {isLoading ? (
                    <LinearProgress
                        variant="determinate"
                        value={loadingProgress}
                        sx={{ height: "4px", borderRadius: "2px" }}
                    />
                ) : (
                    <Divider />
                )}
            </Box>

            <Paper
                elevation={0}
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    bgcolor: "background.default",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,

                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: theme.palette.background.default,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.text.tertiary,
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: theme.palette.text.secondary,
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${theme.palette.text.tertiary} ${theme.palette.background.default}`,
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    {/* Exibe o estado vazio se não houver mensagens */}
                    {messages.length === 0 && !isLoading && <ChatEmptyState onSuggestionClick={handleSuggestionClick} />}

                    {messages.map((message) => {
                        const feedbackData = feedbacks[message.id];
                        const hasFeedback = !!feedbackData;

                        return (
                            <Box
                                key={message.id}
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        message.role === "user" ? "flex-end" : "flex-start",
                                    mb: 2,
                                }}
                            >
                                {message.role === "assistant" && (
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            color: "white",
                                            width: 40,
                                            height: 40,
                                            mr: 1.5,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Bot size={20} />
                                    </Avatar>
                                )}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        bgcolor:
                                            message.role === "user"
                                                ? "primary.main"
                                                : "background.paper",
                                        color:
                                            message.role === "user" ? "white" : "text.primary",
                                        borderRadius: 3,
                                        border:
                                            message.role === "assistant"
                                                ? `1px solid ${theme.palette.divider}`
                                                : "none",
                                        maxWidth: "85%",
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                                    >
                                        {message.content}
                                    </Typography>

                                    {/* Botões de Feedback */}
                                    {message.role === "assistant" && (
                                        <Box style={{ display: message.content !== 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.' ? 'flex' : 'none' }}
                                            sx={{
                                                alignItems: "center",
                                                gap: 0.5,
                                                mt: 1.5,
                                                pt: 1,
                                                borderTop: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary" mr={1}>
                                                A mensagem foi útil?
                                            </Typography>

                                            <FeedbackButton
                                                type="positive"
                                                onClick={() => handleFeedback(message.id, "positive")}
                                                currentValue={feedbackData?.value}
                                                Icon={ThumbsUp}
                                                disabled={hasFeedback}
                                            />

                                            <FeedbackButton
                                                type="negative"
                                                onClick={() => handleFeedback(message.id, "negative")}
                                                currentValue={feedbackData?.value}
                                                Icon={ThumbsDown}
                                                disabled={hasFeedback}
                                            />
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        );
                    })}

                    {isLoading && messages.length > 0 && <ChatLoadingIndicator />}
                    <div ref={messagesEndRef} />
                </Box>
            </Paper>

            {/* Campo de Input e Botão de Envio */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    gap: 2,
                    pt: 2,
                    flexShrink: 0,
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={6}
                    variant="outlined"
                    placeholder="Pergunte ao Hermes sobre suas máquinas IoT..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(null);
                        }
                    }}
                    sx={{
                        bgcolor: "background.default",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            borderColor: theme.palette.divider,
                        },

                        '& .MuiInputBase-input::-webkit-scrollbar': {
                            display: 'none',
                        },
                        '& .MuiInputBase-input': {
                            scrollbarWidth: 'none',
                            '-ms-overflow-style': 'none',
                        },
                    }}
                />
                <IconButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading || !input.trim()}
                    sx={{
                        height: 56,
                        width: 56,
                        borderRadius: 3,
                        bgcolor: "primary.main",
                        color: "white",
                        flexShrink: 0,
                        "&:hover": {
                            bgcolor: "primary.dark",
                        },
                    }}
                >
                    <Send size={20} />
                </IconButton>
            </Box>
        </Box>
    );
}