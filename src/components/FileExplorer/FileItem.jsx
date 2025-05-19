import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, IconButton, useTheme } from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon
} from '@mui/icons-material';

const FileItem = ({ item, viewMode, onClick }) => {
  const theme = useTheme();
  const [isStarred, setIsStarred] = useState(item.starred || false);
  const [isHovered, setIsHovered] = useState(false);

  const handleStarClick = (e) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    // Here you would typically call a function to update the starred status in your data store
  };

  if (viewMode === 'grid') {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 1,
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
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top section with icon and name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, position: 'relative' }}>
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
          <IconButton 
            size="small" 
            onClick={handleStarClick}
            sx={{ 
              position: 'absolute',
              right: -8,
              top: -8,
              color: isStarred ? theme.palette.warning.main : 'rgba(0, 0, 0, 0.3)',
              opacity: isStarred || isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'transparent',
              }
            }}
          >
            {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Paper>
    );
  } else {
    return (
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.1s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
          position: 'relative'
        }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {item.name}
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={handleStarClick}
          sx={{ 
            color: isStarred ? theme.palette.warning.main : 'rgba(0, 0, 0, 0.3)',
            opacity: isStarred || isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            mr: 1
          }}
        >
          {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
        </IconButton>
      </Box>
    );
  }
};

export default FileItem;
