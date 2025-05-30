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
  Collapse,
  CircularProgress
} from '@mui/material';
import { 
  Close as CloseIcon,
  Folder as FolderIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { fetchFolderChildren } from '../../services/api';

const FolderSelectorPopup = ({ open, onClose, onSelect, initialSelectedFolder }) => {
  const theme = useTheme();
  const [selectedFolder, setSelectedFolder] = useState(initialSelectedFolder || null);
  const [openFolders, setOpenFolders] = useState({});
  const [folders, setFolders] = useState({});
  const [loadingFolders, setLoadingFolders] = useState({});
  const [rootFolders, setRootFolders] = useState([]);
  const [isRootLoading, setIsRootLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch root folders when component mounts or popup opens
  useEffect(() => {
    if (open) {
      fetchRootFolders();

      // If initialSelectedFolder is 'root', select it
      if (initialSelectedFolder === 'root') {
        setSelectedFolder('root');
      }
    }
  }, [open, initialSelectedFolder]);

  // Fetch root folders
  const fetchRootFolders = async () => {
    setIsRootLoading(true);
    setError(null);
    try {
      const rootChildren = await fetchFolderChildren('root');
      // Filter to only include folders (not files)
      const folderItems = rootChildren.filter(item => item.type === 'folder');
      setRootFolders(folderItems);
    } catch (err) {
      console.error('Error fetching root folders:', err);
      setError('Failed to load folders. Please try again.');
    } finally {
      setIsRootLoading(false);
    }
  };

  // Fetch children of a specific folder
  const fetchFolderChildrenData = async (folderId) => {
    if (folders[folderId]) {
      return; // Already fetched
    }

    setLoadingFolders(prev => ({ ...prev, [folderId]: true }));
    try {
      const children = await fetchFolderChildren(folderId);
      // Filter to only include folders (not files)
      const folderItems = children.filter(item => item.type === 'folder');
      setFolders(prev => ({ ...prev, [folderId]: folderItems }));
    } catch (err) {
      console.error(`Error fetching children for folder ${folderId}:`, err);
      setError(`Failed to load folder contents. Please try again.`);
    } finally {
      setLoadingFolders(prev => ({ ...prev, [folderId]: false }));
    }
  };

  const handleConfirm = () => {
    if (selectedFolder) {
      // Special case for root selection
      if (selectedFolder === 'root') {
        // Create a special object for root
        const rootFolder = {
          id: null,
          name: 'Home Directory',
          type: 'folder'
        };
        onSelect(rootFolder);
        onClose();
        return;
      }

      // Find the folder object by id
      const findFolder = () => {
        // Check in root folders
        let folder = rootFolders.find(f => f.id.toString() === selectedFolder);

        if (folder) {
          return folder;
        }

        // Check in all fetched folders
        for (const [parentId, children] of Object.entries(folders)) {
          folder = children.find(f => f.id.toString() === selectedFolder);
          if (folder) {
            return folder;
          }
        }

        return null;
      };

      const folder = findFolder();
      if (folder) {
        onSelect(folder);
        onClose();
      }
    }
  };

  // Toggle folder open/close state and fetch children if needed
  const toggleFolder = (folderId) => {
    const isOpen = openFolders[folderId];

    // If we're opening the folder and haven't fetched its children yet, fetch them
    if (!isOpen && !folders[folderId]) {
      fetchFolderChildrenData(folderId);
    }

    // Toggle the open state
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Custom folder tree component
  const FolderTree = ({ folderList, level = 0, parentId = null }) => {
    // If we're showing root folders
    const foldersToShow = parentId === null ? rootFolders : folders[parentId] || [];
    const isLoading = parentId === null ? isRootLoading : loadingFolders[parentId];

    const handleFolderClick = (e, folder) => {
      // Prevent event propagation to keep parent folders open
      e.stopPropagation();
      setSelectedFolder(folder.id.toString());
    };

    const handleRootClick = (e) => {
      // Select root level (null)
      e.stopPropagation();
      setSelectedFolder('root');
    };

    // Show loading indicator
    if (isLoading) {
      return (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    // If no folders are available, show a message
    if (foldersToShow.length === 0 && level > 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No folders available in this location.
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ pl: level * 2, py: 0 }}>
        {/* Add Home Directory option at the top level */}
        {level === 0 && (
          <Box 
            onClick={handleRootClick}
            sx={{ 
              cursor: 'pointer',
              borderRadius: '8px',
              p: 1.5,
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: selectedFolder === 'root' 
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '&:hover': {
                backgroundColor: selectedFolder === 'root'
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.background.paper, 0.9)
              }
            }}
          >
            <HomeIcon 
              sx={{ 
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: '1.2rem'
              }} 
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: selectedFolder === 'root' ? 600 : 500,
                color: theme.palette.text.primary
              }}
            >
              Home Directory
            </Typography>
          </Box>
        )}
        {foldersToShow.map((folder) => {
          const folderId = folder.id.toString();
          const hasChildren = folders[folderId] ? folders[folderId].length > 0 : true; // Assume folders might have children until we check
          const isOpen = openFolders[folderId];

          return (
            <React.Fragment key={folderId}>
              <ListItem 
                component="div"
                onClick={(e) => handleFolderClick(e, folder)}
                sx={{ 
                  cursor: 'pointer',
                  borderRadius: '4px',
                  py: 1,
                  backgroundColor: selectedFolder === folderId 
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
                    fontWeight: selectedFolder === folderId ? 600 : 400
                  }}
                />
                <IconButton 
                  edge="end" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(folderId);
                  }}
                >
                  {isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                </IconButton>
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <FolderTree 
                  folderList={folders[folderId] || []} 
                  level={level + 1} 
                  parentId={folderId} 
                />
              </Collapse>
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
            {error && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            )}
            <FolderTree parentId={null} />
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
