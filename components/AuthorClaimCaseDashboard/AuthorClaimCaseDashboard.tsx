import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import AuthorClaimCaseContainer from "./AuthorClaimCaseContainer";
import AuthorClaimDashbaordNavbar from "./AuthorClaimDashboadNavbar";

export const INNER_EL_WIDTH = 1276;

export default function AuthorClaimCaseDashboard(): ReactElement<"div"> {
  return (
    <div className={css(styles.authorClaimCaseDashboard)}>
      <AuthorClaimDashbaordNavbar innerElWidth={INNER_EL_WIDTH} />
      <div className={css(styles.caseContinaerWrap)}>
        <AuthorClaimCaseContainer />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimCaseDashboard: {
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
  },
  caseContinaerWrap: {
    marginTop: 16,
  },
});
