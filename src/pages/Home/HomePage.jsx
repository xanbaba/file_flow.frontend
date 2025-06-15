import React, { useEffect, useRef, useState } from 'react';
import {Box, Typography, useTheme, CircularProgress} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import BreadcrumbNavigation from '../../components/FileExplorer/BreadcrumbNavigation';

import {useFileSystem} from "../../contexts/FileSystemContext.jsx";
import {useAuthToken} from "../../components/Auth/AuthTokenProvider";
import { fetchRecentItems } from '../../services/api';

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
  const [recentItems, setRecentItems] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(null);

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true);

  // Check for folder parameter in URL and refresh folder contents
  // Also fetch recent items on initial mount
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

      // Fetch recent items on initial mount
      if (isInitialMount.current) {
        fetchRecentItemsData();
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
      fetchRecentItemsData(); // Also refresh recent items when file operations occur
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

  // Helper function to determine file color based on file extension
  const getFileColor = (fileName) => {
    if (!fileName) return '#9bbec7'; // Default to light blue

    const extension = fileName.split('.').pop().toLowerCase();

    // Document types
    if (['doc', 'docx', 'txt', 'pdf', 'rtf'].includes(extension)) {
      return '#9bbec7'; // Light blue for documents
    }

    // Spreadsheet types
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
      return '#a8b7ab'; // Light green for spreadsheets
    }

    // Presentation types
    if (['ppt', 'pptx'].includes(extension)) {
      return '#f6e27f'; // Yellow for presentations
    }

    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return '#e2c391'; // Beige for images
    }

    // Default color for other file types
    return '#9bbec7'; // Light blue as default
  };

  // Format items to add color property
  const formatItems = (items) => {
    return items.map(item => ({
      ...item,
      color: item.type === 'folder' ? '#f6e27f' : getFileColor(item.name), // Yellow for folders, dynamic for files
    }));
  };

  // Fetch recent items
  const fetchRecentItemsData = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot fetch recent items.');
      return;
    }

    try {
      setRecentLoading(true);
      const items = await fetchRecentItems();
      setRecentItems(formatItems(items));
      setRecentError(null);
    } catch (err) {
      console.error('Error fetching recent items:', err);
      setRecentError('Failed to load recent items');
    } finally {
      setRecentLoading(false);
    }
  };

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
            {currentFolderId === 'root' && (
              <>
                {/* Loading State for Recent Items */}
                {recentLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                  </Box>
                )}

                {/* Error State for Recent Items */}
                {recentError && !recentLoading && (
                  <Typography color="error" sx={{ my: 2 }}>
                    {recentError}
                  </Typography>
                )}

                {/* Recent Items */}
                {!recentLoading && !recentError && recentItems.length > 0 && (
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
              </>
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
