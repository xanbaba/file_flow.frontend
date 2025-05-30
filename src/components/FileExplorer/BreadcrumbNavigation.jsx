import React from 'react';
import { Box, Breadcrumbs, Link, Typography, useTheme } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

import {useFileSystem} from "../../contexts/UseFileSystem.jsx";

const BreadcrumbNavigation = () => {
  const theme = useTheme();
  const { folderPath, navigateToPathIndex } = useFileSystem();

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="folder navigation"
      >
        {folderPath.map((folder, index) => {
          const isLast = index === folderPath.length - 1;
          
          return isLast ? (
            <Typography 
              key={folder.id} 
              color="text.primary" 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem'
              }}
            >
              {folder.name}
            </Typography>
          ) : (
            <Link
              key={folder.id}
              component="button"
              variant="body2"
              onClick={() => navigateToPathIndex(index)}
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                },
                fontSize: '0.875rem'
              }}
            >
              {folder.name}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbNavigation;