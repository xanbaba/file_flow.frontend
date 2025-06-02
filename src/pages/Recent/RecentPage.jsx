import React, { useState, useEffect, useCallback, useRef } from 'react';
import {Box, Typography, useTheme, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import { fetchRecentItems } from '../../services/api';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { useAuthToken } from '../../components/Auth/AuthTokenProvider';

const RecentPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isTokenReady } = useAuthToken();
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigateToFolder } = useFileSystem();
  const isInitialMount = useRef(true);

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

  // Define fetchItems function with useCallback to ensure it's stable across renders
  const fetchItems = useCallback(async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot fetch recent items.');
      return;
    }

    try {
      setLoading(true);
      const items = await fetchRecentItems();
      setRecentItems(formatItems(items));
      setError(null);
    } catch (err) {
      console.error('Error fetching recent items:', err);
      setError('Failed to load recent items');
    } finally {
      setLoading(false);
    }
  }, [isTokenReady]);

  // Initial data fetch
  useEffect(() => {
    if (isTokenReady && isInitialMount.current) {
      isInitialMount.current = false;
      fetchItems();
    }
  }, [fetchItems, isTokenReady]);

  // Set up event listener for file operations
  useEffect(() => {
    // Function to handle file operation events
    const handleFileOperation = () => {
      fetchItems();
    };

    // Add event listeners for file operations
    window.addEventListener('fileRenamed', handleFileOperation);
    window.addEventListener('fileMoved', handleFileOperation);
    window.addEventListener('fileDeleted', handleFileOperation);
    window.addEventListener('folderRenamed', handleFileOperation);
    window.addEventListener('folderMoved', handleFileOperation);
    window.addEventListener('folderDeleted', handleFileOperation);

    // Clean up event listeners
    return () => {
      window.removeEventListener('fileRenamed', handleFileOperation);
      window.removeEventListener('fileMoved', handleFileOperation);
      window.removeEventListener('fileDeleted', handleFileOperation);
      window.removeEventListener('folderRenamed', handleFileOperation);
      window.removeEventListener('folderMoved', handleFileOperation);
      window.removeEventListener('folderDeleted', handleFileOperation);
    };
  }, [fetchItems]);

  // Handle item click - navigate to folder if it's a folder
  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      // Navigate to the homepage with the folder ID as a URL parameter
      navigate(`/?folder=${item.id}`);
    }
    // For files, you might want to implement a preview or download functionality
  };

  return (
      <Box sx={{flexGrow: 1}}>
        {/* Action Bar */}
        <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
          <AccessTimeIcon sx={{color: theme.palette.custom.lightGreen, mr: 1}}/>
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Recent
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}

        {/* Recent Files Section */}
        {!loading && !error && (
          <FileExplorer
              title=""
              items={recentItems}
              showViewToggle={true}
              defaultViewMode="list"
              onItemClick={handleItemClick}
          />
        )}
      </Box>
  );
};

export default RecentPage;
