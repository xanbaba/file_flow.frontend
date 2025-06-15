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
  Search as SearchIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { fetchUserStorage } from '../services/api';
import { useAuthToken } from '../components/Auth/AuthTokenProvider';

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

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

const Sidebar = ({ onCollapseChange }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isTokenReady } = useAuthToken();

  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isInitialMount = useRef(true);

  // Function to fetch storage data
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

  // Fetch storage data on initial mount
  useEffect(() => {
    if (isTokenReady && isInitialMount.current) {
      isInitialMount.current = false;
      getStorageData();
    } else if (isTokenReady && !isInitialMount.current) {
      // Optionally refresh data when token becomes ready but not on initial mount
      // This is useful if the token expires and is refreshed
    }
  }, [isTokenReady]);

  // Listen for storage update events
  useEffect(() => {
    const handleStorageUpdate = () => {
      if (isTokenReady) {
        getStorageData();
      }
    };

    // Add event listener for storage updates
    window.addEventListener('storageInfoUpdated', handleStorageUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('storageInfoUpdated', handleStorageUpdate);
    };
  }, [isTokenReady]);

  const toggleDrawer = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        height: '100vh',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.05)',
          padding: '0 8px',
          height: '100%',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {/* Hamburger Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-end', p: 1 }}>
        <IconButton onClick={toggleDrawer}>
          {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Files Section */}
      {!isCollapsed && (
        <Typography 
          variant="subtitle2" 
          sx={{ 
            px: 1.5,
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
      )}
      <List sx={{ pt: 0 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '10px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 2,
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
                minWidth: isCollapsed ? 0 : 56,
                mr: isCollapsed ? 0 : 2,
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
              {!isCollapsed && (
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
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1.5, opacity: 0.6 }} />

      {/* Storage Usage */}
      <Box sx={{ 
        p: isCollapsed ? 1 : 3, 
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'flex-start',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: isCollapsed ? 0 : 1.5,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          width: '100%'
        }}>
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
              mr: isCollapsed ? 0 : 1.5
            }}
          >
            <StorageIcon fontSize="small" />
          </Box>
          {!isCollapsed && (
            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
              Storage
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: isCollapsed ? 1 : 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          !isCollapsed && (
            <Typography variant="caption" sx={{ color: 'error.main', display: 'block', textAlign: 'center' }}>
              {error}
            </Typography>
          )
        ) : storageData ? (
          <>
            {!isCollapsed && (
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
            )}
            {isCollapsed ? (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  position: 'relative',
                  mt: 1,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={(storageData.usedSpace / storageData.maxSpace) * 100}
                  size={32}
                  thickness={4}
                  sx={{ color: theme.palette.primary.main }}
                />
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                {(storageData.usedSpace / 1000).toFixed(1)} GB of {(storageData.maxSpace / 1000).toFixed(1)} GB used
              </Typography>
            )}
          </>
        ) : (
          !isCollapsed && (
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
              No storage data available
            </Typography>
          )
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
