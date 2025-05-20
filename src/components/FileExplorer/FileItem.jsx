import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, IconButton, useTheme } from '@mui/material';
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

const FileItem = ({ item, viewMode, onClick }) => {
  const theme = useTheme();
  const [isStarred, setIsStarred] = useState(item.starred || false);
  const [isHovered, setIsHovered] = useState(false);

  // Context menu state
  const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState(null);
  const contextMenuOpen = Boolean(contextMenuAnchorEl);

  // Dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  const handleStarClick = (e) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    // Here you would typically call a function to update the starred status in your data store
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuAnchorEl(event.currentTarget);
  };

  const handleMenuButtonClick = (event) => {
    event.stopPropagation();
    setContextMenuAnchorEl(event.currentTarget);
  };

  const handleCloseContextMenu = () => {
    setContextMenuAnchorEl(null);
  };

  // Action handlers
  const handleRename = () => {
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = (newName) => {
    console.log(`Renaming ${item.name} to ${newName}`);
    // Here you would typically call a function to update the name in your data store
  };

  const handleMoveToTrash = () => {
    console.log(`Moving ${item.name} to trash`);
    // Here you would typically call a function to move the item to trash in your data store
  };

  const handleMoveTo = () => {
    setMoveDialogOpen(true);
  };

  const handleMoveSubmit = (folderId) => {
    console.log(`Moving ${item.name} to folder with ID ${folderId}`);
    // Here you would typically call a function to move the item to the selected folder in your data store
  };

  const handleDownload = () => {
    console.log(`Downloading ${item.name}`);
    // Here you would typically call a function to download the file
  };

  const handleUploadTo = () => {
    console.log(`Uploading to ${item.name}`);
    // Here you would typically open a file picker and upload the selected files to the folder
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
        onClick={onClick}
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
        onClick={onClick}
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
      </Box>
    );
  }
};

export default FileItem;
