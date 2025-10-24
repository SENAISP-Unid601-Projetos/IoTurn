import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  Avatar,
  alpha,
} from "@mui/material";
import {
  Eye,
  Bot,
  Settings,
  User,
  List as ListIcon,
  Cpu,
  WifiCog,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import UserProfile from "./UserProfile";
import { fetchAllUserData } from "../services/usersService";
import theme from "../theme";

const sidebarItems = [
  {
    text: "Monitoramento",
    icon: <Eye size={18} />,
    subItems: [
      {
        text: "Máquinas",
        icon: <ListIcon size={17} />,
        path: "/main/maquinas",
      },
    ],
  },
  {
    text: "Hermes AI",
    icon: <Bot size={18} />,
    path: "/main/hermes",
  },
  {
    text: "Gerenciamento",
    icon: <Settings size={18} />,
    subItems: [
      {
        text: "Usuários",
        icon: <User size={17} />,
        path: "/main/gerenciamento/usuarios"
      },
      {
        text: "Máquinas",
        icon: <ListIcon size={17} />,
        path: "/main/gerenciamento/maquinas",
      },
      {
        text: "Dispositivos",
        icon: <Cpu size={17} />,
        path: "/main/gerenciamento/dispositivos",
      },
      {
        text: "Gateways",
        icon: <WifiCog size={17} />,
        path: "/main/gerenciamento/gateways",
      },
    ],
  },
];

const Sidebar = ({ isSidebarExpanded, setSidebarExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({ Monitoramento: true });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchAllUserData();
        setUser(userData[0]);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    console.log("Logout clicado!");
    navigate("/login");
  };

  const handleClick = (itemText) => {
    setOpenSections((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const handleMouseEnter = () => {
    setSidebarExpanded(true);
  };
  const handleMouseLeave = () => {
    setSidebarExpanded(false);
  };

  const mainItemSx = {
    py: 1.5,
    px: 2,
    borderRadius: 2,
    gap: 1.5,
    color: "text.primary",
    fontWeight: 500,
    transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "action.hover",
      color: "text.primary",
      transform: "scale(1.03)",
    },
  };
  const subItemSx = {
    py: 1,
    px: 2,
    borderRadius: 2,
    gap: 1.5,
    color: "text.secondary",
    transition:
      "transform 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "action.hover",
      color: "text.primary",
      transform: "scale(1.05)",
    },
  };
  const activeSubItemSx = {
    backgroundColor: "primary.main",
    color: "white",
    borderLeft: `3px solid ${theme.palette.secondary.main}`,
    "&:hover": {
      backgroundColor: "primary.main",
      transform: "none",
    },
    ".MuiListItemIcon-root": {
      color: "white",
    },
  };

  const textSx = {
    opacity: isSidebarExpanded ? 1 : 0,
    width: isSidebarExpanded ? 'auto' : 0,
    minWidth: isSidebarExpanded ? 'auto' : 0,
    whiteSpace: 'nowrap',
    transition: theme.transitions.create(['opacity', 'width', 'min-width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
      delay: isSidebarExpanded ? '100ms' : 0,
    }),
  };

  const renderItems = (items, isSubItem = false) => {
    return items.map((item) => {
      const styleToApply = isSubItem ? subItemSx : mainItemSx;
      const activeStyle = isSubItem
        ? { ...styleToApply, ...activeSubItemSx }
        : styleToApply;

      if (item.subItems) {
        if (item.subItems.length === 0) return null;
        const isOpen = openSections[item.text] || false;

        return (
          <React.Fragment key={item.text}>
            <ListItemButton
              sx={styleToApply}
              onClick={() => handleClick(item.text)}
            >
              <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={textSx} />
              <Box sx={{ ...textSx, display: 'flex' }}>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Box>
            </ListItemButton>

            <Collapse in={isOpen && isSidebarExpanded} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{
                  pl: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                {renderItems(item.subItems, true)}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      if (item.path) {
        const isActive = location.pathname === item.path;
        return (
          <ListItemButton
            key={item.text}
            sx={isActive ? activeStyle : styleToApply}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={textSx} />
          </ListItemButton>
        );
      }
      return null;
    });
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          color: "white",
          width: isSidebarExpanded
            ? theme.layout.sidebarWidth
            : theme.layout.sidebarWidthCollapsed,
          borderRight: "1px solid rgba(255, 255, 255, 0.12)",
          overflowX: "hidden",
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.complex,
          }),
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{
          height: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              ...
            </Typography>
          ) : (
            <UserProfile user={user} isSidebarExpanded={isSidebarExpanded} />
          )}
        </Box>

        <Divider sx={{ borderColor: "divider" }} />

        <List sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: 2,
          pb: 1,
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
        }}>
          {renderItems(sidebarItems)}
        </List>

        <Box sx={{ p: 2, pt: 0 }}>
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <ListItemButton sx={mainItemSx} onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText primary="Sair" sx={textSx} />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;