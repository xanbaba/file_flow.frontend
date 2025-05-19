import React from 'react';
import { Box, IconButton, useTheme, alpha } from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';

const ViewToggle = ({ viewMode, onViewModeChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      bgcolor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: '12px',
      padding: '4px'
    }}>
      <IconButton
        onClick={() => onViewModeChange('list')}
        color={viewMode === 'list' ? 'primary' : 'default'}
        sx={{
          borderRadius: '8px',
          bgcolor: viewMode === 'list' ? 'rgba(155, 190, 199, 0.2)' : 'transparent'
        }}
      >
        <ViewListIcon />
      </IconButton>
      <IconButton
        onClick={() => onViewModeChange('grid')}
        color={viewMode === 'grid' ? 'primary' : 'default'}
        sx={{
          borderRadius: '8px',
          bgcolor: viewMode === 'grid' ? 'rgba(155, 190, 199, 0.2)' : 'transparent'
        }}
      >
        <ViewModuleIcon />
      </IconButton>
    </Box>
  );
};

export default ViewToggle;