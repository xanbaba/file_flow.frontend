import React, { useState } from 'react';
import {Box, Typography, Button, useTheme} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Star as StarIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import FileUploadPopup from '../../components/FileUploadPopup/FileUploadPopup';

const StarredPage = () => {
  const theme = useTheme();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  const handleOpenUploadPopup = () => {
    setIsUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setIsUploadPopupOpen(false);
  };

  // Mock data for starred files and folders
  const starredItems = [
    {id: 1, name: 'Documents', type: 'folder', lastModified: '2023-05-15', color: theme.palette.custom.lightGreen, starred: true},
    {id: 3, name: 'Project Proposal.docx', type: 'file', lastModified: '2023-05-18', color: theme.palette.primary.main, starred: true},
    {id: 5, name: 'Presentation.pptx', type: 'file', lastModified: '2023-05-16', color: theme.palette.custom.yellow, starred: true},
    {id: 8, name: 'Meeting Notes.docx', type: 'file', lastModified: '2023-05-11', color: theme.palette.primary.main, starred: true},
  ];

  // Extract folders from starredItems for the upload popup
  const folders = starredItems.filter(item => item.type === 'folder').map(folder => ({
    id: folder.id,
    name: folder.name
  }));

  return (
    <Box sx={{flexGrow: 1}}>
      {/* Action Bar */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Starred
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon/>}
            onClick={handleOpenUploadPopup}
            sx={{
              mr: 2,
              bgcolor: theme.palette.primary.dark,
              '&:hover': {
                bgcolor: theme.palette.primary.main,
              }
            }}
          >
            Upload
          </Button>
          <Button
            variant="outlined"
            startIcon={<CreateNewFolderIcon/>}
            sx={{
              borderColor: theme.palette.secondary.dark,
              transition: 'all 0.15s ease-in-out',
              color: theme.palette.secondary.dark,
              '&:hover': {
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
                bgcolor: 'rgba(226, 195, 145, 0.04)',
              }
            }}
          >
            New Folder
          </Button>
        </Box>
      </Box>

      {/* Starred Files Section */}
      <FileExplorer
        title="Starred Files"
        items={starredItems}
        showViewToggle={true}
        defaultViewMode="list"
      />

      {/* File Upload Popup */}
      <FileUploadPopup
        open={isUploadPopupOpen}
        onClose={handleCloseUploadPopup}
        folders={folders}
      />
    </Box>
  );
};

export default StarredPage;
