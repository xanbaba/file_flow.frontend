import React, { useState } from 'react';
import {
  Button,
  useTheme, 
  alpha 
} from '@mui/material';
import { 
  Folder as FolderIcon,
  ArrowDropDown as ArrowDropDownIcon 
} from '@mui/icons-material';
import FolderSelectorPopup from './FolderSelectorPopup';

const FolderSelector = ({ selectedFolder, onChange }) => {
  const theme = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSelectFolder = (folder) => {
    onChange(folder);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenPopup}
        startIcon={<FolderIcon />}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: 'none',
          justifyContent: 'flex-start',
          borderColor: alpha(theme.palette.divider, 0.5),
          color: theme.palette.text.primary,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.05)
          },
          minWidth: 200,
          minHeight: 40
        }}
      >
        {selectedFolder ? selectedFolder.name : 'Select Folder'}
      </Button>

      <FolderSelectorPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        onSelect={handleSelectFolder}
        initialSelectedFolder={selectedFolder ? selectedFolder.id.toString() : null}
      />
    </>
  );
};

export default FolderSelector;