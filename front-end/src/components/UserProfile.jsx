import React from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { User as UserIcon } from "lucide-react";
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ user, isSidebarExpanded }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  const handleProfileClick = () => {
    navigate('/main/gerenciamento/usuarios');
  };

  const textSx = {
    opacity: isSidebarExpanded ? 1 : 0,
    width: isSidebarExpanded ? 'auto' : 0,
    minWidth: isSidebarExpanded ? 'auto' : 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    transition: theme.transitions.create(['opacity', 'width', 'min-width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
      delay: isSidebarExpanded ? '100ms' : '0ms',
    }),
  };

  return (
    <Box
      onClick={handleProfileClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        p: 2,
        cursor: "pointer",
        transition: theme.transitions.create('padding', {
          duration: theme.transitions.duration.complex,
        }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
          borderRadius: 3,
          gap: isSidebarExpanded ? 1.8 : 0,
          px: isSidebarExpanded ? 1.5 : 0,
          py: isSidebarExpanded ? 1.8 : 0,
          background: isSidebarExpanded
            ? `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`
            : 'transparent',

          transition: theme.transitions.create(['gap', 'padding', 'background'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.complex,
          }),
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

        <Box sx={textSx}>
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