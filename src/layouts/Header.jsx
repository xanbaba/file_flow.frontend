import React, {useState} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  alpha,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import UserProfilePopup from '../components/UserProfilePopup/UserProfilePopup';
import NotificationPanel from '../components/NotificationPanel/NotificationPanel';

const Header = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [initialSection, setInitialSection] = useState('profile');
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfilePopup = (section) => {
    setInitialSection(section);
    setProfilePopupOpen(true);
    setAnchorEl(null);
  };

  return (
      <AppBar
          position="static"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
            borderRadius: 0,
            width: '100%',
            transition: theme => theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
      >
        <Toolbar sx={{padding: {xs: 1, sm: 2}}}>
          <Box sx={{flexGrow: 1}}/>
          <Box sx={{display: {xs: 'none', md: 'flex'}}}>
            {/* Theme Toggle Button */}
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton
                  size="medium"
                  onClick={toggleTheme}
                  sx={{
                    color: theme.palette.text.primary,
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                    padding: '8px',
                    mr: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
              >
                {themeMode === 'light' ? (
                  <DarkModeIcon sx={{
                    fontSize: '1.5rem',
                    strokeWidth: 1.5,
                    borderRadius: '8px'
                  }}/>
                ) : (
                  <LightModeIcon sx={{
                    fontSize: '1.5rem',
                    strokeWidth: 1.5,
                    borderRadius: '8px'
                  }}/>
                )}
              </IconButton>
            </Tooltip>

            {/* Notifications Button */}
            <IconButton
                size="medium"
                onClick={handleNotificationClick}
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: 'transparent',
                  borderRadius: '12px',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
            >
              <NotificationsIcon sx={{
                fontSize: '1.5rem',
                strokeWidth: 1.5,
                stroke: theme.palette.text.primary,
                fill: 'transparent',
                borderRadius: '8px'
              }}/>
            </IconButton>

            {/* Notification Panel */}
            <NotificationPanel 
              anchorEl={notificationAnchorEl}
              open={notificationOpen}
              onClose={handleNotificationClose}
            />
            <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: 1,
                  borderRadius: '12px',
                  padding: '4px 8px 4px 4px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
                onClick={handleClick}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 500
                  }}
              >
                U
              </Avatar>
              <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
              >
                Username
              </Typography>
              <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{
                    ml: 0.5,
                    color: theme.palette.text.secondary
                  }}
              />
            </Box>
          </Box>

          <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                  mt: 1.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          >
            <MenuItem
                sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                onClick={() => handleOpenProfilePopup('profile')}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem
                sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                onClick={() => handleOpenProfilePopup('settings')}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
                sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                onClick={() => handleOpenProfilePopup('help')}
            >
              <ListItemIcon>
                <HelpIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
              </ListItemIcon>
              Help
            </MenuItem>
            <Divider sx={{my: 1}}/>
            <MenuItem sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{color: theme.palette.error.main}}/>
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        <UserProfilePopup 
          open={profilePopupOpen} 
          onClose={() => setProfilePopupOpen(false)} 
          initialSection={initialSection}
        />
      </AppBar>
  );
};

export default Header;
