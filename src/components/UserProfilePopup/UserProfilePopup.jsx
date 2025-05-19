import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  useTheme, 
  alpha,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import ProfileSection from './ProfileSection';
import SettingsSection from './SettingsSection';
import HelpSection from './HelpSection';

const UserProfilePopup = ({ open, onClose, initialSection = 'profile' }) => {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState(initialSection);

  // Update activeSection when initialSection prop changes
  React.useEffect(() => {
    if (open) {
      setActiveSection(initialSection);
    }
  }, [initialSection, open]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: <PersonIcon />, color: theme.palette.custom.lightBlue },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, color: theme.palette.custom.beige },
    { id: 'help', label: 'Help', icon: <HelpIcon />, color: theme.palette.custom.lightGreen }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          height: '80vh',
          maxHeight: '700px',
          width: '90%',
          maxWidth: '1000px'
        }
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Sidebar */}
        <Box 
          sx={{ 
            width: '240px', 
            backgroundColor: alpha(theme.palette.background.default, 0.7),
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              User Menu
            </Typography>
          </Box>
          <Divider sx={{ opacity: 0.6 }} />
          <List sx={{ flexGrow: 1, pt: 2 }}>
            {sections.map((section) => (
              <ListItem 
                key={section.id} 
                disablePadding 
                sx={{ mb: 1, px: 2 }}
              >
                <Box
                  onClick={() => handleSectionChange(section.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    py: 1,
                    px: 2,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: activeSection === section.id 
                      ? alpha(section.color, 0.15) 
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: activeSection === section.id 
                        ? alpha(section.color, 0.2) 
                        : alpha(section.color, 0.1),
                    }
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
                      backgroundColor: alpha(section.color, 0.15),
                      color: section.color,
                      mr: 2
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography 
                    sx={{ 
                      fontWeight: activeSection === section.id ? 600 : 500,
                      color: theme.palette.text.primary
                    }}
                  >
                    {section.label}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {sections.find(s => s.id === activeSection)?.label}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ opacity: 0.6 }} />
          <DialogContent sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'settings' && <SettingsSection />}
            {activeSection === 'help' && <HelpSection />}
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserProfilePopup;
