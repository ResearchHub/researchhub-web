import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-regular-svg-icons";

export interface MenuOption {
  value: any;
  label?: string;
  group?: string;
  html?: React.ReactElement;
  icon?: React.ReactElement;
  href?: string;
  onClick?: Function;
  softHide?: boolean;
  preventDefault?: boolean;
  disableHover?: boolean;
  disableStyle?: boolean;
}

interface MenuProps {
  id: string;
  options: MenuOption[];
  children?: React.ReactElement;
  width?: number | string;
  onSelect?: Function;
  triggerHeight?: number;
  softHide?: boolean;
  selected?: any;
  closeMenuOnSelect?: boolean;
  isMultiSelect?: boolean;
  menuStyleOverride?: any;
  direction?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "top-center";
}

const Menu = ({
  id,
  children,
  options,
  width = 200,
  triggerHeight = 45,
  onSelect,
  direction = "bottom-left",
  softHide = false,
  selected,
  closeMenuOnSelect = true,
  isMultiSelect = false,
  menuStyleOverride,
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSelect = (option: MenuOption) => {
    if (closeMenuOnSelect) {
      setIsOpen(!isOpen);
    }
    onSelect && onSelect(option);
    option.onClick && option.onClick(option);
  };

  useEffectHandleClick({
    ref: menuRef,
    exclude: [`.trigger-for-${id}`],
    onOutsideClick: () => {
      setIsOpen(false);
    },
    onInsideClick: () => {
      if (closeMenuOnSelect) {
        setIsOpen(false);
      }
    },
  });

  const directionStyles = {
    ...(direction === "bottom-left" && {
      top: triggerHeight,
      right: 0,
      left: 0,
    }),
    ...(direction === "bottom-right" && {
      top: triggerHeight,
      right: 0,
      left: "unset",
    }),
    ...(direction === "top-center" && {
      transform: "translateX(-25%)",
      bottom: triggerHeight,
    }),
  };

  let currentOptionGroup: string | undefined = undefined;
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
      {(isOpen || softHide) && (
        <div
          className={
            css(
              styles.menu,
              softHide && isOpen && styles.softHideOpen,
              softHide && !isOpen && styles.softHideClosed,
              menuStyleOverride
            ) + ` ${id}`
          }
          ref={menuRef}
          style={{ width, ...directionStyles }}
        >
          {options.map((option, index) => {
            const {
              label,
              icon,
              href,
              value,
              html,
              preventDefault,
              disableHover,
              disableStyle,
            } = option;

            const content = (
              <div key={`${id}-${index}`}>
                {option.group !== currentOptionGroup && (
                  <div className={css(styles.groupHeader)}>{option.group}</div>
                )}
                <div
                  className={css(
                    disableStyle !== false && styles.menuItem,
                    disableHover !== false && styles.menuItemHover
                  )}
                  onClick={
                    preventDefault ? undefined : () => handleSelect(option)
                  }
                >
                  {icon && !html && (
                    <div className={css(styles.menuItemIcon)}>{icon}</div>
                  )}
                  {html ? (
                    html
                  ) : (
                    <>
                      {isMultiSelect ? (
                        selected.includes(value)
                      ) : selected === value ? (
                        <div className={css(styles.selected)}>
                          {label}
                          <FontAwesomeIcon icon={faCheck} />
                        </div>
                      ) : (
                        <>{label}</>
                      )}
                    </>
                  )}
                </div>
              </div>
            );

            currentOptionGroup = option.group;
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
    userSelect: "none",
  },
  menu: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "#fff",
    border: "1px solid rgb(222 222 222)",
    borderRadius: "4px",
    padding: "8px",
    boxShadow: "rgba(129, 148, 167, 0.2) 0px 3px 10px 0px",
  },
  menuItem: {
    display: "flex",
    padding: "8px 12px",
    alignItems: "center",
    lineHeight: "19px",
    cursor: "pointer",
    boxSizing: "border-box",
    fontSize: 14,
    color: colors.BLACK_TEXT(),
    borderRadius: 4,
    fontWeight: 400,
    width: "100%",
    ":last-child": {
      marginBottom: 0,
    },
  },
  selected: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupHeader: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 10,
    borderTop: `2px solid ${colors.LIGHT_GREY(1.0)}`,
    color: colors.MEDIUM_GREY(1.0),
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "1.2px",
    ":first-child": {
      borderTop: "none",
      paddingTop: 0,
      marginTop: 10,
    },
  },
  menuItemHover: {
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
  },
  softHideClosed: {
    visibility: "hidden",
  },
  softHideOpen: {
    visibility: "visible",
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
