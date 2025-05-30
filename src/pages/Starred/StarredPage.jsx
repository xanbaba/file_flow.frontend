import React from 'react';
import {Box, Typography, Button, useTheme} from '@mui/material';
import {
  Star as StarIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';

const StarredPage = () => {
  const theme = useTheme();


  // Mock data for starred files and folders
  const starredItems = [
    {
      id: 1,
      name: 'Documents',
      type: 'folder',
      lastModified: '2023-05-15',
      color: theme.palette.custom.lightGreen,
      starred: true
    },
    {
      id: 3,
      name: 'Project Proposal.docx',
      type: 'file',
      lastModified: '2023-05-18',
      color: theme.palette.primary.main,
      starred: true
    },
    {
      id: 5,
      name: 'Presentation.pptx',
      type: 'file',
      lastModified: '2023-05-16',
      color: theme.palette.custom.yellow,
      starred: true
    },
    {
      id: 8,
      name: 'Meeting Notes.docx',
      type: 'file',
      lastModified: '2023-05-11',
      color: theme.palette.primary.main,
      starred: true
    },
  ];

  return (
      <Box sx={{flexGrow: 1}}>
        {/* Action Bar */}
        <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
          <StarIcon sx={{color: theme.palette.warning.main, mr: 1}}/>
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Starred
          </Typography>
        </Box>

        {/* Starred Files Section */}
        <FileExplorer
            title=""
            items={starredItems}
            showViewToggle={true}
            defaultViewMode="list"
        />
      </Box>
  );
};

export default StarredPage;
