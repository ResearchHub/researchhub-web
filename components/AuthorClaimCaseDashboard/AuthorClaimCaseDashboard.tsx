import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useState } from "react";
import AuthorClaimCaseContainer from "./AuthorClaimCaseContainer";
import AuthorClaimDashboardNavbar from "./AuthorClaimDashboardNavbar";

export const INNER_EL_WIDTH = 1276;

export default function AuthorClaimCaseDashboard(): ReactElement<"div"> {
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  return (
    <div className={css(styles.authorClaimCaseDashboard)}>
      <AuthorClaimDashboardNavbar
        innerElWidth={INNER_EL_WIDTH}
        lastFetchTime={lastFetchTime}
      />
      <div className={css(styles.caseContinaerWrap)}>
        <AuthorClaimCaseContainer
          lastFetchTime={lastFetchTime}
          setLastFetchTime={setLastFetchTime}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimCaseDashboard: {
    alignItems: "center",
    backgroundColor: "#FBFBFD",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    width: "100%",
  },
  caseContinaerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
    width: "100%",
  },
});
