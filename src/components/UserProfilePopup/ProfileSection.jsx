import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Box, 
  Typography, 
  Avatar,
  Paper, 
  Grid, 
  IconButton, 
  useTheme, 
  alpha,
  LinearProgress,
} from '@mui/material';
import { 
  PhotoCamera as PhotoCameraIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

const ProfileSection = () => {
  const theme = useTheme();
  const { user } = useAuth0();
  console.log(user)
  // Mock data for storage usage
  const storageUsed = 10; // GB
  const storageTotal = 15; // GB
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
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
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          User Information
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={user?.picture}
              alt={user?.name}
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: theme.palette.primary.main,
                fontSize: '2.5rem',
                fontWeight: 500
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <IconButton 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
              size="small"
            >
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ ml: 3, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
            </Box>

            <Typography variant="body1" color="textSecondary">
              {user?.email || 'No email available'}
            </Typography>
          </Box>
        </Box>
      </Paper>

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
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            <StorageIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Storage Usage
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {storageUsed} GB of {storageTotal} GB used
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {storagePercentage.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={storagePercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette.primary.main,
                borderRadius: 4
              }
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Storage breakdown by file type
          </Typography>
          <Grid container spacing={2}>
            {[
              { type: 'Documents', size: 3.2, color: theme.palette.custom.lightBlue },
              { type: 'Images', size: 4.5, color: theme.palette.custom.beige },
              { type: 'Videos', size: 1.8, color: theme.palette.custom.lightGreen },
              { type: 'Other', size: 0.5, color: theme.palette.custom.yellow }
            ].map((item) => (
              <Grid item xs={6} key={item.type}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: item.color,
                      mr: 1 
                    }} 
                  />
                  <Typography variant="body2">
                    {item.type}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="textSecondary">
                    {item.size} GB
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(item.size / storageTotal) * 100} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: alpha(item.color, 0.15),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: item.color,
                      borderRadius: 3
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileSection;
