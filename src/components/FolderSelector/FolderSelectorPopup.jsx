import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Divider, 
  useTheme, 
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import { 
  Close as CloseIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Mock hierarchical folder structure
const mockFolderStructure = [
  {
    id: 1,
    name: 'Documents',
    children: [
      {
        id: 11,
        name: 'Work',
        children: [
          { id: 111, name: 'Projects', children: [] },
          { id: 112, name: 'Reports', children: [] }
        ]
      },
      {
        id: 12,
        name: 'Personal',
        children: [
          { id: 121, name: 'Photos', children: [] },
          { id: 122, name: 'Finance', children: [] }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Images',
    children: [
      { id: 21, name: 'Vacation', children: [] },
      { id: 22, name: 'Work', children: [] }
    ]
  },
  {
    id: 6,
    name: 'Marketing Plan',
    children: []
  },
  {
    id: 7,
    name: 'Financial Report',
    children: []
  }
];

const FolderSelectorPopup = ({ open, onClose, onSelect, initialSelectedFolder }) => {
  const theme = useTheme();
  const [selectedFolder, setSelectedFolder] = useState(initialSelectedFolder || null);
  // Initialize openFolders state to show top-level folders by default
  const initialOpenFolders = {};
  mockFolderStructure.forEach(folder => {
    if (folder.children && folder.children.length > 0) {
      initialOpenFolders[folder.id] = true;
      // Also initialize second-level folders as open
      folder.children.forEach(childFolder => {
        if (childFolder.children && childFolder.children.length > 0) {
          initialOpenFolders[childFolder.id] = true;
        }
      });
    }
  });
  const [openFolders, setOpenFolders] = useState(initialOpenFolders);

  // Log when component mounts and when popup opens
  useEffect(() => {
    console.log('FolderSelectorPopup mounted');
    console.log('mockFolderStructure:', mockFolderStructure);
  }, []);

  useEffect(() => {
    if (open) {
      console.log('Popup opened, selected folder:', selectedFolder);
    }
  }, [open, selectedFolder]);

  const handleConfirm = () => {
    if (selectedFolder) {
      // Find the folder object by id
      const findFolder = (folders, id) => {
        for (const folder of folders) {
          if (folder.id.toString() === id) {
            return folder;
          }
          if (folder.children && folder.children.length > 0) {
            const found = findFolder(folder.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const folder = findFolder(mockFolderStructure, selectedFolder);
      console.log('Found folder:', folder);
      if (folder) {
        onSelect(folder);
        onClose();
      }
    }
  };

  // Toggle folder open/close state
  const toggleFolder = (folderId) => {
    console.log('Toggling folder:', folderId);
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Custom folder tree component
  const FolderTree = ({ folders, level = 0 }) => {
    console.log(`Rendering FolderTree level ${level} with folders:`, folders);

    const handleFolderClick = (e, folder) => {
      console.log('Folder clicked:', folder);
      // Prevent event propagation to keep parent folders open
      e.stopPropagation();
      setSelectedFolder(folder.id.toString());

      // Ensure all parent folders remain open when a nested folder is selected
      if (folder.children && folder.children.length > 0 && !openFolders[folder.id]) {
        toggleFolder(folder.id);
      }
    };

    // If no folders are available at the root level, show a message
    if (folders.length === 0 && level === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No folders available. Please create a folder first.
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ pl: level * 2, py: 0 }}>
        {folders.map((folder) => {
          console.log(`Rendering folder in level ${level}:`, folder.name);
          return (
            <React.Fragment key={folder.id}>
              <ListItem 
                component="div"
                onClick={(e) => handleFolderClick(e, folder)}
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: '4px',
                  py: 1,
                  backgroundColor: selectedFolder === folder.id.toString() 
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FolderIcon sx={{ color: theme.palette.custom.beige }} />
                </ListItemIcon>
                <ListItemText 
                  primary={folder.name} 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    fontWeight: selectedFolder === folder.id.toString() ? 600 : 400
                  }}
                />
                {folder.children && folder.children.length > 0 && (
                  <IconButton 
                    edge="end" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(folder.id);
                    }}
                  >
                    {openFolders[folder.id] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                  </IconButton>
                )}
              </ListItem>
              {folder.children && folder.children.length > 0 && (
                <Collapse in={openFolders[folder.id]} timeout="auto" unmountOnExit>
                  <FolderTree folders={folder.children} level={level + 1} />
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          height: '60vh',
          maxHeight: '500px',
          width: '90%',
          maxWidth: '500px'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Select Destination Folder
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ opacity: 0.6 }} />

        {/* Content */}
        <DialogContent sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            p: 1,
            minHeight: '300px'
          }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Select a folder to store your files:
            </Typography>
            <FolderTree folders={mockFolderStructure} />
          </Box>
        </DialogContent>

        {/* Footer */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirm}
            disabled={!selectedFolder}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default FolderSelectorPopup;
