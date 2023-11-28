import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ID } from "~/config/types/root_types";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { IconButton, ListItemIcon, ListItemText } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTrashCan } from "@fortawesome/pro-regular-svg-icons";
import { useReferenceActiveProjectContext } from "../reference_organizer/context/ReferenceActiveProjectContext";

interface Props {
  refId: ID;
  handleDelete: Function;
  handleMetadataAction: (event) => void;
  handleOpenPublicPage: (event) => void;
  hasPublicPage: boolean;
}

const ReferenceItemOptsDropdown = ({
  refId,
  handleDelete,
  handleMetadataAction,
  handleOpenPublicPage,
  hasPublicPage = false,
}: Props) => {
  const { activeProject } = useReferenceActiveProjectContext();

  const _handleDelete = (e) => {
    handleDelete(refId);
  };

  const handleIconButtonClick = (originalOnClick) => (e) => {
    e.stopPropagation();
    originalOnClick(e);
  };

  const canEdit =
    activeProject?.status === "full_access" ||
    activeProject?.current_user_is_admin;

  if (!canEdit) {
    return null;
  }

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
              onClick={(e) => {
                // For touch devices, we need to stop propagation so that the "row click action" event does not get triggered
                e.stopPropagation();
              }}
            >
              <MenuList sx={{ p: 0 }}>
                {hasPublicPage && (
                  <MenuItem
                    onClick={handleOpenPublicPage}
                    sx={{ columnGap: 0 }}
                  >
                    <ListItemIcon>
                      <img
                        src="/static/beaker-gray.svg"
                        width="24px"
                        height="24px"
                        alt="ResearchHub Icon"
                        style={{
                          transform: "translate(-1.5px, -1.5px)",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText>Open Public Page</ListItemText>
                  </MenuItem>
                )}
                <MenuItem onClick={handleMetadataAction} sx={{ columnGap: 0 }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faInfoCircle} fontSize={20} />
                  </ListItemIcon>
                  <ListItemText>Edit Metadata</ListItemText>
                </MenuItem>
                <MenuItem onClick={_handleDelete} sx={{ columnGap: 0 }}>
                  <ListItemIcon sx={{ transform: "translateX(1px)" }}>
                    <FontAwesomeIcon icon={faTrashCan} fontSize={20} />
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
