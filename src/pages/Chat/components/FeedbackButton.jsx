// src/pages/Chat/components/FeedbackButton.jsx

import React from 'react';
import { IconButton, useTheme, alpha } from '@mui/material';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const FeedbackButton = ({ type, onClick, currentValue, Icon, disabled }) => { // 👈 Adicionar 'disabled'
    const theme = useTheme();
    const isSelected = currentValue === type;

    const mainColorKey = type === 'positive' ? 'success' : 'error';
    const mainColor = theme.palette[mainColorKey].main;
    const hoverColor = alpha(mainColor, 0.1);

    const dynamicColor = isSelected ? mainColor : theme.palette.text.primary;

    return (
        <IconButton
            size="small"
            onClick={onClick}
            disabled={disabled}
            sx={{
                color: dynamicColor,
                "&:hover": {
                    bgcolor: hoverColor,
                },
                cursor: "pointer",
                "&.Mui-disabled": {
                    color: dynamicColor,
                    opacity: isSelected ? 1 : 0.4,
                    cursor: "default",
                    pointerEvents: "none",
                    bgcolor: 'transparent',
                },
            }}
        >
            <Icon size={16} />
        </IconButton>
    );
};

export default FeedbackButton;