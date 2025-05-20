import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      {/* Sidebar */}
      <Sidebar />

      {/* Combined Header and Main Content Container */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          height: '100%',
          overflow: 'hidden',
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: 0,
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
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
