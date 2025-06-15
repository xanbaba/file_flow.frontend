import React, { useState } from 'react';
import {
  Button,
  useTheme, 
  alpha 
} from '@mui/material';
import { 
  Folder as FolderIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import FolderSelectorPopup from './FolderSelectorPopup';

const FolderSelector = ({ selectedFolder, onChange, currentFolder }) => {
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

  // Use currentFolder as the initialSelectedFolder if provided and selectedFolder is not set
  const initialFolder = selectedFolder || currentFolder;

  // Function to get the display text for the button
  const getButtonText = () => {
    if (!initialFolder) return 'Select Folder';

    // Special case for root folder (id is null)
    if (initialFolder.id === null) return 'Home Directory';

    return initialFolder.name;
  };

  // Function to get the icon for the button
  const getButtonIcon = () => {
    if (initialFolder && initialFolder.id === null) {
      return <HomeIcon />;
    }
    return <FolderIcon />;
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenPopup}
        startIcon={getButtonIcon()}
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
        {getButtonText()}
      </Button>

      <FolderSelectorPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        onSelect={handleSelectFolder}
        initialSelectedFolder={initialFolder ? 
          initialFolder.id === null ? 'root' : initialFolder.id.toString() 
          : null}
      />
    </>
  );
};

export default FolderSelector;
