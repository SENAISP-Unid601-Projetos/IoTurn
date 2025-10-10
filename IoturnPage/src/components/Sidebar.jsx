// src/components/Sidebar.jsx

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
  Collapse,
  Button,
} from "@mui/material";

// 1. Componente interno reutilizável para os botões da sidebar
function SidebarButton({ text, icon, onClick, pad_ding }) {
  return (
    <>
      <Button
        variant="text"
        fullWidth
        onClick={onClick}
        // A propriedade startIcon é a forma ideal do MUI para adicionar ícones
        startIcon={icon}
        sx={{
          justifyContent: "flex-start",
          color: "white",
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px", // Ajuste no padding para alinhar com ListItemButton
          paddingTop: pad_ding ? pad_ding : 1,
          gap: 2, // Espaçamento entre ícone e texto
          transition: "0.3s",
          "&:hover": {
            color: "primary.main", // azul-600
            bgColor: "background.paper", // slate-800
          },
        }}
      >
        {text}
      </Button>
    </>
  );
}

// 2. Componente principal da Sidebar
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
    <>
      {/* Botão para abrir/fechar a sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1300,
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: "white",
            bgcolor: "background.default",
            marginLeft: open ? 22.5 : 1,
            "&:hover": {
              color: "background.default",
              bgcolor: "background.paper",
            },
            transition: "0.3s",
          }}
        >
          <Menu />
        </IconButton>
      </Box>

      {/* Drawer (a própria sidebar) */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        PaperProps={{
          sx: {
            bgcolor: "background.default",
            color: "white",
            width: 240,
            padding: "16px",
            borderRight: "none", // Opcional: remove a borda padrão
          },
        }}
      >
        <Box ref={sidebarRef}>
          <MUIList sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Itens do Menu usando o novo componente */}
            <SidebarButton
              pad_ding={6}
              text="Máquinas"
              icon={<Eye color="white" />}
              onClick={() => navigate("#/maquinas")}
            />

            <SidebarButton
              text="Hermes AI"
              icon={<Bot color="white" />}
              onClick={() => navigate("#/relatorios")}
            />

            {/* Menu de Gerenciamento (Collapsible) */}
            <SidebarButton
              text="Gerenciamento"
              icon={<Settings color="white" />}
              onClick={() => setShowGerenciamento(!showGerenciamento)}
            />

            <Collapse in={showGerenciamento} timeout="auto" unmountOnExit>
              <MUIList
                sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}
              >
                <SidebarButton
                  text="Usuários"
                  icon={<User color="white" />}
                  onClick={() => navigate("#/usuarios")}
                />
                <SidebarButton
                  text="Máquinas"
                  icon={<List color="white" />}
                  onClick={() => navigate("#/maquinas-gerenciamento")} // Rota ajustada para diferenciar
                />
                <SidebarButton
                  text="Dispositivos"
                  icon={<Cpu color="white" />}
                  onClick={() => navigate("#/dispositivos")}
                />
                <SidebarButton
                  text="Gateways"
                  icon={<WifiCog color="white" />}
                  onClick={() => navigate("#/gateways")}
                />
              </MUIList>
            </Collapse>
          </MUIList>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
