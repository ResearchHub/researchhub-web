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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import QuickModal from "../../menu/QuickModal";
import { removeReferenceProject } from "./api/removeReferenceProject";
import { useRouter } from "next/router";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { useReferenceProjectUpsertContext } from "./context/ReferenceProjectsUpsertContext";
import { getCurrentUserCurrentOrg } from "~/components/contexts/OrganizationContext";
import { useReferenceActiveProjectContext } from "./context/ReferenceActiveProjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderPlus,
  faPlus,
  faTrash,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

type Props = {
  isCurrentUserAdmin: boolean;
  onSelectAddNewReference: (event: SyntheticEvent) => void;
  onSelectCreateSubProject: (event: SyntheticEvent) => void;
  onSelectEditProject: (event: SyntheticEvent) => void;
  projectID: ID;
  projectName: string;
  setShouldShowOptions: (flag: boolean) => void;
  createFolder: () => void;
};

export default function ReferenceProjectNavbarElOption({
  setShouldShowOptions,
  createFolder,
  projectName,
  projectID,
}: Props): ReactElement {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { setIsDeleteModalOpen, setDeleteProject } =
    useReferenceProjectUpsertContext();
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
        <MoreHorizIcon fontSize="small" />
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
        <MenuItem
          key="create"
          onClick={(event: MouseEvent): void => {
            handleMenuClose();
            createFolder();
          }}
        >
          <FontAwesomeIcon icon={faPlus} className={css(styles.folderIcon)} />
          <Typography>{"Create Folder"}</Typography>
        </MenuItem>
        <MenuItem
          key="remove"
          onClick={(event: MouseEvent): void => {
            handleMenuClose();
            setDeleteProject({
              projectName,
              id: projectID,
            });
            setIsDeleteModalOpen(true);
          }}
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
            className={css(styles.folderIcon)}
          />
          <Typography>{"Delete Folder"}</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  folderIcon: {
    marginRight: 8,
  },
});
