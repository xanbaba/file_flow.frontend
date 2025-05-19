import React, {useState} from 'react';
import {Box, Typography, Paper, Grid, Button, IconButton, Divider, Chip, useTheme, Link} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Folder as FolderIcon,
  Description as FileIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import {uiConfig} from '../../config';

const HomePage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list' for All Files section
  const theme = useTheme();

  // Mock data for files and folders
  const items = [
    {id: 1, name: 'Documents', type: 'folder', lastModified: '2023-05-15', color: theme.palette.custom.lightGreen},
    {id: 2, name: 'Images', type: 'folder', lastModified: '2023-05-10', color: theme.palette.custom.beige},
    {
      id: 3,
      name: 'Project Proposal.docx',
      type: 'file',
      lastModified: '2023-05-18',
      color: theme.palette.primary.main
    },
    {id: 4, name: 'Budget.xlsx', type: 'file', lastModified: '2023-05-17', color: theme.palette.secondary.main},
    {
      id: 5,
      name: 'Presentation.pptx',
      type: 'file',
      lastModified: '2023-05-16',
      color: theme.palette.custom.yellow
    },
    {
      id: 6,
      name: 'Marketing Plan',
      type: 'folder',
      lastModified: '2023-05-14',
      color: theme.palette.custom.lightGreen
    },
    {
      id: 7,
      name: 'Financial Report',
      type: 'folder',
      lastModified: '2023-05-12',
      color: theme.palette.custom.beige
    },
    {
      id: 8,
      name: 'Meeting Notes.docx',
      type: 'file',
      lastModified: '2023-05-11',
      color: theme.palette.primary.main
    },
    {id: 9, name: 'Sales Data.xlsx', type: 'file', lastModified: '2023-05-09', color: theme.palette.secondary.main},
    {
      id: 10,
      name: 'Product Roadmap.pptx',
      type: 'file',
      lastModified: '2023-05-08',
      color: theme.palette.custom.yellow
    },
  ];

  // Recent items (first 5)
  const recentItems = items.slice(0, 5);

  return (
      <Box sx={{flexGrow: 1}}>
        {/* Action Bar */}
        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center'}}>
          <Typography variant="h4" component="h1" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
            Home
          </Typography>
          <Box>
            <Button
                variant="contained"
                startIcon={<CloudUploadIcon/>}
                sx={{
                  mr: 2,
                  bgcolor: theme.palette.primary.dark,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                  }
                }}
            >
              Upload
            </Button>
            <Button
                variant="outlined"
                startIcon={<CreateNewFolderIcon/>}
                sx={{
                  borderColor: theme.palette.secondary.dark,
                  transition: 'all 0.15s ease-in-out',
                  color: theme.palette.secondary.dark,
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                    bgcolor: 'rgba(226, 195, 145, 0.04)',
                  }
                }}
            >
              New Folder
            </Button>
          </Box>
        </Box>

        {/* Recent Section */}
        <Box sx={{mb: 4}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center'}}>
            <Typography variant="h6" component="h2" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
              Recent
            </Typography>
            <Link
                component="button"
                variant="body2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
            >
              Show more
              <NavigateNextIcon fontSize="small"/>
            </Link>
          </Box>

          {/* Recent Files and Folders - Always in block view with horizontal scroll */}
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
            {recentItems.map((item) => (
                <Paper
                    key={item.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 150,
                      width: 220,
                      minWidth: 220,
                      cursor: 'pointer',
                      marginTop: "5px",
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease-in-out',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
                      },
                    }}
                >
                  {/* Top section with icon and name */}
                  <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <Box
                        sx={{
                          width: 40,
                          height: 40,
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
                          <FolderIcon sx={{fontSize: 24}}/>
                      ) : (
                          <FileIcon sx={{fontSize: 24}}/>
                      )}
                    </Box>
                    <Typography
                        variant="subtitle1"
                        component="h2"
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

                  {/* Bottom section with type and date */}
                  <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 'auto'}}>
                    <Chip
                        label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                          fontSize: '0.7rem',
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {item.lastModified}
                    </Typography>
                  </Box>
                </Paper>
            ))}
          </Box>
        </Box>

        {/* All Files Section */}
        <Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center'}}>
            <Typography variant="h6" component="h2" sx={{fontWeight: 600, color: theme.palette.text.primary}}>
              All Files
            </Typography>
            <Box sx={{
              display: 'flex',
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              borderRadius: '12px',
              padding: '4px'
            }}>
              <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  sx={{
                    borderRadius: '8px',
                    bgcolor: viewMode === 'list' ? 'rgba(155, 190, 199, 0.2)' : 'transparent'
                  }}
              >
                <ViewListIcon/>
              </IconButton>
              <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  sx={{
                    borderRadius: '8px',
                    bgcolor: viewMode === 'grid' ? 'rgba(155, 190, 199, 0.2)' : 'transparent'
                  }}
              >
                <ViewModuleIcon/>
              </IconButton>
            </Box>
          </Box>

          {/* All Files and Folders - Grid or List view */}
          {viewMode === 'grid' ? (
              <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid item xs={3} key={item.id}>
                      <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 120,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease-in-out',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.08)',
                            },
                          }}
                      >
                        {/* Top section with icon and name */}
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                          <Box
                              sx={{
                                width: 32,
                                height: 32,
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
                                <FolderIcon sx={{fontSize: 20}}/>
                            ) : (
                                <FileIcon sx={{fontSize: 20}}/>
                            )}
                          </Box>
                          <Typography
                              variant="body2"
                              component="h2"
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

                        {/* Bottom section with type and date */}
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 'auto'}}>
                          <Chip
                              label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                fontSize: '0.7rem',
                              }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {item.lastModified}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                ))}
              </Grid>
          ) : (
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
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
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
                          }}
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
                          {item.type === 'folder' ? <FolderIcon/> : <FileIcon/>}
                        </Box>
                        <Box sx={{flexGrow: 1}}>
                          <Typography variant="subtitle1" sx={{fontWeight: 500}}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                          <Chip
                              label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                mr: 2,
                              }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{width: '120px'}}>
                            {item.lastModified}
                          </Typography>
                        </Box>
                      </Box>
                      {index < items.length - 1 && <Divider sx={{opacity: 0.5}}/>}
                    </React.Fragment>
                ))}
              </Paper>
          )}
        </Box>
      </Box>
  );
};

export default HomePage;
