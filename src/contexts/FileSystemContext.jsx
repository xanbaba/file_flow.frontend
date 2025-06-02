import React, {createContext, useCallback, useContext, useState, useMemo} from 'react';
import {
  BadRequestError,
  createFolder,
  fetchFolder,
  fetchFolderChildren,
  NotFoundError,
  UnauthorizedError
} from '../services/api';
import { useAuthToken } from '../components/Auth/AuthTokenProvider';

// Create the context
const FileSystemContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};

// Provider component
export const FileSystemProvider = ({ children }) => {
  const { isTokenReady } = useAuthToken();
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderContents, setFolderContents] = useState([]);
  const [folderPath, setFolderPath] = useState([{ id: 'root', name: 'Home' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the contents of a folder
  const fetchFolderContents = useCallback(async (folderId = 'root') => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot fetch folder contents.');
      setError('Authentication token not ready. Please try again in a moment.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const contents = await fetchFolderChildren(folderId);
      setFolderContents(contents);

      // If not root, fetch folder details to update path
      if (folderId !== 'root') {
        const folderDetails = await fetchFolder(folderId);
        setCurrentFolder(folderDetails);

        // Update the folder path
        // This is a simplified approach - in a real app, you might need to fetch the full path
        setFolderPath(prev => {
          // Check if this folder is already in the path
          if (!prev.find(item => item.id === folderId)) {
            return [...prev, { id: folderId, name: folderDetails.name }];
          }
          return prev;
        });
      } else {
        setCurrentFolder(null);
        setFolderPath([{ id: 'root', name: 'Home' }]);
      }

      setCurrentFolderId(folderId);
    } catch (err) {
      console.error('Error fetching folder contents:', err);

      // Handle specific error types
      if (err instanceof NotFoundError) {
        setError('The requested folder was not found. It may have been moved or deleted.');
      } else if (err instanceof UnauthorizedError) {
        setError('You are not authorized to access this folder. Please log in again.');
      } else if (err instanceof BadRequestError) {
        setError('Invalid folder ID. Please navigate to a valid folder.');
      } else {
        setError('Failed to load folder contents. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isTokenReady]);

  // Navigate to a folder
  const navigateToFolder = useCallback((folderId) => {
    fetchFolderContents(folderId);
  }, [fetchFolderContents]);

  // Navigate to a specific path index
  const navigateToPathIndex = useCallback((index) => {
    setFolderPath(prev => {
      if (index >= 0 && index < prev.length) {
        const targetFolder = prev[index];
        // Truncate the path to this index
        const newPath = prev.slice(0, index + 1);
        // Directly fetch folder contents without setTimeout
        // This avoids potential duplicate calls and race conditions
        fetchFolderContents(targetFolder.id);
        return newPath;
      }
      return prev;
    });
  }, [fetchFolderContents]);

  // Create a new folder
  const handleCreateFolder = useCallback(async (folderName, targetFolderId = null) => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot create folder.');
      throw new Error('Authentication token not ready. Please try again in a moment.');
    }

    setLoading(true);
    try {
      // Use the provided targetFolderId if available, otherwise use the current folder ID
      const folderId = targetFolderId || currentFolderId;
      const newFolder = await createFolder(folderName, folderId === 'root' ? null : folderId);

      // Directly refresh the current folder contents
      // This avoids potential duplicate calls and race conditions
      fetchFolderContents(currentFolderId);

      return newFolder;
    } catch (err) {
      console.error('Error creating folder:', err);

      // Don't set error in context, let the component handle it
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFolderContents, currentFolderId, isTokenReady]);

  // Format items to match the expected structure in the UI
  const formatItems = useCallback((items) => {
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

    return items.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type === 'folder' ? 'folder' : 'file',
      isStarred: item.isStarred,
      color: item.type === 'folder' ? '#f6e27f' : getFileColor(item.name), // Yellow for folders, dynamic for files
      parentId: item.parentId,
      path: item.path,
      size: item.size,
      fileCategory: item.fileCategory,
      isInTrash: item.isInTrash
    }));
  }, []);

  // Define refreshCurrentFolder with useCallback to ensure stability
  const refreshCurrentFolder = useCallback(() => {
    // Directly fetch folder contents without setTimeout
    // This avoids potential duplicate calls and race conditions
    fetchFolderContents(currentFolderId);
  }, [currentFolderId, fetchFolderContents]);

  // Value object to be provided to consumers
  const value = useMemo(() => ({
    currentFolderId,
    currentFolder,
    folderContents: formatItems(folderContents),
    folderPath,
    loading,
    error,
    navigateToFolder,
    navigateToPathIndex,
    createFolder: handleCreateFolder,
    refreshCurrentFolder
  }), [
    currentFolderId,
    currentFolder,
    folderContents,
    folderPath,
    loading,
    error,
    navigateToFolder,
    navigateToPathIndex,
    handleCreateFolder,
    refreshCurrentFolder,
    formatItems
  ]);

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
};

export default FileSystemContext;
