import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Combined Header and Main Content Container */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
