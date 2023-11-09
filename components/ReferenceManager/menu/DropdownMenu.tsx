import React, { MouseEvent, ReactElement, ReactNode, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { MenuItemProps } from "@mui/material/MenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import colors from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";

type DropdownMenuItemProps = {
  itemLabel: ReactNode;
  onClick?: (event: MouseEvent) => void;
  subMenuItems?: DropdownMenuItemProps[];
} & Omit<MenuItemProps, "onClick">;

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
  const [mainAnchorEl, setMainAnchorEl] = useState<null | HTMLElement>(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSubMenu, setCurrentSubMenu] = useState<null | ReactNode>(null);

  const handleClose = () => {
    setMainAnchorEl(null);
    setSubMenuAnchorEl(null);
    setCurrentSubMenu(null);
  };

  const handleSubmenuOpen = (
    event: MouseEvent<HTMLElement>,
    itemLabel: ReactNode,
    closeIfAlreadyOpen = false
  ) => {
    // Prevent the main menu from closing when opening a submenu
    event.preventDefault();
    const currentlyOpen = currentSubMenu === itemLabel;

    if (closeIfAlreadyOpen && currentlyOpen) {
      handleSubmenuClose();
      return;
    }
    setSubMenuAnchorEl(event.currentTarget);
    setCurrentSubMenu(itemLabel);
  };

  const handleSubmenuClose = () => {
    setSubMenuAnchorEl(null);
    setCurrentSubMenu(null);
  };

  const renderMenuItem = (item: DropdownMenuItemProps, index: number) => {
    const isSubMenu = Boolean(item.subMenuItems?.length);
    const isOpen = currentSubMenu === item.itemLabel;

    return (
      <MenuItem
        key={`dropdown-menu-item-${item.itemLabel}-${index}`}
        onClick={(event: MouseEvent) => {
          if (!isSubMenu && item.onClick) {
            item.onClick(event);
          }

          if (isSubMenu) {
            handleSubmenuOpen(event, item.itemLabel, true);
          } else {
            handleClose();
          }
        }}
        onMouseEnter={(event: MouseEvent) => {
          if (isSubMenu) {
            handleSubmenuOpen(event, item.itemLabel);
          }
        }}
        selected={isOpen}
        sx={{
          // make selected color the same as hover color
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {item.itemLabel}
        {isSubMenu && (
          <div className={css(styles.rightArrow)}>
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ color: colors.BLACK() }}
            />
          </div>
        )}
        {/* Render submenu if it exists */}
        {isSubMenu && (
          <Menu
            anchorEl={subMenuAnchorEl}
            open={isOpen}
            onClose={handleSubmenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              onMouseLeave: handleSubmenuClose, // Close submenu on mouse leave
            }}
          >
            {item.subMenuItems?.map(renderMenuItem)}
          </Menu>
        )}
      </MenuItem>
    );
  };

  return (
    <div>
      <Button
        aria-expanded={mainAnchorEl ? "true" : undefined}
        autoCapitalize=""
        onClick={(event: MouseEvent<HTMLElement>): void => {
          if (disabled) {
            return;
          }
          setMainAnchorEl(event.currentTarget);
          setSubMenuAnchorEl(null);
          setCurrentSubMenu(null);
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
        anchorEl={mainAnchorEl}
        open={Boolean(mainAnchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {menuItemProps.map(renderMenuItem)}
      </Menu>
    </div>
  );
}

const styles = StyleSheet.create({
  rightArrow: {
    paddingLeft: 16,
    fontSize: 12,
    transform: "translateY(1px)",
  },
});
