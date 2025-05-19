import React from 'react';
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
  InputBase
} from '@mui/material';
import { 
  Description as DescriptionIcon,
  Folder as FolderIcon,
  StarBorder as StarBorderIcon,
  AccessTime as AccessTimeIcon,
  DeleteOutline as DeleteOutlineIcon,
  CloudQueue as CloudQueueIcon,
  Storage as StorageIcon,
  Menu as MenuIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const menuItems = [
  { 
    text: 'Home', 
    icon: <FolderIcon />,
    color: '#9bbec7', // Light blue
    selected: true
  },
  { 
    text: 'Starred', 
    icon: <StarBorderIcon />,
    color: '#f6e27f' // Yellow
  },
  { 
    text: 'Recent', 
    icon: <AccessTimeIcon />,
    color: '#a8b7ab' // Light green
  },
  { 
    text: 'Trash', 
    icon: <DeleteOutlineIcon />,
    color: '#251605' // Dark brown
  },
];

const Sidebar = ({ open, toggleSidebar }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        height: '100vh',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedDrawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.05)',
          padding: open ? '0 8px' : '0',
          height: '100%',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Toolbar sx={{ 
        minHeight: '64px', 
        display: 'flex', 
        justifyContent: open ? 'flex-end' : 'center',
        padding: open ? '0 8px' : '0'
      }}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={toggleSidebar}
          edge={open ? "end" : "start"}
          sx={{ 
            color: theme.palette.text.primary,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <MenuIcon sx={{ 
            fontSize: '1.5rem', 
            strokeWidth: 1.5,
            stroke: theme.palette.text.primary,
            fill: 'transparent',
            borderRadius: '4px'
          }} />
        </IconButton>
      </Toolbar>
      {/* Expanded Sidebar Content */}
      <Box sx={{ overflow: 'auto', paddingTop: 1.5, display: open ? 'block' : 'none' }}>
        {/* Search */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Paper
            component="form"
            elevation={0}
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              borderRadius: '16px',
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)'
              }
            }}
          >
            <IconButton sx={{ p: '10px', color: theme.palette.text.secondary }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search files and folders' }}
            />
          </Paper>
        </Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            px: 3, 
            py: 1.5, 
            color: theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          Files
        </Typography>
        <List sx={{ pt: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={item.selected}
                sx={{
                  borderRadius: '10px',
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
                <ListItemIcon>
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
                    fontSize: '0.9rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1.5, opacity: 0.6 }} />
        <Typography 
          variant="subtitle2" 
          sx={{ 
            px: 3, 
            py: 1.5, 
            color: theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          Storage
        </Typography>
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                },
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                    color: theme.palette.secondary.main,
                  }}
                >
                  <StorageIcon />
                </Box>
              </ListItemIcon>
              <ListItemText 
                primary="Storage" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ p: 3, mt: 1 }}>
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
                width: '35%',
                height: '100%',
                bgcolor: theme.palette.primary.main,
                borderRadius: 4,
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            3.5 GB of 10 GB used
          </Typography>
        </Box>
      </Box>

      {/* Collapsed Sidebar Content */}
      <Box sx={{ overflow: 'auto', paddingTop: 1.5, display: open ? 'none' : 'block' }}>
        <List sx={{ pt: 0 }}>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={item.selected}
                sx={{
                  borderRadius: '10px',
                  justifyContent: 'center',
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
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1.5, opacity: 0.6 }} />
        <List sx={{ pt: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              sx={{
                borderRadius: '10px',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                  color: theme.palette.secondary.main,
                }}
              >
                <StorageIcon />
              </Box>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
