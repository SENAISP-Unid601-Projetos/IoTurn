import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

const sidebar_width = 280;

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null); 

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.closest('#sidebar-toggle-button')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]); 

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar isOpen={isSidebarOpen} ref={sidebarRef} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin-left 0.3s ease-in-out',
          marginLeft: isSidebarOpen ? `${sidebar_width}px` : 0,
        }}
      >
        <IconButton
          id="sidebar-toggle-button"
          onClick={handleToggleSidebar}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1301,
            color: 'text.primary',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
            opacity: isSidebarOpen ? 0 : 1,
            transform: isSidebarOpen ? 'translateX(-100px)' : 'translateX(0)',
            pointerEvents: isSidebarOpen ? 'none' : 'auto', 
          }}
        >
          <Menu />
        </IconButton>

        <Box sx={{ mt:6}}>
          <h1>Bem-vindo ao sistema</h1>
        </Box>

      </Box>
    </Box>
  );
};

export default MainLayout;
