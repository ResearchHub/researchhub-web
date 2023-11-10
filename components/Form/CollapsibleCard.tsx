import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";
import colors, { genericCardColors } from "~/config/themes/colors";

export type Props = {
  title: string | React.ReactNode;
  children: React.ReactNode;
};

// The technical term is "accordion" but I'm calling it a collapsible card because it's more descriptive
const CollapsibleCard = ({ title, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={css(styles.container)}>
      <button className={css(styles.header)} onClick={toggle}>
        {title}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={css(styles.icon, isOpen && styles.iconOpen)}
        />
      </button>
      <div className={css(styles.content, isOpen ? styles.show : styles.hide)}>
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
    ":hover": {
      backgroundColor: colors.LIGHTER_GREY_BACKGROUND,
    },
  },
  content: {
    width: "100%",
    borderTop: `1px solid ${genericCardColors.BORDER}`,
    display: "none",
  },
  icon: {
    transform: "rotate(0deg)",
  },
  iconOpen: {
    transform: "rotate(180deg)",
  },
});

export default CollapsibleCard;
