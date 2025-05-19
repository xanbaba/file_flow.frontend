import React from 'react';
import FolderSelectorPopup from '../FolderSelector/FolderSelectorPopup';

const MoveToDialog = ({ open, onClose, onMove, itemName, itemType }) => {
  const handleMove = (folderId) => {
    onMove(folderId);
    onClose();
  };

  return (
    <FolderSelectorPopup
      open={open}
      onClose={onClose}
      onConfirm={handleMove}
      title={`Move ${itemType} to`}
      description={`Select a destination folder for "${itemName}"`}
      confirmButtonText="Move"
    />
  );
};

export default MoveToDialog;