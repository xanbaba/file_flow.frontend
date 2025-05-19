import React, { useState } from 'react';
import {Box, Typography, Button, useTheme} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import FileUploadPopup from '../../components/FileUploadPopup/FileUploadPopup';
import NewFolderPopup from '../../components/NewFolderPopup';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isNewFolderPopupOpen, setIsNewFolderPopupOpen] = useState(false);

  const handleOpenUploadPopup = () => {
    setIsUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setIsUploadPopupOpen(false);
  };

  const handleOpenNewFolderPopup = () => {
    setIsNewFolderPopupOpen(true);
  };

  const handleCloseNewFolderPopup = () => {
    setIsNewFolderPopupOpen(false);
  };

  const handleCreateFolder = (folderData) => {
    console.log('Creating new folder:', folderData);
    // Here you would typically call an API to create the folder
    // For now, we'll just log the data
  };

  // Mock data for files and folders
  const items = [
    {id: 1, name: 'Documents', type: 'folder', lastModified: '2023-05-15', color: theme.palette.custom.lightGreen},
    {id: 2, name: 'Images', type: 'folder', lastModified: '2023-05-10', color: theme.palette.custom.beige},
    {
      id: 3,
      name: 'Project Proposal.docx',
      type: 'file',
      lastModified: '2023-05-18',
      color: theme.palette.primary.main
    },
    {id: 4, name: 'Budget.xlsx', type: 'file', lastModified: '2023-05-17', color: theme.palette.secondary.main},
    {
      id: 5,
      name: 'Presentation.pptx',
      type: 'file',
      lastModified: '2023-05-16',
      color: theme.palette.custom.yellow
    },
    {
      id: 6,
      name: 'Marketing Plan with a Very Long Name That Should Be Truncated',
      type: 'folder',
      lastModified: '2023-05-14',
      color: theme.palette.custom.lightGreen
    },
    {
      id: 7,
      name: 'Financial Report',
      type: 'folder',
      lastModified: '2023-05-12',
      color: theme.palette.custom.beige
    },
    {
      id: 8,
      name: 'Meeting Notes.docx',
      type: 'file',
      lastModified: '2023-05-11',
      color: theme.palette.primary.main
    },
    {id: 9, name: 'Sales Data.xlsx', type: 'file', lastModified: '2023-05-09', color: theme.palette.secondary.main},
    {
      id: 10,
      name: 'Product Roadmap.pptx',
      type: 'file',
      lastModified: '2023-05-08',
      color: theme.palette.custom.yellow
    },
  ];

  // Recent items (first 5)
  const recentItems = items.slice(0, 5);

  // Extract folders from items for the upload popup
  const folders = items.filter(item => item.type === 'folder').map(folder => ({
    id: folder.id,
    name: folder.name
  }));

  const handleShowMoreRecent = () => {
    navigate('/recent');
  };

  return (
      <Box sx={{flexGrow: 1}}>
        {/* Action Bar */}
        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center'}}>
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Home
          </Typography>
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
                onClick={handleOpenNewFolderPopup}
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

        {/* Recent Section */}
        <FileExplorer
            title="Recent"
            items={recentItems}
            showViewToggle={false}
            defaultViewMode="grid"
            showMoreLink={true}
            onShowMoreClick={handleShowMoreRecent}
            maxItems={5}
            horizontalScroll={true}
        />

        {/* All Files Section */}
        <FileExplorer
            title="All Files"
            items={items}
            showViewToggle={true}
            defaultViewMode="list"
        />

        {/* File Upload Popup */}
        <FileUploadPopup
            open={isUploadPopupOpen}
            onClose={handleCloseUploadPopup}
            folders={folders}
        />

        {/* New Folder Popup */}
        <NewFolderPopup
            open={isNewFolderPopupOpen}
            onClose={handleCloseNewFolderPopup}
            onCreateFolder={handleCreateFolder}
        />
      </Box>
  );
};

export default HomePage;
