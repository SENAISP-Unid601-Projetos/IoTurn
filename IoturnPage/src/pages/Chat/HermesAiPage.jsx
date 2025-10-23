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

const suggestedQuestions = [
    "Qual a temperatura média da máquina Torno CNC nas últimas 24 horas?",
    "Mostre o histórico de RPM da Fresadora Setor B",
    "Quais máquinas tiveram alertas críticos hoje?",
    "Compare o consumo de corrente entre todas as máquinas",
];

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
            const data = await ApiService.postRequest("/ask", {
                message: content,
                history: messages.slice(-5),
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

    // --- Sub-componentes de Renderização ---

    const renderEmptyState = () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                p: 3,
            }}
        >
            <Avatar
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    color: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                }}
            >
                <Bot size={30} />
            </Avatar>
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 1 }}>
                Bem-vindo ao Hermes AI
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, maxWidth: "600px" }}>
                Sou seu assistente inteligente para monitoramento. Posso buscar dados,
                gerar relatórios e analisar métricas das suas máquinas em tempo real.
            </Typography>
            <Grid container spacing={2} justifyContent="center" maxWidth="700px">
                {suggestedQuestions.map((question, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => handleSuggestionClick(question)}
                            startIcon={<Sparkles size={16} />}
                            sx={{
                                textTransform: "none",
                                justifyContent: "flex-start",
                                textAlign: "left",
                                height: "100%",
                                p: 1.5,
                                borderRadius: 2,
                                borderColor: theme.palette.divider,
                                color: "text.secondary",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    color: "text.primary",
                                },
                            }}
                        >
                            {question}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    const renderLoadingIndicator = () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1, mr: "auto" }}>
            <Avatar
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                }}
            >
                <Bot size={20} />
            </Avatar>
            <Paper
                elevation={0}
                sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Hermes está pensando...
                </Typography>
            </Paper>
        </Box>
    );

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
                    {messages.length === 0 && !isLoading && renderEmptyState()}

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
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mt: 1.5,
                                            pt: 1,
                                            borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" mr={1}>
                                            Útil?
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

                    {isLoading && messages.length > 0 && renderLoadingIndicator()}
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