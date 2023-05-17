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

type Props = {
  onSelectAddNewReference: (event: SyntheticEvent) => void;
  onSelectCreateSubProject: (event: SyntheticEvent) => void;
  onSelectEditProject: (event: SyntheticEvent) => void;
  projectID: ID;
  projectName: string;
};

export default function ReferenceProjectNavbarElOption({
  onSelectAddNewReference,
  onSelectCreateSubProject,
  onSelectEditProject,
  projectID,
  projectName,
}: Props): ReactElement {
  const router = useRouter();
  const { resetProjectsFetchTime } = useReferenceProjectUpsertContext();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
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
                {`Are you sure you want to remove project?`}
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
              setIsDeleteModalOpen(false);
              resetProjectsFetchTime();
              router.push("/reference-manager");
            },
            onError: emptyFncWithMsg,
          });
        }}
        onSecondaryButtonClick={(): void => {
          setIsDeleteModalOpen(false);
        }}
        onClose={(): void => {
          setIsDeleteModalOpen(false);
        }}
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
          {"Add a sub-project"}
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
        <MenuItem
          key="remove"
          onClick={(event: MouseEvent): void => {
            event.preventDefault();
            setIsDeleteModalOpen(true);
            handleMenuClose();
          }}
        >
          <Typography color="red">{"Remove"}</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
