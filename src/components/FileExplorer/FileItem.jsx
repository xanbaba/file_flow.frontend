import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, useTheme } from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import FileContextMenu from './FileContextMenu';
import RenameDialog from './RenameDialog';
import MoveToDialog from './MoveToDialog';
import FileUploadPopup from '../FileUploadPopup/FileUploadPopup';
import FilePreviewPopup from '../FilePreviewPopup/FilePreviewPopup';
import ConfirmationPopup from '../ConfirmationPopup/ConfirmationPopup';
import { 
  renameFile, 
  renameFolder, 
  moveItem, 
  moveFileToTrash, 
  moveFolderToTrash, 
  starItem, 
  unstarItem,
  permanentDeleteFile,
  permanentDeleteFolder,
  restoreFile,
  restoreFolder,
  downloadFile
} from '../../services/api';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { useAuthToken } from '../Auth/AuthTokenProvider';

const FileItem = ({ item, viewMode, onClick: externalOnClick, isTrash = false }) => {
  const theme = useTheme();
  const { refreshCurrentFolder } = useFileSystem();
  const { isTokenReady } = useAuthToken();
  const [isStarred, setIsStarred] = useState(item.isStarred || false);
  const [isHovered, setIsHovered] = useState(false);

  // Context menu state
  const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [isRightClick, setIsRightClick] = useState(false);
  const contextMenuOpen = Boolean(contextMenuAnchorEl) || Boolean(contextMenuPosition);

  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  const [permanentDeleteConfirmOpen, setPermanentDeleteConfirmOpen] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);

  // Use the current folder as the default destination
  const [selectedFolders, setSelectedFolders] = useState([]);

  const handleStarClick = async (e) => {
    e.stopPropagation();

    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot update star status.');
      return;
    }

    try {
      if (isStarred) {
        // If currently starred, unstar it
        await unstarItem(item.id);
        console.log(`Successfully unstarred ${item.name}`);
      } else {
        // If not starred, star it
        await starItem(item.id);
        console.log(`Successfully starred ${item.name}`);
      }

      // Update local state after successful API call
      setIsStarred(!isStarred);

      // Refresh the folder contents to reflect the changes
      refreshCurrentFolder();

      // Dispatch custom event for item starred/unstarred
      window.dispatchEvent(new CustomEvent('itemStarredStatusChanged', {
        detail: { itemId: item.id, isStarred: !isStarred }
      }));
    } catch (error) {
      console.error(`Error updating star status for ${item.name}:`, error);
      // Here you would typically show an error message to the user
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    setContextMenuAnchorEl(null);
    setIsRightClick(true);
  };

  const handleMenuButtonClick = (event) => {
    event.stopPropagation();
    setContextMenuAnchorEl(event.currentTarget);
    setContextMenuPosition(null);
    setIsRightClick(false);
  };

  const handleCloseContextMenu = () => {
    setContextMenuAnchorEl(null);
    setContextMenuPosition(null);
    setIsRightClick(false);
  };

  // Action handlers
  const handleRename = () => {
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async (newName) => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot rename item.');
      return;
    }

    try {
      if (item.type === 'folder') {
        await renameFolder(item.id, newName);
        // Dispatch custom event for folder renamed
        window.dispatchEvent(new CustomEvent('folderRenamed'));
      } else {
        await renameFile(item.id, newName);
        // Dispatch custom event for file renamed
        window.dispatchEvent(new CustomEvent('fileRenamed'));
      }
      console.log(`Successfully renamed ${item.name} to ${newName}`);
      // Refresh the folder contents to reflect the changes
      refreshCurrentFolder();
    } catch (error) {
      console.error(`Error renaming ${item.type}:`, error);
      // Here you would typically show an error message to the user
    }
  };

  const handleMoveToTrash = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot move item to trash.');
      return;
    }

    try {
      if (item.type === 'folder') {
        await moveFolderToTrash(item.id);
        // Dispatch custom event for folder deleted (moved to trash)
        window.dispatchEvent(new CustomEvent('folderDeleted'));
      } else {
        await moveFileToTrash(item.id);
        // Dispatch custom event for file deleted (moved to trash)
        window.dispatchEvent(new CustomEvent('fileDeleted'));
      }
      console.log(`Successfully moved ${item.name} to trash`);
      // Refresh the folder contents to reflect the changes
      refreshCurrentFolder();
    } catch (error) {
      console.error(`Error moving ${item.type} to trash:`, error);
      // Here you would typically show an error message to the user
    }
  };

  const handleMoveTo = () => {
    setMoveDialogOpen(true);
  };

  const handleMoveSubmit = async (folderId, setError) => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot move item.');
      if (setError) {
        setError('Authentication token not ready. Please try again later.');
      }
      return;
    }

    try {
      await moveItem(item.id, folderId);
      // Dispatch custom event for item moved
      if (item.type === 'folder') {
        window.dispatchEvent(new CustomEvent('folderMoved'));
      } else {
        window.dispatchEvent(new CustomEvent('fileMoved'));
      }
      console.log(`Successfully moved ${item.name} to folder with ID ${folderId}`);
      // Refresh the folder contents to reflect the changes
      refreshCurrentFolder();
      // Clear any previous error
      if (setError) {
        setError(null);
      }
      // Close the dialog
      setMoveDialogOpen(false);
    } catch (error) {
      console.error(`Error moving ${item.type}:`, error);
      // Show error message to the user
      if (setError) {
        if (error.name === 'BadRequestError') {
          setError(error.message || `Cannot move ${item.type} to this location.`);
        } else {
          setError(`Error moving ${item.type}. Please try again.`);
        }
      }
    }
  };

  const handleDownload = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot download file.');
      return;
    }

    try {
      const blob = await downloadFile(item.id);
      const url = URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Successfully downloaded ${item.name}`);
    } catch (error) {
      console.error(`Error downloading ${item.name}:`, error);
      // Here you would typically show an error message to the user
    }
  };

  const handleUploadTo = () => {
    console.log(`Uploading to ${item.name}`);
    // Set the current folder as the default destination
    setSelectedFolders([{
      id: item.id,
      name: item.name
    }]);
    // Open the upload popup
    setIsUploadPopupOpen(true);
  };

  const handleCloseUploadPopup = () => {
    setIsUploadPopupOpen(false);
  };

  const handleClosePreviewPopup = () => {
    setIsPreviewPopupOpen(false);
  };

  const handleFilePreview = () => {
    setIsPreviewPopupOpen(true);
  };

  // Handle item click - navigate to folder if it's a folder, show preview if it's a file
  const handleItemClick = () => {
    if (item.type === 'folder') {
      // Call the external onClick handler for folders
      if (externalOnClick) {
        externalOnClick(item);
      }
    } else {
      // For files, show the preview popup
      handleFilePreview();
    }
  };

  const handlePermanentDelete = () => {
    setPermanentDeleteConfirmOpen(true);
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot permanently delete item.');
      return;
    }

    try {
      if (item.type === 'folder') {
        await permanentDeleteFolder(item.id);
        // Dispatch custom event for folder permanently deleted
        window.dispatchEvent(new CustomEvent('folderPermanentlyDeleted'));
      } else {
        await permanentDeleteFile(item.id);
        // Dispatch custom event for file permanently deleted
        window.dispatchEvent(new CustomEvent('filePermanentlyDeleted'));
      }
      console.log(`Successfully permanently deleted ${item.name}`);
      // Refresh the folder contents to reflect the changes
      refreshCurrentFolder();

      // Dispatch event to update storage info in sidebar
      window.dispatchEvent(new Event('storageInfoUpdated'));
    } catch (error) {
      console.error(`Error permanently deleting ${item.type}:`, error);
      // Here you would typically show an error message to the user
    }
  };

  const handleRestore = () => {
    setRestoreConfirmOpen(true);
  };

  const handleRestoreConfirm = async () => {
    if (!isTokenReady) {
      console.warn('Authentication token not ready. Cannot restore item.');
      return;
    }

    try {
      if (item.type === 'folder') {
        await restoreFolder(item.id);
        // Dispatch custom event for folder restored
        window.dispatchEvent(new CustomEvent('folderRestored'));
      } else {
        await restoreFile(item.id);
        // Dispatch custom event for file restored
        window.dispatchEvent(new CustomEvent('fileRestored'));
      }
      console.log(`Successfully restored ${item.name}`);
      // Refresh the folder contents to reflect the changes
      refreshCurrentFolder();
    } catch (error) {
      console.error(`Error restoring ${item.type}:`, error);
      // Here you would typically show an error message to the user
    }
  };

  if (viewMode === 'grid') {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          cursor: 'pointer',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
          },
          justifyContent: 'space-between',
        }}
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        {/* Top section with icon and name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              padding: "6px",
              borderRadius: '8px',
              bgcolor: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              color: item.type === 'folder' ? '#000000' : '#ffffff',
            }}
          >
            {item.type === 'folder' ? (
              <FolderIcon sx={{ fontSize: 20 }} />
            ) : (
              <FileIcon sx={{ fontSize: 20 }} />
            )}
          </Box>
          <Typography
            variant="body2"
            component="h2"
            sx={{
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexGrow: 1
            }}
          >
            {item.name}
          </Typography>
        </Box>

        {/* Action buttons row */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          {/* Star Button */}
          <IconButton 
            size="small" 
            onClick={handleStarClick}
            sx={{ 
              color: isStarred ? theme.palette.warning.main : theme.palette.text.secondary,
              opacity: isStarred || isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              padding: '4px',
              mr: 0.5,
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>

          {/* Menu Button */}
          <IconButton 
            size="small" 
            onClick={handleMenuButtonClick}
            sx={{ 
              color: theme.palette.text.secondary,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              padding: '4px',
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Context Menu */}
        <FileContextMenu
          anchorEl={contextMenuAnchorEl}
          open={contextMenuOpen}
          onClose={handleCloseContextMenu}
          isFolder={item.type === 'folder'}
          onRename={handleRename}
          onMoveToTrash={handleMoveToTrash}
          onMoveTo={handleMoveTo}
          onDownload={handleDownload}
          onUploadTo={handleUploadTo}
          position={contextMenuPosition}
          isRightClick={isRightClick}
          isTrash={isTrash}
          OnPermanentDelete={handlePermanentDelete}
          OnRestore={handleRestore}
          itemName={item.name}
        />

        {/* Dialogs */}
        <RenameDialog
          open={renameDialogOpen}
          onClose={() => setRenameDialogOpen(false)}
          onRename={handleRenameSubmit}
          itemName={item.name}
          itemType={item.type}
        />

        <MoveToDialog
          open={moveDialogOpen}
          onClose={() => setMoveDialogOpen(false)}
          onMove={handleMoveSubmit}
          itemName={item.name}
          itemType={item.type}
        />

        {/* File Upload Popup */}
        <FileUploadPopup
          open={isUploadPopupOpen}
          onClose={handleCloseUploadPopup}
          folders={selectedFolders}
        />

        {/* Confirmation Popup for Permanent Delete */}
        <ConfirmationPopup
          open={permanentDeleteConfirmOpen}
          onClose={() => setPermanentDeleteConfirmOpen(false)}
          onConfirm={handlePermanentDeleteConfirm}
          title="Permanently Delete"
          message={`Are you sure you want to permanently delete this ${item.type}? This action cannot be undone.`}
          confirmButtonText="Delete Permanently"
          severity="error"
        />

        {/* Confirmation Popup for Restore */}
        <ConfirmationPopup
          open={restoreConfirmOpen}
          onClose={() => setRestoreConfirmOpen(false)}
          onConfirm={handleRestoreConfirm}
          title="Restore from Trash"
          message={`Are you sure you want to restore this ${item.type} from trash?`}
          confirmButtonText="Restore"
          severity="info"
        />

        {/* File Preview Popup */}
        <FilePreviewPopup
          open={isPreviewPopupOpen}
          onClose={handleClosePreviewPopup}
          file={item}
        />
      </Paper>
    );
  } else {
    return (
      <Box
        sx={{
          py: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.1s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          borderRadius: '8px',
          mx: 0.5
        }}
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            bgcolor: item.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            color: item.type === 'folder' ? '#000000' : '#ffffff',
          }}
        >
          {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', mr: 2 }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.name}
          </Typography>
        </Box>

        {/* Action buttons container */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Star Button */}
          <IconButton 
            size="small" 
            onClick={handleStarClick}
            sx={{ 
              color: isStarred ? theme.palette.warning.main : theme.palette.text.secondary,
              opacity: isStarred || isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              mr: 1,
              padding: '8px',
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>

          {/* Menu Button */}
          <IconButton 
            size="small" 
            onClick={handleMenuButtonClick}
            sx={{ 
              color: theme.palette.text.secondary,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              padding: '8px',
              backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Context Menu */}
        <FileContextMenu
          anchorEl={contextMenuAnchorEl}
          open={contextMenuOpen}
          onClose={handleCloseContextMenu}
          isFolder={item.type === 'folder'}
          onRename={handleRename}
          onMoveToTrash={handleMoveToTrash}
          onMoveTo={handleMoveTo}
          onDownload={handleDownload}
          onUploadTo={handleUploadTo}
          position={contextMenuPosition}
          isRightClick={isRightClick}
          isTrash={isTrash}
          OnPermanentDelete={handlePermanentDelete}
          OnRestore={handleRestore}
          itemName={item.name}
        />

        {/* Dialogs */}
        <RenameDialog
          open={renameDialogOpen}
          onClose={() => setRenameDialogOpen(false)}
          onRename={handleRenameSubmit}
          itemName={item.name}
          itemType={item.type}
        />

        <MoveToDialog
          open={moveDialogOpen}
          onClose={() => setMoveDialogOpen(false)}
          onMove={handleMoveSubmit}
          itemName={item.name}
          itemType={item.type}
        />

        {/* File Upload Popup */}
        <FileUploadPopup
          open={isUploadPopupOpen}
          onClose={handleCloseUploadPopup}
          folders={selectedFolders}
        />

        {/* Confirmation Popup for Permanent Delete */}
        <ConfirmationPopup
          open={permanentDeleteConfirmOpen}
          onClose={() => setPermanentDeleteConfirmOpen(false)}
          onConfirm={handlePermanentDeleteConfirm}
          title="Permanently Delete"
          message={`Are you sure you want to permanently delete this ${item.type}? This action cannot be undone.`}
          confirmButtonText="Delete Permanently"
          severity="error"
        />

        {/* Confirmation Popup for Restore */}
        <ConfirmationPopup
          open={restoreConfirmOpen}
          onClose={() => setRestoreConfirmOpen(false)}
          onConfirm={handleRestoreConfirm}
          title="Restore from Trash"
          message={`Are you sure you want to restore this ${item.type} from trash?`}
          confirmButtonText="Restore"
          severity="info"
        />

        {/* File Preview Popup */}
        <FilePreviewPopup
          open={isPreviewPopupOpen}
          onClose={handleClosePreviewPopup}
          file={item}
        />
      </Box>
    );
  }
};

export default FileItem;
