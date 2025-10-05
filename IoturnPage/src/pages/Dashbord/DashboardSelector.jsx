import React from 'react';
import Sidebar from '../../components/Sidebar';
import Box from '@mui/material/Box';

const DashboardSelectionPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Sidebar />

      {/* 
        conteúdo principal da página.
      */}

    </Box> 
  );
};

export default DashboardSelectionPage;