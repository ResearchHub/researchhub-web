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
  const router = useRouter();
  const { currentOrg } = getCurrentUserCurrentOrg();
  const { resetProjectsFetchTime } = useReferenceProjectUpsertContext();
  const { activeProject } = useReferenceActiveProjectContext();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setShouldShowOptions(false);
  };
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    handleMenuClose();
  };

  return (
    <Fragment>
      <QuickModal
        isOpen={isDeleteModalOpen}
        modalContent={
          <Box sx={{ marginBottom: "16px", height: "120px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "38px",
              }}
            >
              <Typography id="modal-modal-title" variant="subtitle2">
                {`Are you sure you want to remove this project?`}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{projectName}</Typography>
            </Box>
          </Box>
        }
        modalWidth="300px"
        onPrimaryButtonClick={(): void => {
          removeReferenceProject({
            projectID,
            onSuccess: () => {
              resetProjectsFetchTime();
              handleDeleteModalClose();
              if (projectID === activeProject.projectID) {
                router.push(`/reference-manager/${currentOrg?.slug ?? ""}`);
              }
            },
            onError: emptyFncWithMsg,
          });
        }}
        onSecondaryButtonClick={handleDeleteModalClose}
        onClose={handleDeleteModalClose}
        primaryButtonConfig={{ label: "Delete" }}
      />
      <span
        onClick={handleMenuClick}
        style={{ alignItems: "center", display: "flex", height: "100%" }}
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
        <MenuItem
          key="add-ref"
          onClick={(event: MouseEvent): void => {
            event.preventDefault();
            onSelectAddNewReference(event);
            handleMenuClose();
          }}
        >
          {"Add a reference"}
        </MenuItem>
        <MenuItem
          key="add-sub-proj"
          onClick={(event: MouseEvent): void => {
            event.preventDefault();
            onSelectCreateSubProject(event);
            handleMenuClose();
          }}
        >
          {"Add a folder"}
        </MenuItem>
        <MenuItem
          key="edit"
          onClick={(event: MouseEvent): void => {
            event.preventDefault();
            onSelectEditProject(event);
            handleMenuClose();
          }}
        >
          {"Edit"}
        </MenuItem>
        {isCurrentUserAdmin && (
          <MenuItem
            key="remove"
            onClick={(event: MouseEvent): void => {
              event.preventDefault();
              setIsDeleteModalOpen(true);
            }}
          >
            <Typography color="red">{"Remove"}</Typography>
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  );
}
