import React from 'react';
import { Box, Typography, Grid, Button, Avatar, useTheme, alpha } from '@mui/material';
import { Sparkles, Bot } from 'lucide-react';

const suggestedQuestions = [
    "Qual a temperatura média da máquina Torno CNC nas últimas 24 horas?",
    "Mostre o histórico de RPM da Fresadora Setor B",
    "Quais máquinas tiveram alertas críticos hoje?",
    "Compare o consumo de corrente entre todas as máquinas",
];

const ChatEmptyState = ({ onSuggestionClick }) => {
    const theme = useTheme();

    return (
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
                            onClick={() => onSuggestionClick(question)}
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
};

export default ChatEmptyState;