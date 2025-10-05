import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, MessageCircle, LogOut } from 'lucide-react';
import { Drawer, List, ListItemButton, ListItemIcon, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const drawerWidth = 80;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  '&.active': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const navLinks = [
  { to: "/", icon: <Home />, text: "Página Inicial" },
  { to: "/dashboard", icon: <LayoutDashboard />, text: "Dashboard" },
  { to: "/chatbot", icon: <MessageCircle />, text: "Chatbot" },
];

const Sidebar = () => {
  return (
    <StyledDrawer variant="permanent">
      <List>
        {navLinks.map((link) => (
          <Tooltip title={link.text} placement="right" key={link.to}>
            <StyledListItemButton component={NavLink} to={link.to}>
              <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
                {link.icon}
              </ListItemIcon>
            </StyledListItemButton>
          </Tooltip>
        ))}
      </List>
      <List>
        <Tooltip title="Sair" placement="right">
          <StyledListItemButton component={NavLink} to="/logout">
            <ListItemIcon sx={{ minWidth: 'auto', color: 'inherit' }}>
              <LogOut />
            </ListItemIcon>
          </StyledListItemButton>
        </Tooltip>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;
