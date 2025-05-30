import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import {
  DriveFileMove as MoveIcon,
  Delete as DeleteIcon,
  Edit as RenameIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RestoreFromTrash as RestoreIcon,
} from '@mui/icons-material';

const FileContextMenu = ({
                           anchorEl,
                           open,
                           onClose,
                           isFolder,
                           onRename,
                           onMoveToTrash,
                           onMoveTo,
                           onDownload,
                           onUploadTo,
                           position,
                           isRightClick,
                           OnPermanentDelete,
                           OnRestore,

                           isTrash = false
                         }) => {
  const theme = useTheme();

  return (
      <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={onClose}
          onClick={onClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
              mt: 1.5,
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              minWidth: 180,
            },
          }}
          transformOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          anchorPosition={isRightClick && position ? {top: position.top, left: position.left} : undefined}
          anchorReference={isRightClick ? 'anchorPosition' : 'anchorEl'}
      >
        {isTrash ? (
            // Only show Delete and Restore options for items in trash
            [
              <MenuItem
                  sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                  onClick={(e) => {
                    e.stopPropagation();
                    OnPermanentDelete?.call();
                  }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" sx={{color: theme.palette.error.main}}/>
                </ListItemIcon>
                <ListItemText>{'Delete'}</ListItemText>
              </MenuItem>,
              <MenuItem
                  sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                  onClick={(e) => {
                    e.stopPropagation();
                    OnRestore?.call();
                  }}
              >
                <ListItemIcon>
                  <RestoreIcon fontSize="small" sx={{color: theme.palette.primary.dark}}/>
                </ListItemIcon>
                <ListItemText>{'Restore'}</ListItemText>
              </MenuItem>
            ]

        ) : (
            // Show all options for regular items
            [
              <MenuItem
                  sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename();
                  }}
              >
                <ListItemIcon>
                  <RenameIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
              </MenuItem>,

              <MenuItem
                  sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveToTrash();
                  }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" sx={{color: theme.palette.error.main}}/>
                </ListItemIcon>
                <ListItemText>{'Delete'}</ListItemText>
              </MenuItem>,

              <MenuItem
                  sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveTo();
                  }}
              >
                <ListItemIcon>
                  <MoveIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
                </ListItemIcon>
                <ListItemText>Move to...</ListItemText>
              </MenuItem>,

              <Divider sx={{my: 1}}/>,

              !isFolder && (
                  <MenuItem
                      sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload();
                      }}
                  >
                    <ListItemIcon>
                      <DownloadIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
                    </ListItemIcon>
                    <ListItemText>Download</ListItemText>
                  </MenuItem>
              ),

              isFolder && (
                  <MenuItem
                      sx={{borderRadius: '8px', mx: 0.5, my: 0.25}}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUploadTo();
                      }}
                  >
                    <ListItemIcon>
                      <UploadIcon fontSize="small" sx={{color: theme.palette.primary.main}}/>
                    </ListItemIcon>
                    <ListItemText>Upload to</ListItemText>
                  </MenuItem>
              )
            ]
        )}
      </Menu>
  );
};

export default FileContextMenu;
