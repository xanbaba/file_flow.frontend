import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  IconButton, 
  useTheme, 
  alpha,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { getFilePreview, downloadFile } from '../../services/api';
import { useAuthToken } from '../Auth/AuthTokenProvider';

const FilePreviewPopup = ({ open, onClose, file }) => {
  const theme = useTheme();
  const dialogRef = useRef(null);
  const { isTokenReady } = useAuthToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

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

  // Load file preview when dialog opens
  useEffect(() => {
    if (open && file && isTokenReady) {
      loadFilePreview();
    }
    
    // Cleanup when dialog closes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    };
  }, [open, file, isTokenReady]);

  // Load file preview
  const loadFilePreview = async () => {
    if (!file || !file.id) {
      setError('Invalid file');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const previewBlob = await getFilePreview(file.id);
      const url = URL.createObjectURL(previewBlob);
      setPreviewUrl(url);
      
      // Determine file type from file extension
      const extension = file.name.split('.').pop().toLowerCase();
      setFileType(extension);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading file preview:', error);
      setError(error.message || 'Failed to load file preview');
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (!file || !file.id || !isTokenReady) {
      return;
    }

    try {
      const blob = await downloadFile(file.id);
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError(error.message || 'Failed to download file');
    }
  };

  // Render preview based on file type
  const renderPreview = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    if (!previewUrl) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">No preview available</Alert>
        </Box>
      );
    }

    // Handle different file types
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileType);
    const isPdf = fileType === 'pdf';
    const isText = ['txt', 'md', 'json', 'html', 'css', 'js'].includes(fileType);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileType);
    const isAudio = ['mp3', 'wav', 'ogg'].includes(fileType);

    if (isImage) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
          <img 
            src={previewUrl} 
            alt={file.name} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain' 
            }} 
          />
        </Box>
      );
    }

    if (isPdf) {
      return (
        <Box sx={{ height: '100%', width: '100%' }}>
          <iframe 
            src={previewUrl} 
            title={file.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none' 
            }} 
          />
        </Box>
      );
    }

    if (isText) {
      return (
        <Box sx={{ height: '100%', width: '100%', p: 2, overflow: 'auto' }}>
          <iframe 
            src={previewUrl} 
            title={file.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none' 
            }} 
          />
        </Box>
      );
    }

    if (isVideo) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
          <video 
            src={previewUrl} 
            controls 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%' 
            }} 
          />
        </Box>
      );
    }

    if (isAudio) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
          <audio 
            src={previewUrl} 
            controls 
            style={{ 
              width: '100%' 
            }} 
          />
        </Box>
      );
    }

    // Default fallback
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Preview not available for this file type. Please download the file to view it.
        </Alert>
      </Box>
    );
  };

  return (
    <Dialog 
      ref={dialogRef}
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          height: '80vh',
          maxHeight: '800px',
          width: '90%',
          maxWidth: '1200px'
        },
        onClick: (e) => e.stopPropagation()
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {file?.name || 'File Preview'}
          </Typography>
          <Box>
            <IconButton onClick={handleDownload} size="small" sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ opacity: 0.6 }} />

        {/* Content */}
        <DialogContent sx={{ flexGrow: 1, p: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {renderPreview()}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default FilePreviewPopup;