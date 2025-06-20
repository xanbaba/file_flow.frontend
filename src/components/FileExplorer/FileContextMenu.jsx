import React, { useEffect, useRef, useState } from 'react';
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
import ConfirmationPopup from '../ConfirmationPopup/ConfirmationPopup';

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
                           isTrash = false,
                           itemName = ''
                         }) => {
  const theme = useTheme();
  const menuRef = useRef(null);
  const [trashConfirmOpen, setTrashConfirmOpen] = useState(false);

  // Use effect to stop propagation of all events from the menu
  useEffect(() => {
    const menuElement = menuRef.current;

    // Function to stop event propagation
    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    if (menuElement && open) {
      // Add event listeners to stop propagation
      menuElement.addEventListener('click', stopPropagation, true);
      menuElement.addEventListener('mousedown', stopPropagation, true);
      menuElement.addEventListener('mouseup', stopPropagation, true);
      menuElement.addEventListener('dblclick', stopPropagation, true);
    }

    // Cleanup function
    return () => {
      if (menuElement) {
        menuElement.removeEventListener('click', stopPropagation, true);
        menuElement.removeEventListener('mousedown', stopPropagation, true);
        menuElement.removeEventListener('mouseup', stopPropagation, true);
        menuElement.removeEventListener('dblclick', stopPropagation, true);
      }
    };
  }, [open]);

  // Handler to prevent click propagation when closing the menu
  const handleClose = (event) => {
    // If event exists (i.e., this is a real click event, not a programmatic close)
    if (event) {
      event.stopPropagation();
    }
    onClose();
  };

  return (
      <>
        <Menu
            ref={menuRef}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                  mt: 1.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  minWidth: 180,
                },
                // Add onClick handler to stop propagation at the paper level
                onClick: (e) => e.stopPropagation()
              }
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
                      setTrashConfirmOpen(true);
                    }}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" sx={{color: theme.palette.error.main}}/>
                  </ListItemIcon>
                  <ListItemText>{'Move to Trash'}</ListItemText>
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

        {/* Confirmation Popup for Move to Trash */}
        <ConfirmationPopup
          open={trashConfirmOpen}
          onClose={() => setTrashConfirmOpen(false)}
          onConfirm={onMoveToTrash}
          title={`Move ${itemName} to Trash`}
          message={`Are you sure you want to move ${itemName ? `"${itemName}"` : `this ${isFolder ? 'folder' : 'file'}`} to trash?`}
          confirmButtonText="Move to Trash"
          severity="warning"
        />
      </>
  );
};

export default FileContextMenu;
