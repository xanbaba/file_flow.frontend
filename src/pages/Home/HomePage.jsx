import React, { useEffect, useMemo, useRef } from 'react';
import {Box, Typography, useTheme, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import BreadcrumbNavigation from '../../components/FileExplorer/BreadcrumbNavigation';

import {useFileSystem} from "../../contexts/FileSystemContext.jsx";
import {useAuthToken} from "../../components/Auth/AuthTokenProvider";

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  console.log("home page loading")
  const { 
    folderContents, 
    loading, 
    error, 
    refreshCurrentFolder,
    currentFolderId
  } = useFileSystem();
  const { isTokenReady } = useAuthToken();

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Fetch folder contents only when the component initially mounts or when returning to root
  // and when the token is ready
  useEffect(() => {
    // Only fetch on initial mount or when explicitly navigating to root
    // and only if the token is ready
    if (isTokenReady && isInitialMount.current) {
      isInitialMount.current = false;
      refreshCurrentFolder();
    } else if (isTokenReady && currentFolderId === 'root') {
      // We're already at root, no need to fetch again unless explicitly navigated here
      // The navigation to root will already trigger the fetch via navigateToFolder
    }
  }, [refreshCurrentFolder, currentFolderId, isTokenReady]);

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
