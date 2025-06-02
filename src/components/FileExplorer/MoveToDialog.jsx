import React, { useState } from 'react';
import FolderSelectorPopup from '../FolderSelector/FolderSelectorPopup';

const MoveToDialog = ({ open, onClose, onMove, itemName, itemType }) => {
  const [error, setError] = useState(null);

  const handleMove = (folder) => {
    // Extract the folder ID from the folder object
    const folderId = folder?.id;
    try {
      onMove(folderId, setError);
      // The onMove function will handle closing the dialog if successful
    } catch (err) {
      // Error will be handled by the onMove function
      // which will call setError
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <FolderSelectorPopup
      open={open}
      onClose={handleClose}
      onConfirm={handleMove}
      title={`Move ${itemType} to`}
      description={`Select a destination folder for "${itemName}"`}
      confirmButtonText="Move"
      error={error}
    />
  );
};

export default MoveToDialog;
