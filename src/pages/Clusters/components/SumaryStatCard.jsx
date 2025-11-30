import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const SummaryStatCard = ({ title, value, icon: Icon, color }) => {
    const theme = useTheme();
    const displayColor = color || theme.palette.text.secondary;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                bgcolor: 'background.default',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                flex: 1,
                minWidth: '150px',
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
                {Icon && <Icon size={16} />}
                {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: displayColor }}>
                {value}
            </Typography>
        </Paper>
    );
};

export default SummaryStatCard;