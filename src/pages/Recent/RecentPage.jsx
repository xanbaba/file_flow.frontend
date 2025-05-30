import React from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import {
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';

const RecentPage = () => {
  const theme = useTheme();


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

  return (
      <Box sx={{flexGrow: 1}}>
        {/* Action Bar */}
        <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
          <AccessTimeIcon sx={{color: theme.palette.custom.lightGreen, mr: 1}}/>
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Recent
          </Typography>
        </Box>

        {/* Recent Files Section */}
        <FileExplorer
            title=""
            items={recentItems}
            showViewToggle={true}
            defaultViewMode="list"
        />
      </Box>
  );
};

export default RecentPage;
