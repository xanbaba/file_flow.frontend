import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { uiConfig } from '../../config';

const LoginPage = () => {
  const theme = useTheme();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // If the user is already authenticated, redirect to the home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Show loading indicator while Auth0 is initializing
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          <LockIcon fontSize="large" />
        </Box>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome to {uiConfig.appName}
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
          Please sign in to access your files and folders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => loginWithRedirect()}
          sx={{
            borderRadius: '10px',
            py: 1.5,
            px: 4,
            textTransform: 'none',
            fontWeight: 600,
            width: '100%',
          }}
        >
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;