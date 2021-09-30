import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import colors from "../../config/themes/colors";
import Link from "next/link";

type Props = {
  isActive: boolean;
  label: string;
  id: string;
  href: string;
};

function UnifiedDocFeedFilterButton({
  isActive,
  label,
  id,
  href
}: Props): ReactElement<"div"> {
  return (
    <Link className={css(styles.container)} href={href} key={id}>
      <a
        className={css(
          styles.unifiedDocFeedFilterButton,
          isActive && styles.isButtonActive
        )}
      >{label}</a>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  unifiedDocFeedFilterButton: {
    alignItems: "center",
    boxSizing: "border-box",
    color: "#241F3A",
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    height: 44,
    justifyContent: "center",
    padding: "4px 0",
    // marginRight: 24,
    borderBottom: "2px solid transparent",
    textDecoration: "none",
    ":hover": {
      borderBottom: `2px solid ${colors.LIGHT_GREY_BORDER}`,  
      transition: "0.25s"
    }
  },
  isButtonActive: {
    borderBottom: `2px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
    ":hover": {
      borderBottom: "2px solid",
    }
  },
});

export default UnifiedDocFeedFilterButton;
