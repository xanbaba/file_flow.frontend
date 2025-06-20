import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const RenameDialog = ({ open, onClose, onRename, itemName, itemType }) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const dialogRef = useRef(null);

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

  // Reset the name when the dialog opens
  useEffect(() => {
    if (open) {
      setNewName(itemName || '');
      setError('');
    }
  }, [open, itemName]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);

    // Basic validation
    if (!e.target.value.trim()) {
      setError('Name cannot be empty');
    } else {
      setError('');
    }
  };

  const handleRename = () => {
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    onRename(newName.trim());
    onClose();
  };

  return (
    <Dialog 
      ref={dialogRef}
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
        onClick: (e) => e.stopPropagation()
      }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Rename {itemType}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3, pt: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Enter a new name for this {itemType}:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            value={newName}
            onChange={handleNameChange}
            error={!!error}
            helperText={error}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            InputProps={{
              sx: { borderRadius: '8px' }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleRename} 
          variant="contained"
          disabled={!!error || !newName.trim()}
          sx={{ borderRadius: '8px', ml: 1 }}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
