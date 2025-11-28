import React from 'react';
import { Chip } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const statusConfig = {
    // Success
    ACTIVE: { label: 'Ativo', color: 'success' },
    ONLINE: { label: 'Online', color: 'success' },

    // Warning
    SUSPENDED: { label: 'Suspenso', color: 'warning' },
    PROVISIONING: { label: 'Provisionando', color: 'warning' },

    // Error
    CANCELED: { label: 'Cancelado', color: 'error' },
    OFFLINE: { label: 'Offline', color: 'error' },
    ERROR: { label: 'Erro', color: 'error' },

    // Default
    UNKNOWN: { label: 'Desconhecido', color: 'secondary' },
};

const StatusChip = ({ status }) => {
    const theme = useTheme();
    const config = statusConfig[status] || statusConfig['UNKNOWN'];
    const label = config.label || status || 'Desconhecido';
    const color = config.color || 'secondary';

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                bgcolor: alpha(theme.palette[color]?.main || theme.palette.text.secondary, 0.1),
                color: theme.palette[color]?.main || theme.palette.text.secondary,
                border: `1px solid ${theme.palette[color]?.main || theme.palette.text.secondary}`,
                fontWeight: 600,
                fontSize: '0.75rem',
            }}
        />
    );
};

export default StatusChip;