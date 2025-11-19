import React, { useState, useRef, useEffect } from "react";
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
    alpha,
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
            const data = await ApiService.postRequest("/hermes/ask", {
                message: content,
            });

            setLoadingProgress(100);

            const assistantMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content:
                    data?.response || "Desculpe, não consegui processar sua pergunta.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("[v0] Hermes AI error:", error);
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
        const newFeedback = feedbacks[messageId] === feedback ? null : feedback;
        setFeedbacks((prev) => ({ ...prev, [messageId]: newFeedback }));

        if (newFeedback) {
            try {
                await ApiService.postRequest("/feedback", {
                    messageId,
                    feedback: newFeedback,
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error("[v0] Failed to send feedback:", error);
            }
        }
    };

    const handleSuggestionClick = (question) => {
        setInput(question);
    };

    // --- Layout Principal (JSX) ---

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
                    {messages.length === 0 && !isLoading && <ChatEmptyState onSuggestionClick={handleSuggestionClick} />}

                    {messages.map((message) => (
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
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
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

                                {/* Feedback */}
                                {message.role === "assistant" && (
                                    <Box style={{ display: message.content !== 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.' ? 'flex' : 'none'}}
                                        sx={{
                                            alignItems: "center",
                                            gap: 0.5,
                                            mt: 1.5,
                                            pt: 1,
                                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" mr={1}>
                                            A mensagem foi útil?
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleFeedback(message.id, "positive")}
                                            sx={{
                                                color:
                                                    feedbacks[message.id] === "positive"
                                                        ? "success.main"
                                                        : "text.secondary",
                                                "&:hover": {
                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                },
                                            }}
                                        >
                                            <ThumbsUp size={16} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleFeedback(message.id, "negative")}
                                            sx={{
                                                color:
                                                    feedbacks[message.id] === "negative"
                                                        ? "error.main"
                                                        : "text.secondary",
                                                "&:hover": {
                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                },
                                            }}
                                        >
                                            <ThumbsDown size={16} />
                                        </IconButton>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    ))}

                    {isLoading && messages.length > 0 && <ChatLoadingIndicator />}
                    <div ref={messagesEndRef} />
                </Box>
            </Paper>

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