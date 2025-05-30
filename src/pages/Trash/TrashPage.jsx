import React from 'react';
import {Box, Typography, Button, useTheme} from '@mui/material';
import {
  RestoreFromTrash as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  DeleteOutline as DeleteOutlineIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';

const TrashPage = () => {
  const theme = useTheme();

  // Mock data for trash files and folders
  const trashItems = [
    {id: 11, name: 'Old Project.docx', type: 'file', lastModified: '2023-04-18', color: theme.palette.primary.main},
    {id: 12, name: 'Archived Budget.xlsx', type: 'file', lastModified: '2023-04-17', color: theme.palette.secondary.main},
    {id: 13, name: 'Old Presentation.pptx', type: 'file', lastModified: '2023-04-16', color: theme.palette.custom.yellow},
    {id: 14, name: 'Archived Documents', type: 'folder', lastModified: '2023-04-15', color: theme.palette.custom.lightGreen},
    {id: 15, name: 'Old Marketing Plan', type: 'folder', lastModified: '2023-04-14', color: theme.palette.custom.lightGreen},
  ];

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

      {/* Trash Files Section */}
      <FileExplorer
        title="Deleted Files"
        items={trashItems}
        showViewToggle={true}
        defaultViewMode="list"
        isTrash={true}
      />
    </Box>
  );
};

export default TrashPage;
