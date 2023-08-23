import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ID } from "~/config/types/root_types";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import { faTrashCan } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  refId: ID;
  handleDelete: Function;
}

const ReferenceItemOptsDropdown = ({ refId, handleDelete }: Props) => {
  const _handleDelete = (e) => {
    handleDelete(refId);
  };

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
            <IconButton
              onClick={handleIconButtonClick(originalOnClick)}
              sx={{
                padding: 1,
                fontSize: "24px",
                "&:hover": {
                  background: "rgba(25, 118, 210, 0.04) !important",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              {...bindMenu(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuList sx={{ p: 0 }}>
                <MenuItem onClick={_handleDelete} sx={{ columnGap: 0 }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faTrashCan} fontSize={18} />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        );
      }}
    </PopupState>
  );
};

export default ReferenceItemOptsDropdown;
