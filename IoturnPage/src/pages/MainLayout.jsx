import React, { useState, forwardRef } from "react";
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
} from "@mui/material";
import {
  Activity,
  Bot,
  Eye,
  Settings,
  User,
  List as ListIcon,
  Cpu,
  WifiCog,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";


// ITENS DA SIDEBAR

const sidebarItems = [
  {
    text: "Monitoramento",
    icon: <Eye size={18} />,
    subItems: [
      { text: "Máquinas", icon: <ListIcon size={17} />, path: "/maquinas" },
    ],
  },
  {
    text: "Hermes AI",
    icon: <Bot size={18} />,
    path: "/relatorios",
  },
  {
    text: "Gerenciamento",
    icon: <Settings size={18} />,
    subItems: [
      { text: "Usuários", icon: <User size={17} />, path: "/usuarios" },
      { text: "Máquinas", icon: <ListIcon size={17} />, path: "/maquinas-gerenciamento" },
      { text: "Dispositivos", icon: <Cpu size={17} />, path: "/dispositivos" },
      { text: "Gateways", icon: <WifiCog size={17} />, path: "/gateways" },
    ],
  },
  { divider: true },
  {
    text: "Status",
    icon: <Activity size={18} />,
    path: "/status",
  },
];


// COMPONENTE SIDEBAR
const Sidebar = forwardRef(({ isOpen }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({ Monitoramento: true });

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


  // ESTILIZAÇÃO
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
    color: "primary.contrastText",
    borderLeft: (theme) => `3px solid ${theme.palette.secondary.main}`,
    "&:hover": {
      backgroundColor: "primary.main",
      transform: "none",
    },
    ".MuiListItemIcon-root": {
      color: "primary.contrastText",
    },
  };


  // FUNÇÃO DE RENDERIZAÇÃO
  const renderItems = (items, isSubItem = false) => {
    return items.map((item) => {
      const styleToApply = isSubItem ? subItemSx : mainItemSx;
      const activeStyle = isSubItem ? { ...styleToApply, ...activeSubItemSx } : styleToApply;

      // Caso tenha subitens
      if (item.subItems) {
        if (item.subItems.length === 0) return null;
        const isOpen = openSections[item.text] || false;

        return (
          <React.Fragment key={item.text}>
            <ListItemButton sx={styleToApply} onClick={() => handleClick(item.text)}>
              <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </ListItemButton>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
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

      // Caso seja um item com path (link direto)
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
            <ListItemText primary={item.text} />
          </ListItemButton>
        );
      }

      if (item.divider) {
        return <Divider key="divider" sx={{ my: 2, borderColor: "divider" }} />;
      }

      return null;
    });
  };



  return (
    <Drawer
      ref={ref}
      variant="persistent"
      anchor="left"
      open={isOpen}
      PaperProps={{
        sx: {
          bgcolor: "background.default",
          color: "text.primary",
          width: 280,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List sx={{ flexGrow: 1, overflowY: "auto", p: 2, pb: 1 }}>
          {renderItems(sidebarItems)}
        </List>

        <Box sx={{ p: 2, pt: 0 }}>
          <Divider sx={{ my: 2, borderColor: "divider" }} />
          <ListItemButton sx={mainItemSx} onClick={handleLogout}>
            <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
});

export default Sidebar;
