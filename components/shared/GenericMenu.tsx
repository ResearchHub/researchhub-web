import { useState, MouseEvent, useRef } from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import { genClientId } from "~/config/utils/id";
import colors from "~/config/themes/colors";

export interface MenuOption {
  label?: string;
  value: any;
  html?: React.ReactElement;
  icon?: React.ReactElement;
  href?: string;
  preventDefault?: boolean;
}

interface MenuProps {
  id?: string;
  width?: number;
  onSelect?: Function;
  children: React.ReactElement;
  options: MenuOption[];
  triggerHeight?: number;
  direction?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "top-center";
}

const Menu = ({
  children,
  options,
  width = 200,
  triggerHeight = 45,
  onSelect,
  direction = "bottom-left",
  id = `menu-${genClientId()}`,
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSelect = (option: MenuOption) => {
    setIsOpen(!isOpen);
    onSelect && onSelect(option);
  };

  useEffectHandleClick({
    el: menuRef.current,
    exclude: [`.trigger-for-${id}`],
    onOutsideClick: () => {
      setIsOpen(false)
    },
  });

  const directionStyles = {
    ...(direction === "bottom-left" && { top: triggerHeight, right: 0 }),
    ...(direction === "top-center" && { transform: "translateX(-25%)", bottom: triggerHeight }),
  }

  return (
    <div className={css(styles.genericMenuWrapper)}>
      <div
        className={css(styles.trigger) + ` trigger-for-${id}`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {children}
      </div>
      {isOpen && (
        <div
          className={css(styles.menu) + ` ${id}`}
          ref={menuRef}
          style={{ width, ...directionStyles }}
        >
          {options.map((option, index) => {
            const { label, icon, href, value, html, preventDefault } = option;

            const content = (
              <div
                key={`${id}-${index}`}
                className={css(styles.menuItem)}
                onClick={(e) => {
                  preventDefault && e.preventDefault();
                  handleSelect(option)
                }}
              >
                {icon && <div className={css(styles.menuItemIcon)}>{icon}</div>}
                {html ? html : label}
              </div>
            );

            if (href) {
              return (
                <Link href={href} key={value}>
                  {content}
                </Link>
              );
            } else {
              return content;
            }
          })}
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  genericMenuWrapper: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "#fff",
    border: "1px solid rgb(222 222 222)",
    borderRadius: "4px",
    padding: "8px",
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  menuItem: {
    display: "flex",
    padding: "8px 12px",
    alignItems: "center",
    marginBottom: "10px",
    cursor: "pointer",
    boxSizing: "border-box",
    fontSize: 14,
    color: colors.BLACK_TEXT(),
    borderRadius: 4,
    fontWeight: 400,
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
    ":last-child": {
      marginBottom: 0,
    }
  },
  menuItemIcon: {
    width: 30,
    boxSizing: "border-box",
    color: colors.BLACK_TEXT(),
  },
  trigger: {
    cursor: "pointer",
  },
});

export default Menu;
