import React, { useState, useEffect } from 'react';
import {Box, Typography, Button, useTheme, CircularProgress} from '@mui/material';
import {
  RestoreFromTrash as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import ConfirmationPopup from '../../components/ConfirmationPopup/ConfirmationPopup';
import { fetchTrashItems, emptyTrash, restoreAllTrash } from '../../services/api';
import { useAuthToken } from '../../components/Auth/AuthTokenProvider';

const TrashPage = () => {
  const theme = useTheme();
  const { isTokenReady } = useAuthToken();

  // State for trash items and loading
  const [trashItems, setTrashItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for confirmation popups
  const [emptyTrashConfirmOpen, setEmptyTrashConfirmOpen] = useState(false);
  const [restoreAllConfirmOpen, setRestoreAllConfirmOpen] = useState(false);

  // Fetch trash items
  useEffect(() => {
    const getTrashItems = async () => {
      if (!isTokenReady) {
        return;
      }

      try {
        setIsLoading(true);
        const items = await fetchTrashItems();

        // Add color property to each item based on type
        const itemsWithColor = items.map(item => ({
          ...item,
          color: item.type === 'folder' 
            ? theme.palette.custom.lightGreen 
            : item.fileCategory === 'document' 
              ? theme.palette.primary.main
              : item.fileCategory === 'image'
                ? theme.palette.secondary.main
                : theme.palette.custom.yellow
        }));

        setTrashItems(itemsWithColor);
        setError(null);
      } catch (error) {
        console.error('Error fetching trash items:', error);
        setError('Failed to load trash items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getTrashItems();

    // Listen for events that should trigger a refresh
    const handleItemRestored = () => getTrashItems();
    const handleItemDeleted = () => getTrashItems();

    window.addEventListener('fileRestored', handleItemRestored);
    window.addEventListener('folderRestored', handleItemRestored);
    window.addEventListener('filePermanentlyDeleted', handleItemDeleted);
    window.addEventListener('folderPermanentlyDeleted', handleItemDeleted);

    return () => {
      window.removeEventListener('fileRestored', handleItemRestored);
      window.removeEventListener('folderRestored', handleItemRestored);
      window.removeEventListener('filePermanentlyDeleted', handleItemDeleted);
      window.removeEventListener('folderPermanentlyDeleted', handleItemDeleted);
    };
  }, [isTokenReady, theme.palette]);

  // Handler for emptying trash
  const handleEmptyTrash = () => {
    setEmptyTrashConfirmOpen(true);
  };

  const handleEmptyTrashConfirm = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot empty trash.');
      return;
    }

    try {
      await emptyTrash();
      setTrashItems([]);
      console.log('Successfully emptied trash');
    } catch (error) {
      console.error('Error emptying trash:', error);
      setError('Failed to empty trash. Please try again later.');
    }
  };

  // Handler for restoring all items
  const handleRestoreAll = () => {
    setRestoreAllConfirmOpen(true);
  };

  const handleRestoreAllConfirm = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot restore items.');
      return;
    }

    try {
      await restoreAllTrash();
      setTrashItems([]);
      console.log('Successfully restored all items from trash');
    } catch (error) {
      console.error('Error restoring items from trash:', error);
      setError('Failed to restore items. Please try again later.');
    }
  };

  return (
    <Box sx={{flexGrow: 1}}>
      {/* Action Bar */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DeleteOutlineIcon sx={{ color: theme.palette.text.primary, mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Trash
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<RestoreIcon/>}
            onClick={handleRestoreAll}
            disabled={isLoading || trashItems.length === 0}
            sx={{
              mr: 2,
              bgcolor: theme.palette.primary.dark,
              '&:hover': {
                bgcolor: theme.palette.primary.main,
              }
            }}
          >
            Restore
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteForeverIcon/>}
            onClick={handleEmptyTrash}
            disabled={isLoading || trashItems.length === 0}
            sx={{
              borderColor: theme.palette.error.main,
              transition: 'all 0.15s ease-in-out',
              color: theme.palette.error.main,
              '&:hover': {
                borderColor: theme.palette.error.dark,
                color: theme.palette.error.dark,
                bgcolor: 'rgba(211, 47, 47, 0.04)',
              }
            }}
          >
            Empty Trash
          </Button>
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Typography 
          color="error" 
          sx={{ mb: 2, textAlign: 'center' }}
        >
          {error}
        </Typography>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : trashItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="body1" color="textSecondary">
            Your trash is empty
          </Typography>
        </Box>
      ) : (
        /* Trash Files Section */
        <FileExplorer
          title="Deleted Files"
          items={trashItems}
          showViewToggle={true}
          defaultViewMode="list"
          isTrash={true}
        />
      )}

      {/* Confirmation Popups */}
      <ConfirmationPopup
        open={emptyTrashConfirmOpen}
        onClose={() => setEmptyTrashConfirmOpen(false)}
        onConfirm={handleEmptyTrashConfirm}
        title="Empty Trash"
        message="Are you sure you want to permanently delete all items in trash? This action cannot be undone."
        confirmButtonText="Empty Trash"
        severity="error"
      />

      <ConfirmationPopup
        open={restoreAllConfirmOpen}
        onClose={() => setRestoreAllConfirmOpen(false)}
        onConfirm={handleRestoreAllConfirm}
        title="Restore All Items"
        message="Are you sure you want to restore all items from trash?"
        confirmButtonText="Restore All"
        severity="info"
      />
    </Box>
  );
};

export default TrashPage;
