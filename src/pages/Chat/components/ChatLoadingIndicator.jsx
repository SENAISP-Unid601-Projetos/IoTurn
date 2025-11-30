import React from 'react';
import { Box, Typography, Paper, Avatar, useTheme, alpha } from '@mui/material';
import { Bot } from 'lucide-react';

const ChatLoadingIndicator = () => {
    const theme = useTheme();

    return (
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
};

export default ChatLoadingIndicator;