import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { fetchUserStorage } from '../../services/api';
import { useAuthToken } from '../Auth/AuthTokenProvider';

const ProfileSection = () => {
  const theme = useTheme();
  const { user } = useAuth0();
  const { isTokenReady } = useAuthToken();

  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const getStorageData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserStorage();
        setStorageData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching storage data:', err);
        setError('Failed to load storage information');
      } finally {
        setLoading(false);
      }
    };

    if (isTokenReady && isInitialMount.current) {
      isInitialMount.current = false;
      getStorageData();
    } else if (isTokenReady && !isInitialMount.current) {
      // Optionally refresh data when token becomes ready but not on initial mount
      // This is useful if the token expires and is refreshed
    }
  }, [isTokenReady]);

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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : storageData ? (
          <>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {(storageData.usedSpace / 1000).toFixed(1)} GB of {(storageData.maxSpace / 1000).toFixed(1)} GB used
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {((storageData.usedSpace / storageData.maxSpace) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(storageData.usedSpace / storageData.maxSpace) * 100} 
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
                  { type: 'Documents', size: storageData.documents, color: theme.palette.custom.lightBlue },
                  { type: 'Images', size: storageData.images, color: theme.palette.custom.beige },
                  { type: 'Videos', size: storageData.videos, color: theme.palette.custom.lightGreen },
                  { type: 'Other', size: storageData.other, color: theme.palette.custom.yellow }
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
                        {(item.size / 1000).toFixed(1)} GB
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(item.size / storageData.maxSpace) * 100} 
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
          </>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', my: 3 }}>
            No storage data available
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProfileSection;
