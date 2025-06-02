import React, { useState, useEffect, useRef } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar,
  Divider,
  Box,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Paper,
  InputBase,
  CircularProgress
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Description as DescriptionIcon,
  Folder as FolderIcon,
  StarBorder as StarBorderIcon,
  AccessTime as AccessTimeIcon,
  DeleteOutline as DeleteOutlineIcon,
  CloudQueue as CloudQueueIcon,
  Storage as StorageIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { fetchUserStorage } from '../services/api';
import { useAuthToken } from '../components/Auth/AuthTokenProvider';

const drawerWidth = 240;

const menuItems = [
  { 
    text: 'Home', 
    icon: <FolderIcon />,
    color: '#9bbec7', // Light blue
    path: '/'
  },
  { 
    text: 'Starred', 
    icon: <StarBorderIcon />,
    color: '#f6e27f', // Yellow
    path: '/starred'
  },
  { 
    text: 'Recent', 
    icon: <AccessTimeIcon />,
    color: '#a8b7ab', // Light green
    path: '/recent'
  },
  { 
    text: 'Trash', 
    icon: <DeleteOutlineIcon />,
    color: '#251605', // Dark brown
    path: '/trash'
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
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
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.05)',
          padding: '0 8px',
          height: '100%',
          overflowX: 'hidden',
        },
      }}
    >

      {/* Search */}
      <Box sx={{ 
        px: 2,
        py: 2,
        mb: 2,
      }}>
        <Paper
          component="form"
          elevation={0}
          sx={{ 
            p: '1px 4px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start',
            width: '100%',
            borderRadius: '16px',
            bgcolor: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)'
            }
          }}
        >
          <IconButton 
            sx={{ 
              p: '8px', 
              color: theme.palette.text.secondary,
            }} 
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ 
              ml: 1, 
              flex: 1,
            }}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search files and folders' }}
          />
        </Paper>
      </Box>

      {/* Files Section */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          px: 3, 
          py: 1.5, 
          color: theme.palette.text.secondary,
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        Files
      </Typography>
      <List sx={{ pt: 0 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '10px',
                justifyContent: 'flex-start',
                '&:hover': {
                  backgroundColor: alpha(item.color, 0.1),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(item.color, 0.15),
                  '&:hover': {
                    backgroundColor: alpha(item.color, 0.2),
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 56,
              }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(item.color, 0.15),
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  sx: {
                    whiteSpace: 'nowrap',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1.5, opacity: 0.6 }} />

      {/* Storage Usage */}
      <Box sx={{ 
        p: 3, 
        mt: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
              mr: 1.5
            }}
          >
            <StorageIcon fontSize="small" />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
            Storage
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', textAlign: 'center' }}>
            {error}
          </Typography>
        ) : storageData ? (
          <>
            <Box
              sx={{
                width: '100%',
                height: 8,
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                borderRadius: 4,
                mb: 1.5,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${(storageData.usedSpace / storageData.maxSpace) * 100}%`,
                  height: '100%',
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 4,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
              {(storageData.usedSpace / 1000).toFixed(1)} GB of {(storageData.maxSpace / 1000).toFixed(1)} GB used
            </Typography>
          </>
        ) : (
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            No storage data available
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
