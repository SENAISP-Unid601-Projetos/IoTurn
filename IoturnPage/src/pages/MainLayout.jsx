import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import theme from '../theme';

const MainLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        isSidebarExpanded={isSidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }), marginLeft: isSidebarExpanded
            ? `${theme.layout.sidebarWidth}px`
            : `${theme.layout.sidebarWidthCollapsed}px`,
        }}
      >
        <Box >
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
};

export default MainLayout;
