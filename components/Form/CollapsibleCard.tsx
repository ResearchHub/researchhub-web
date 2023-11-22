import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";
import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

export type Props = {
  title: string | React.ReactNode;
  children: string | React.ReactNode;
  variant?: "default" | "noBorder";

  // can optionally handle toggle state in parent component
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

// The technical term is "accordion" but I'm calling it a collapsible card because it's more descriptive
const CollapsibleCard = ({
  title,
  children,
  variant = "default",
  isOpen: parentIsOpen,
  setIsOpen: parentSetIsOpen,
}: Props) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // only handle state in parent if both isOpen and setIsOpen are passed in
  const isOpen =
    parentIsOpen !== undefined && parentSetIsOpen !== undefined
      ? parentIsOpen
      : internalIsOpen;
  const setIsOpen =
    parentIsOpen !== undefined && parentSetIsOpen !== undefined
      ? parentSetIsOpen
      : setInternalIsOpen;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={css(
        styles.container,
        variant === "noBorder" && styles.containerNoBorder
      )}
    >
      <button
        className={css(
          styles.header,
          variant === "noBorder" && styles.headerNoBorder,
          variant === "noBorder" && isOpen && styles.headerNoBorderActive
        )}
        onClick={toggle}
      >
        {title}
        <FontAwesomeIcon
          icon={faChevronDown}
          color={
            variant === "default"
              ? colors.BLACK()
              : isOpen
              ? colors.NEW_BLUE()
              : colors.BLACK()
          }
          fontSize={14}
          className={css(styles.icon, isOpen && styles.iconOpen)}
        />
      </button>
      <div
        className={css(
          styles.content,
          variant === "noBorder" && styles.contentNoBorder,
          isOpen ? styles.show : styles.hide
        )}
      >
        {children}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  hide: {
    display: "none",
  },
  show: {
    display: "block",
  },

  container: {
    width: "100%",
    border: `1px solid ${genericCardColors.BORDER}`,
    borderRadius: 4,
  },
  containerNoBorder: {
    width: "100%",
    border: "none",
  },

  header: {
    width: "100%",
    backgroundColor: genericCardColors.BACKGROUND,
    border: "none",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    textAlign: "left",
    ":hover": {
      backgroundColor: colors.LIGHTER_GREY_BACKGROUND,
    },

    // default title styling
    color: colors.BLACK(),
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      fontSize: 16,
    },
  },
  headerNoBorder: {
    backgroundColor: "transparent",
    padding: "24px 0",
    ":hover": {
      backgroundColor: "transparent",
      opacity: 0.8,
    },
  },
  headerNoBorderActive: {
    color: colors.NEW_BLUE(),
  },

  content: {
    width: "100%",
    borderTop: `1px solid ${genericCardColors.BORDER}`,
    display: "none",
  },
  contentNoBorder: {
    borderTop: "none",
  },
  icon: {
    transform: "rotate(0deg)",
  },
  iconOpen: {
    transform: "rotate(180deg)",
  },
});

export default CollapsibleCard;
