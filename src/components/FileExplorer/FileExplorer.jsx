import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Divider, useTheme, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import FileItem from './FileItem';
import ViewToggle from './ViewToggle';

import {useFileSystem} from "../../contexts/FileSystemContext.jsx";

const FileExplorer = ({ 
  title, 
  items, 
  showViewToggle = true, 
  defaultViewMode = 'list',
  showMoreLink = false,
  onShowMoreClick,
  maxItems = null,
  horizontalScroll = false,
  isTrash = false,
  onItemClick
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState(() => {
    // Try to get the view mode from localStorage, or use the default
    const savedViewMode = localStorage.getItem('fileExplorerViewMode');
    return savedViewMode || defaultViewMode;
  });

  const displayItems = useMemo(() => {
    return maxItems ? items.slice(0, maxItems) : items;
  }, [items, maxItems]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Save the view mode to localStorage
    localStorage.setItem('fileExplorerViewMode', mode);
  };

  const { navigateToFolder } = useFileSystem();

  const handleItemClick = (item) => {
    // If a custom click handler is provided, use it
    if (onItemClick) {
      onItemClick(item);
      return;
    }

    // Default behavior: navigate to folder if the item is a folder
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    }
    // For files, you might want to implement a preview or download functionality
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {showMoreLink && (
            <Link
              component="button"
              variant="body2"
              onClick={onShowMoreClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: theme.palette.primary.main,
                textDecoration: 'none',
                mr: showViewToggle ? 2 : 0,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Show more
              <NavigateNextIcon fontSize="small" />
            </Link>
          )}
          {showViewToggle && (
            <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
          )}
        </Box>
      </Box>

      {/* Files and Folders Display */}
      {horizontalScroll ? (
        // Horizontal scrolling view (for Recent section)
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            pb: 2,
            gap: 3,
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
            }
          }}
        >
          {displayItems.map((item) => (
            <Box 
              key={item.id} 
              sx={{
                width: 180,
                minWidth: 180,
                marginTop: "5px"
              }}
            >
              <FileItem 
                item={item} 
                viewMode="grid" 
                onClick={() => handleItemClick(item)} 
                isTrash={isTrash}
              />
            </Box>
          ))}
        </Box>
      ) : viewMode === 'grid' ? (
        // Grid view
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 2
        }}>
          {displayItems.map((item) => (
            <Box 
              key={item.id}
              sx={{
                height: '100%',
                width: '100%'
              }}
            >
              <FileItem 
                item={item} 
                viewMode="grid" 
                onClick={() => handleItemClick(item)} 
                isTrash={isTrash}
              />
            </Box>
          ))}
        </Box>
      ) : (
        // List view
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            mb: 2,
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          {displayItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <FileItem 
                item={item} 
                viewMode="list" 
                onClick={() => handleItemClick(item)} 
                isTrash={isTrash}
              />
              {index < displayItems.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
            </React.Fragment>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default React.memo(FileExplorer);
