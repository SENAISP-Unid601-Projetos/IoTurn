import React from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { User as UserIcon } from "lucide-react";
import { alpha } from '@mui/material/styles';

const UserProfile = ({ user }) => {
    const theme = useTheme();

    if (!user) return null;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                p: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.8,
                    px: 1.5,
                    py: 1.8,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
                    width: "100%",
                    maxWidth: "100%",
                }}
            >
                <Box sx={{ position: "relative" }}>
                    <Avatar
                        aria-label={`Perfil de ${user.name}`} 
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                            color: theme.palette.primary.main,
                            width: 44,
                            height: 44,
                        }}
                    >
                        <UserIcon size={22} />
                    </Avatar>
                </Box>
                <Box>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: theme.palette.text.primary,
                        }}
                    >
                        {user.name || "João Silva"}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "0.8rem",
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {user.company || "Empresa Demo"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfile;
