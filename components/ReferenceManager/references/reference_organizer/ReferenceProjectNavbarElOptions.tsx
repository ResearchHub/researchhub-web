import {
  Fragment,
  ReactElement,
  SyntheticEvent,
  useState,
  MouseEvent,
} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type Props = {
  onSelectAddNewReference: (event: SyntheticEvent) => void;
  onSelectCreateSubProject: (event: SyntheticEvent) => void;
};

export default function ReferenceProjectNavbarElOption({
  onSelectAddNewReference,
  onSelectCreateSubProject,
}: Props): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <span
        onClick={handleClick}
        style={{ alignItems: "center", display: "flex", height: "100%" }}
      >
        <MoreVertIcon fontSize="small" />
      </span>
      <Menu
        id="ref-project-nav-el-option-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(event: MouseEvent): void => {
            onSelectAddNewReference(event);
            handleClose();
          }}
        >
          {"Add a reference"}
        </MenuItem>
        <MenuItem
          onClick={(event: MouseEvent): void => {
            onSelectCreateSubProject(event);
            handleClose;
          }}
        >
          {"Add a sub-project"}
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
