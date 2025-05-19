import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Switch, 
  FormControlLabel, 
  Divider, 
  useTheme, 
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';
import { 
  LockOutlined as LockIcon,
  DeleteOutline as DeleteIcon,
  Brightness4 as ThemeIcon
} from '@mui/icons-material';

const SettingsSection = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleThemeChange = (event) => {
    setDarkMode(event.target.checked);
    // In a real app, this would trigger a theme change in the app
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      {/* Security Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.info.main, 0.15),
              color: theme.palette.info.main,
              mr: 2
            }}
          >
            <LockIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Security
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Password
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Change your password to keep your account secure.
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            Change Password
          </Button>
        </Box>
        
        <Divider sx={{ my: 3, opacity: 0.6 }} />
        
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Session
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Sign out from all devices where you're currently logged in.
          </Typography>
          <Button 
            variant="outlined" 
            color="error"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
      
      {/* Account Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.error.main, 0.15),
              color: theme.palette.error.main,
              mr: 2
            }}
          >
            <DeleteIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Account
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Delete Account
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Permanently delete your account and all of your content.
          </Typography>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '10px' }}>
            This action cannot be undone. All your data will be permanently removed.
          </Alert>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>
      
      {/* Preferences Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.secondary.main, 0.15),
              color: theme.palette.secondary.main,
              mr: 2
            }}
          >
            <ThemeIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Preferences
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Theme
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Switch between light and dark themes.
          </Typography>
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode} 
                onChange={handleThemeChange} 
                color="primary" 
              />
            }
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
        </Box>
      </Paper>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
          {"Are you sure you want to delete your account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. All your data, including files, folders, and personal information will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsSection;