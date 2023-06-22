import {
  MouseEvent,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useState,
} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { MenuItemProps } from "@mui/material/MenuItem";

type DropdownMenuItemProps = {
  itemLabel: ReactNode;
  onClick: (event: SyntheticEvent) => void;
} & MenuItemProps;

type ComponentProps = {
  disabled?: boolean;
  menuItemProps: DropdownMenuItemProps[];
  menuLabel: ReactNode;
  size: "small" | "medium" | "large";
};

export default function DropdownMenu({
  disabled,
  menuItemProps,
  menuLabel,
  size,
}: ComponentProps): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = menuItemProps.map(
    (itemProps: DropdownMenuItemProps, index: number) => {
      const { itemLabel, onClick } = itemProps;

      return (
        <MenuItem
          key={`dropdown-menu-item-${itemLabel}-${index}`}
          onClick={(event: SyntheticEvent): void => {
            onClick(event);
            handleClose();
          }}
        >
          {itemLabel}
        </MenuItem>
      );
    }
  );

  return (
    <div>
      <Button
        aria-expanded={open ? "true" : undefined}
        autoCapitalize=""
        onClick={(event: MouseEvent<HTMLElement>): void => {
          if (disabled) {
            return;
          }
          setAnchorEl(event.currentTarget);
        }}
        size={size}
        sx={{
          background: "rgba(250, 250, 252, 1)",
          textTransform: " unset !important",
          padding: 0,
        }}
      >
        {menuLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {menuItems}
      </Menu>
    </div>
  );
}
