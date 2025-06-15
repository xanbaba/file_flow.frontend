import React, {useState, useCallback} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  Tooltip,
  Button
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
  DarkMode as DarkModeIcon,
  CloudUpload as CloudUploadIcon,
  CreateNewFolder as CreateNewFolderIcon
} from '@mui/icons-material';
import { useThemeContext } from '../contexts/ThemeContext';
import UserProfilePopup from '../components/UserProfilePopup/UserProfilePopup';
import NotificationPanel from '../components/NotificationPanel/NotificationPanel';
import FileUploadPopup from '../components/FileUploadPopup/FileUploadPopup';
import NewFolderPopup from '../components/NewFolderPopup';
import {useFileSystem} from "../contexts/FileSystemContext.jsx";

const Header = () => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();
  const { user, logout } = useAuth0();
  const { createFolder, refreshCurrentFolder, folderContents, currentFolderId, currentFolder } = useFileSystem();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [initialSection, setInitialSection] = useState('profile');
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isNewFolderPopupOpen, setIsNewFolderPopupOpen] = useState(false);
  const [folders, setFolders] = useState([]);
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

  const handleOpenUploadPopup = () => {
    // Check if we're in a folder view (home or any other folder)
    const isInHomeView = currentFolderId === 'root';
    const isInFolderView = currentFolder !== null;

    if (isInHomeView || isInFolderView) {
      // If we're in home view or any folder, use the current folder as default destination
      if (isInFolderView) {
        // Use the current folder as the default destination
        setFolders([{
          id: currentFolder.id,
          name: currentFolder.name
        }]);
      } else {
        // In home view, we'll use an empty array to indicate root folder
        setFolders([]);
      }
    } else {
      // If we're not in home view or any folder (e.g., in starred, recent, or trash),
      // use home directory (root) as the default destination
      setFolders([]);
    }

    setIsUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setIsUploadPopupOpen(false);
  };

  const handleOpenNewFolderPopup = () => {
    setIsNewFolderPopupOpen(true);
  };

  const handleCloseNewFolderPopup = () => {
    setIsNewFolderPopupOpen(false);
  };

  const handleCreateFolder = async (folderData) => {
    try {
      await createFolder(folderData.folderName, folderData.targetFolderId);
      refreshCurrentFolder();
      handleCloseNewFolderPopup();
    } catch (error) {
      console.error('Error creating folder:', error);
      // Let the error propagate to the NewFolderPopup component
      throw error;
    }
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
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2
          }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontSize: "2em",
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                color: theme.palette.mode === 'light' ? '#251605' : '#f7ecb3',
                letterSpacing: '0.5px',
                textShadow: theme.palette.mode === 'light' ? '1px 1px 1px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              File Flow
            </Typography>
          </Box>
          <Box sx={{flexGrow: 1}}/>
          <Box sx={{display: {xs: 'none', md: 'flex'}}}>
            {/* Upload Button */}
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon/>}
              onClick={handleOpenUploadPopup}
              sx={{
                mr: 2,
                bgcolor: theme.palette.primary.dark,
                '&:hover': {
                  bgcolor: theme.palette.primary.main,
                }
              }}
            >
              Upload
            </Button>

            {/* New Folder Button */}
            <Button
              variant="outlined"
              startIcon={<CreateNewFolderIcon/>}
              onClick={handleOpenNewFolderPopup}
              sx={{
                mr: 2,
                borderColor: theme.palette.secondary.dark,
                transition: 'all 0.15s ease-in-out',
                color: theme.palette.secondary.dark,
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  bgcolor: 'rgba(226, 195, 145, 0.04)',
                }
              }}
            >
              New Folder
            </Button>

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
                  src={user?.picture}
                  alt={user?.name}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 500
                  }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    fontWeight: 500,
                    color: theme.palette.text.primary
                  }}
              >
                {user?.name || 'User'}
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
              slotProps={{
                paper: {
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
                  }
                }
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
            <MenuItem 
              sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
              onClick={() => logout({ returnTo: window.location.origin })}
            >
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

        {/* File Upload Popup */}
        <FileUploadPopup
          open={isUploadPopupOpen}
          onClose={handleCloseUploadPopup}
          folders={folders}
        />

        {/* New Folder Popup */}
        <NewFolderPopup
          open={isNewFolderPopupOpen}
          onClose={handleCloseNewFolderPopup}
          onCreateFolder={handleCreateFolder}
        />
      </AppBar>
  );
};

export default Header;
