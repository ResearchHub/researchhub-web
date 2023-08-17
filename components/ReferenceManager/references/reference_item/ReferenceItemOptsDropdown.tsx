import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ID } from '~/config/types/root_types';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { IconButton, ListItemIcon, ListItemText } from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import MenuList from '@mui/material/MenuList';

interface Props {
  refId: ID;
  onDelete: Function;
  onExport: Function;
}

const ReferenceItemOptsDropdown = ({ refId, onDelete, onExport }: Props) => {
  

  const handleDelete = (e) => {
    onDelete();
  }
  const handleExport = (e) => {
    onExport();
  }  

  const handleIconButtonClick = (originalOnClick) => (e) => {
    e.stopPropagation();
    originalOnClick(e); 
  };

  return (
    <PopupState variant="popover" popupId={`dropdown-for-${refId}`}>
      {(popupState) => {
        const originalOnClick = bindTrigger(popupState).onClick;
        return (
          <>
            <IconButton onClick={handleIconButtonClick(originalOnClick)} sx={{
              padding: 1,
              fontSize: "24px",
              '&:hover': {
                background: "rgba(25, 118, 210, 0.04) !important",
              }
            }}>
              <MoreVertIcon />
            </IconButton>

            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuList>
              <MenuItem onClick={handleExport}>
                <ListItemIcon >
                  <IosShareIcon sx={{ fontSize: "18px" }} />
                </ListItemIcon>
                <ListItemText>Export</ListItemText>
              </MenuItem>            
              <MenuItem onClick={handleDelete} sx={{ columnGap: 0 }}>
                <ListItemIcon>
                    <DeleteForeverOutlinedIcon sx={{ fontSize: "18px" }} />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
              </MenuList>
            </Menu>
          </>

        )
      }}
    </PopupState>
  )
}

export default ReferenceItemOptsDropdown;