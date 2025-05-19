import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  Popover
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const mockNotifications = [
  {
    id: 1,
    type: 'info',
    message: 'Your file has been uploaded successfully',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'warning',
    message: 'Storage space is running low',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'error',
    message: 'Failed to upload file "document.pdf"',
    time: '3 hours ago'
  },
  {
    id: 4,
    type: 'success',
    message: 'Your account has been verified',
    time: '1 day ago'
  }
];

const NotificationPanel = ({ anchorEl, open, onClose }) => {
  const theme = useTheme();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      case 'success':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <NotificationsIcon sx={{ color: theme.palette.primary.main }} />;
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: 400,
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      
      {mockNotifications.length > 0 ? (
        <List sx={{ p: 0 }}>
          {mockNotifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(0, 0, 0, 0.04)' 
                      : 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.message}
                  secondary={notification.time}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500,
                    sx: { mb: 0.5 }
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
              {index < mockNotifications.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <NotificationsIcon 
            sx={{ 
              fontSize: 48, 
              color: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              mb: 2 
            }} 
          />
          <Typography variant="body2" color="text.secondary">
            No notifications yet
          </Typography>
        </Box>
      )}
    </Popover>
  );
};

export default NotificationPanel;