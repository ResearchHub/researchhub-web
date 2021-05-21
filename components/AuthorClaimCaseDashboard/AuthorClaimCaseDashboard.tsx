import { css, StyleSheet } from "aphrodite";
import React, { ReactElement } from "react";
import AuthorClaimCaseContainer from "./AuthorClaimCaseContainer";
import AuthorClaimDashbaordNavbar from "./AuthorClaimDashboadNavbar";

export default function AuthorClaimCaseDashboard(): ReactElement<"div"> {
  return (
    <div className={css(styles.AuthorClaimCaseContainer)}>
      <AuthorClaimDashbaordNavbar />
      <div className={css(styles.CaseContinaerWrap)}>
        <AuthorClaimCaseContainer />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  AuthorClaimCaseContainer: {
    alignItems: "center",
    backgroundColor: "F2F2F2",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  CaseContinaerWrap: {
    marginTop: 16,
  },
});
