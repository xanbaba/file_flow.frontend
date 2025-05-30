import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  TextField, 
  Divider, 
  useTheme, 
  alpha,
  Alert
} from '@mui/material';
import { 
  Close as CloseIcon,
  CreateNewFolder as CreateNewFolderIcon
} from '@mui/icons-material';
import FolderSelector from '../FolderSelector/FolderSelector';
import { useFileSystem } from '../../contexts/FileSystemContext';

const NewFolderPopup = ({ open, onClose, onCreateFolder }) => {
  const { currentFolder } = useFileSystem();
  const theme = useTheme();
  const [folderName, setFolderName] = useState('');
  const [selectedParentFolder, setSelectedParentFolder] = useState(null);
  const [nameError, setNameError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setFolderName('');
      setSelectedParentFolder(null);
      setNameError('');
      setApiError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleFolderNameChange = (e) => {
    const value = e.target.value;
    setFolderName(value);

    // Validate folder name
    if (!value.trim()) {
      setNameError('Folder name is required');
    } else if (value.length > 255) {
      setNameError('Folder name is too long (max 255 characters)');
    } else if (/[<>:"/\\|?*]/.test(value)) {
      setNameError('Folder name contains invalid characters');
    } else {
      setNameError('');
    }
  };

  const handleParentFolderChange = (folder) => {
    setSelectedParentFolder(folder);
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setNameError('Folder name is required');
      return;
    }

    if (nameError) {
      return;
    }

    // Clear any previous API errors
    setApiError('');
    setIsSubmitting(true);

    try {
      // Call the onCreateFolder callback with the new folder data
      await onCreateFolder({
        folderName: folderName.trim(),
        targetFolderId: selectedParentFolder ? selectedParentFolder.id : null
      });

      // Close the dialog only if successful
      onClose();
    } catch (error) {
      // Display the error message from the API
      setApiError(error.message || 'Failed to create folder. Please try again.');
      console.error('Error creating folder:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            Create New Folder
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ opacity: 0.6 }} />

        {/* Content */}
        <DialogContent sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          {apiError && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: '8px' }}
              onClose={() => setApiError('')}
            >
              {apiError}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Folder Name
            </Typography>
            <TextField
              fullWidth
              value={folderName}
              onChange={handleFolderNameChange}
              placeholder="Enter folder name"
              error={!!nameError}
              helperText={nameError}
              autoFocus
              disabled={isSubmitting}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </Box>

          <Box>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
              Parent Folder (Optional)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Select a parent folder or leave empty to create at the root level
            </Typography>
            <FolderSelector
              selectedFolder={selectedParentFolder}
              onChange={handleParentFolderChange}
              disabled={isSubmitting}
              currentFolder={currentFolder}
            />
          </Box>
        </DialogContent>

        {/* Footer */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            sx={{ mr: 2 }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateFolder}
            disabled={!folderName.trim() || !!nameError || isSubmitting}
            startIcon={<CreateNewFolderIcon />}
          >
            {isSubmitting ? 'Creating...' : 'Create Folder'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default NewFolderPopup;
