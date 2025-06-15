import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  Divider, 
  useTheme, 
  alpha,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import FolderSelector from '../FolderSelector/FolderSelector';
import { uploadFile } from '../../services/api';
import { useAuthToken } from '../Auth/AuthTokenProvider';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { useNotification } from '../../contexts/NotificationContext';

const FileUploadPopup = ({ open, onClose, folders, onOpenNotificationPanel }) => {
  const theme = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const dialogRef = useRef(null);
  const { isTokenReady } = useAuthToken();
  const { refreshCurrentFolder } = useFileSystem();
  const { addNotification, updateNotification } = useNotification();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Use effect to stop propagation of all events from the dialog
  useEffect(() => {
    const dialogElement = dialogRef.current;

    // Function to stop event propagation
    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    if (dialogElement && open) {
      // Add event listeners to stop propagation
      dialogElement.addEventListener('click', stopPropagation, true);
      dialogElement.addEventListener('mousedown', stopPropagation, true);
      dialogElement.addEventListener('mouseup', stopPropagation, true);
      dialogElement.addEventListener('dblclick', stopPropagation, true);
    }

    // Cleanup function
    return () => {
      if (dialogElement) {
        dialogElement.removeEventListener('click', stopPropagation, true);
        dialogElement.removeEventListener('mousedown', stopPropagation, true);
        dialogElement.removeEventListener('mouseup', stopPropagation, true);
        dialogElement.removeEventListener('dblclick', stopPropagation, true);
      }
    };
  }, [open]);

  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => {
      const defaultFolder = folders && folders.length > 0 ? folders[0] : null;
      return {
        file,
        name: file.name,
        folder: defaultFolder ? defaultFolder.id : null,
        folderName: defaultFolder ? defaultFolder.name : null,
        size: file.size,
        type: file.type
      };
    });
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, [folders]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Handle file name edit
  const handleNameChange = (index, newName) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].name = newName;
    setUploadedFiles(updatedFiles);
  };

  // Handle folder selection
  const handleFolderChange = (index, folder) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].folder = folder.id;
    updatedFiles[index].folderName = folder.name;
    setUploadedFiles(updatedFiles);
  };

  // Handle file deletion
  const handleDeleteFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!isTokenReady) {
      setUploadError('Authentication token not ready. Please try again later.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    // Store files to upload before closing the popup
    const filesToUpload = [...uploadedFiles];

    // Reset state and close popup immediately
    setUploadedFiles([]);
    setUploading(false);
    onClose();

    // Open notification panel to show upload progress
    if (onOpenNotificationPanel) {
      onOpenNotificationPanel();
    }

    // Create a notification for each file being uploaded
    const notificationIds = filesToUpload.map(fileData => {
      return addNotification({
        type: 'info',
        message: `Uploading ${fileData.name}...`,
        timestamp: Date.now()
      });
    });

    // Create an array of promises for all uploads
    const uploadPromises = filesToUpload.map(async (fileData, index) => {
      try {
        // Upload the file
        await uploadFile(fileData.file, fileData.folder, fileData.name);

        // Update notification to show success
        updateNotification(notificationIds[index], {
          type: 'success',
          message: `${fileData.name} has been uploaded`,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error(`Error uploading file ${fileData.name}:`, error);

        // Update notification to show error
        updateNotification(notificationIds[index], {
          type: 'error',
          message: `Failed to upload ${fileData.name}: ${error.message || 'Unknown error'}`,
          timestamp: Date.now()
        });
      }
    });

    // Wait for all uploads to complete before refreshing
    await Promise.all(uploadPromises);

    // Refresh the folder contents to reflect the changes
    refreshCurrentFolder();

    // Dispatch event to update storage info in sidebar
    window.dispatchEvent(new Event('storageInfoUpdated'));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog 
      ref={dialogRef}
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          height: '80vh',
          maxHeight: '700px',
          width: '90%',
          maxWidth: '1000px'
        },
        onClick: (e) => e.stopPropagation()
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upload Files
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ opacity: 0.6 }} />

        {/* Content */}
        <DialogContent sx={{ flexGrow: 1, p: 3, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Dropzone */}
          <Paper
            {...getRootProps()}
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '16px',
              border: `2px dashed ${isDragActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.5)}`,
              backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '200px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to select files
            </Typography>
          </Paper>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Files to Upload
              </Typography>
              <List sx={{ width: '100%' }}>
                {uploadedFiles.map((file, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        mb: 1,
                        backgroundColor: alpha(theme.palette.background.default, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {/* File name */}
                          {editingIndex === index ? (
                            <TextField
                              fullWidth
                              value={file.name}
                              onChange={(e) => handleNameChange(index, e.target.value)}
                              size="small"
                              autoFocus
                              onBlur={() => setEditingIndex(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingIndex(null);
                                }
                              }}
                              sx={{ mr: 2 }}
                            />
                          ) : (
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 500, 
                                flexGrow: 1,
                                mr: 2
                              }}
                            >
                              {file.name}
                            </Typography>
                          )}

                          {/* Edit button */}
                          <IconButton 
                            size="small" 
                            onClick={() => setEditingIndex(index)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          {/* Delete button */}
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteFile(index)}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {/* File info */}
                          <Typography variant="body2" color="textSecondary">
                            {formatFileSize(file.size)}
                          </Typography>

                          {/* Folder selector */}
                          <FolderSelector
                            selectedFolder={file.folder ? { id: file.folder, name: file.folderName || 'Unknown Folder' } : null}
                            onChange={(folder) => handleFolderChange(index, folder)}
                          />
                        </Box>
                      </Box>
                    </ListItem>
                    {index < uploadedFiles.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>

        {/* Error message */}
        {uploadError && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Alert severity="error" sx={{ width: '100%' }}>
              {uploadError}
            </Alert>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            sx={{ mr: 2 }}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || uploading}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default FileUploadPopup;
