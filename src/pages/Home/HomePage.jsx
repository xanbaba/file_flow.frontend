import React, { useEffect } from 'react';
import {Box, Typography, useTheme, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import BreadcrumbNavigation from '../../components/FileExplorer/BreadcrumbNavigation';
import { useFileSystem } from '../../contexts/FileSystemContext';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { 
    folderContents, 
    loading, 
    error, 
    refreshCurrentFolder,
    currentFolderId
  } = useFileSystem();

  // Fetch folder contents when the component mounts
  useEffect(() => {
    refreshCurrentFolder();
  }, [refreshCurrentFolder]);

  // For recent items, we'll use the first 5 items from folderContents for now
  // In a real app, you would fetch recent items from a separate API endpoint
  const recentItems = folderContents.slice(0, 5);

  const handleShowMoreRecent = () => {
    navigate('/recent');
  };

  return (
      <Box sx={{flexGrow: 1}}>
        {/* Action Bar */}
        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center'}}>
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            {currentFolderId === 'root' ? 'Home' : 'Folder'}
          </Typography>
        </Box>

        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ my: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Recent Section - only show on home page */}
            {currentFolderId === 'root' && recentItems.length > 0 && (
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
            )}

            {/* Files and Folders Section */}
            <FileExplorer
              title={currentFolderId === 'root' ? 'All Files' : 'Folder Contents'}
              items={folderContents}
              showViewToggle={true}
              defaultViewMode="list"
            />
          </>
        )}

      </Box>
  );
};

export default HomePage;
