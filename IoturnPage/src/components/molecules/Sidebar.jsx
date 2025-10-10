import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  User,
  Bot,
  List,
  Cpu,
  WifiCog,
  Eye,
  Settings,
} from "lucide-react";
import {
  Box,
  Drawer,
  IconButton,
  List as MUIList,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import SidebarButton from "../atoms/SidebarButton";
import MatrioskaMenu from "../atoms/MatrioskaMenu";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [showGerenciamento, setShowGerenciamento] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setOpen((prev) => !prev);

  // Fecha o sidebar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box ref={sidebarRef}>
      {/* Botão de abrir/fechar */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          color: "white",
          "&:hover": { color: "#2563eb" },
        }}
      >
        <Menu />
      </IconButton>

      {/* Drawer lateral */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            bgcolor: "#020617", // slate-950
            color: "white",
            width: 240,
            padding: "16px",
          },
        }}
      >
        <MUIList sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Máquinas */}
          <ListItemButton
            onClick={() => navigate("#/maquinas")}
            sx={{
              borderRadius: "8px",
              "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
            }}
          >
            <ListItemIcon>
              <Eye color="white" />
            </ListItemIcon>
            <ListItemText primary="Máquinas" />
          </ListItemButton>

          {/* Hermes AI */}
          <ListItemButton
            onClick={() => navigate("#/relatorios")}
            sx={{
              borderRadius: "8px",
              "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
            }}
          >
            <ListItemIcon>
              <Bot color="white" />
            </ListItemIcon>
            <ListItemText primary="Hermes AI" />
          </ListItemButton>

          {/* Menu de Gerenciamento */}
          <ListItemButton
            onClick={() => setShowGerenciamento(!showGerenciamento)}
            sx={{
              borderRadius: "8px",
              "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
            }}
          >
            <ListItemIcon>
              <Settings color="white" />
            </ListItemIcon>
            <ListItemText primary="Gerenciamento" />
          </ListItemButton>

          <Collapse in={showGerenciamento}>
            <MUIList sx={{ pl: 4, display: "flex", flexDirection: "column", gap: 1 }}>
              <ListItemButton
                onClick={() => navigate("#/usuarios")}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
                }}
              >
                <ListItemIcon>
                  <User color="white" />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("#/maquinas")}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
                }}
              >
                <ListItemIcon>
                  <List color="white" />
                </ListItemIcon>
                <ListItemText primary="Máquinas" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("#/dispositivos")}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
                }}
              >
                <ListItemIcon>
                  <Cpu color="white" />
                </ListItemIcon>
                <ListItemText primary="Dispositivos" />
              </ListItemButton>

              <ListItemButton
                onClick={() => navigate("#/gateways")}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#1e293b", color: "#2563eb" },
                }}
              >
                <ListItemIcon>
                  <WifiCog color="white" />
                </ListItemIcon>
                <ListItemText primary="Gateways" />
              </ListItemButton>
            </MUIList>
          </Collapse>
        </MUIList>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
