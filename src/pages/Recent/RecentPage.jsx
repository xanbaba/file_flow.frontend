import React, { useState } from 'react';
import {Box, Typography, Button, useTheme} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import FileUploadPopup from '../../components/FileUploadPopup/FileUploadPopup';

const RecentPage = () => {
  const theme = useTheme();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  const handleOpenUploadPopup = () => {
    setIsUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setIsUploadPopupOpen(false);
  };

  // Mock data for recent files and folders
  const recentItems = [
    {id: 3, name: 'Project Proposal.docx', type: 'file', lastModified: '2023-05-18', color: theme.palette.primary.main},
    {id: 4, name: 'Budget.xlsx', type: 'file', lastModified: '2023-05-17', color: theme.palette.secondary.main},
    {id: 5, name: 'Presentation.pptx', type: 'file', lastModified: '2023-05-16', color: theme.palette.custom.yellow},
    {id: 1, name: 'Documents', type: 'folder', lastModified: '2023-05-15', color: theme.palette.custom.lightGreen},
    {id: 6, name: 'Marketing Plan', type: 'folder', lastModified: '2023-05-14', color: theme.palette.custom.lightGreen},
    {id: 7, name: 'Financial Report', type: 'folder', lastModified: '2023-05-12', color: theme.palette.custom.beige},
    {id: 8, name: 'Meeting Notes.docx', type: 'file', lastModified: '2023-05-11', color: theme.palette.primary.main},
  ];

  // Extract folders from recentItems for the upload popup
  const folders = recentItems.filter(item => item.type === 'folder').map(folder => ({
    id: folder.id,
    name: folder.name
  }));

  return (
    <Box sx={{flexGrow: 1}}>
      {/* Action Bar */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon sx={{ color: theme.palette.custom.lightGreen, mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Recent
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

      {/* Recent Files Section */}
      <FileExplorer
        title="Recent Files"
        items={recentItems}
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

export default RecentPage;
