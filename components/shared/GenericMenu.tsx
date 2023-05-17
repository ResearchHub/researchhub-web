import { useState, MouseEvent, useRef } from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import { genClientId } from "~/config/utils/id";
import colors from "~/config/themes/colors";

interface MenuOption {
  label: string;
  value: string;
  html?: React.ReactElement;
  icon?: React.ReactElement;
  href?: string;
  onClick?: Function;
}

interface MenuProps {
  id?: string;
  width?: number;
  children: React.ReactElement;
  options: MenuOption[];
}

const Menu = ({
  children,
  options,
  width = 200,
  id = `menu-${genClientId()}`,
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleTriggerClick = (event: MouseEvent) => {
    setIsOpen(!isOpen);
  };

  useEffectHandleClick({
    el: menuRef.current,
    exclude: [`.${id}`],
    onOutsideClick: () => setIsOpen(false),
  });

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
          style={{ width }}
        >
          {options.map((option, index) => {
            const { label, icon, href, onClick, value, html } = option;

            const content = (
              <div
                key={`${id}-${index}`}
                className={css(styles.menuItem)}
                onClick={(event) => onClick && onClick(option, event)}
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
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  menuItem: {
    display: "flex",
    columnGap: "7px",
    padding: "7px 12px",
    alignItems: "center",
    marginBottom: "10px",
    cursor: "pointer",
    fontSize: 14,
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
  },
  menuItemIcon: {
    marginRight: "10px",
  },
  trigger: {
    cursor: "pointer",
  },
});

export default Menu;
