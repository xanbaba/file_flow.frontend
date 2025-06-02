import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import {Box, Typography, useTheme, CircularProgress} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import BreadcrumbNavigation from '../../components/FileExplorer/BreadcrumbNavigation';

import {useFileSystem} from "../../contexts/FileSystemContext.jsx";
import {useAuthToken} from "../../components/Auth/AuthTokenProvider";

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("home page loading")
  const { 
    folderContents, 
    loading, 
    error, 
    refreshCurrentFolder,
    currentFolderId,
    navigateToFolder
  } = useFileSystem();
  const { isTokenReady } = useAuthToken();

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Check for folder parameter in URL and refresh folder contents
  useEffect(() => {
    if (isTokenReady) {
      // Check if we have a folder parameter in the URL
      const params = new URLSearchParams(location.search);
      const folderParam = params.get('folder');

      if (folderParam) {
        // If we have a folder parameter, navigate to that folder
        navigateToFolder(folderParam);
        // Clear the URL parameter to avoid navigating to the same folder on refresh
        navigate('/', { replace: true });
      } else if (isInitialMount.current) {
        // Only refresh on initial mount if there's no folder parameter
        refreshCurrentFolder();
      }

      // Mark as not initial mount anymore
      isInitialMount.current = false;
    }
  }, [refreshCurrentFolder, isTokenReady, location.search, navigate, navigateToFolder]);

  // Set up event listener for file operations
  useEffect(() => {
    // Function to handle file operation events
    const handleFileOperation = () => {
      refreshCurrentFolder();
    };

    // Add event listeners for file operations
    window.addEventListener('fileRenamed', handleFileOperation);
    window.addEventListener('fileMoved', handleFileOperation);
    window.addEventListener('fileDeleted', handleFileOperation);
    window.addEventListener('folderRenamed', handleFileOperation);
    window.addEventListener('folderMoved', handleFileOperation);
    window.addEventListener('folderDeleted', handleFileOperation);
    window.addEventListener('itemStarredStatusChanged', handleFileOperation);

    // Clean up event listeners
    return () => {
      window.removeEventListener('fileRenamed', handleFileOperation);
      window.removeEventListener('fileMoved', handleFileOperation);
      window.removeEventListener('fileDeleted', handleFileOperation);
      window.removeEventListener('folderRenamed', handleFileOperation);
      window.removeEventListener('folderMoved', handleFileOperation);
      window.removeEventListener('folderDeleted', handleFileOperation);
      window.removeEventListener('itemStarredStatusChanged', handleFileOperation);
    };
  }, [refreshCurrentFolder]);

  // For recent items, we'll use the first 5 items from folderContents for now
  // In a real app, you would fetch recent items from a separate API endpoint
  const recentItems = useMemo(() => {
    return folderContents.slice(0, 5);
  }, [folderContents]);

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

export default React.memo(HomePage);
