import {
  Fragment,
  ReactElement,
  SyntheticEvent,
  useState,
  MouseEvent,
} from "react";
import { ID } from "~/config/types/root_types";
import { Box, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QuickModal from "../../menu/QuickModal";
import { removeReferenceProject } from "./api/removeReferenceProject";
import { useRouter } from "next/router";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { useReferenceProjectUpsertContext } from "./context/ReferenceProjectsUpsertContext";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { useReferenceActiveProjectContext } from "./context/ReferenceActiveProjectContext";

type Props = {
  isCurrentUserAdmin: boolean;
  onSelectAddNewReference: (event: SyntheticEvent) => void;
  onSelectCreateSubProject: (event: SyntheticEvent) => void;
  onSelectEditProject: (event: SyntheticEvent) => void;
  projectID: ID;
  projectName: string;
  setShouldShowOptions: (flag: boolean) => void;
};

export default function ReferenceProjectNavbarElOption({
  isCurrentUserAdmin,
  onSelectAddNewReference,
  onSelectCreateSubProject,
  onSelectEditProject,
  projectID,
  projectName,
  setShouldShowOptions,
}: Props): ReactElement {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setShouldShowOptions(false);
  };

  return (
    <Fragment>
      <span
        onClick={handleMenuClick}
        style={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          marginLeft: "auto",
        }}
      >
        <MoreVertIcon fontSize="small" />
      </span>
      <Menu
        autoFocus={false}
        id="ref-project-nav-el-option-menu"
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {isCurrentUserAdmin && (
          <MenuItem
            key="remove"
            onClick={(event: MouseEvent): void => {
              event.preventDefault();
              setIsDeleteModalOpen(true);
            }}
          >
            <Typography color="red">{"Delete Folder"}</Typography>
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  );
}
