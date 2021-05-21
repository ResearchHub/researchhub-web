import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import colors from "../../config/themes/colors";

type Props = {
  innerElWidth: number;
};

export default function AuthorClaimDashbaordNavbar({
  innerElWidth,
}: Props): ReactElement<"div"> {
  return (
    <div className={css(styles.authorClaimDashbaordNavbar)}>
      <div
        className={css(styles.innerElementWrap)}
        style={{ width: innerElWidth }}
      >
        <div className={css(styles.header)}>Author-Claim Requests</div>
        <div className={css(styles.navRow)}>Buttons go Here</div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimDashbaordNavbar: {
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    display: "flex",
    height: 172,
    justifyContent: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    display: "flex",
    fontFamily: "Roboto",
    fontSize: "30px",
    fontWeight: 500,
    height: "100%",
  },
  innerElementWrap: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  navRow: {
    alignItems: "center",
    display: "flex",
    height: 88,
    width: "100%",
  },
});
