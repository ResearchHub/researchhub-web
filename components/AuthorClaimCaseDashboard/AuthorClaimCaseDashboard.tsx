import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import AuthorClaimCaseContainer from "./AuthorClaimCaseContainer";
import AuthorClaimDashboardNavbar from "./AuthorClaimDashboardNavbar";
import Head from "../Head";

export default function AuthorClaimCaseDashboard(): ReactElement<"div"> {
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  return (
    <div className={css(styles.authorClaimCaseDashboard)}>
      <AuthorClaimDashboardNavbar lastFetchTime={lastFetchTime} />
      <Head />
      <div className={css(styles.caseContainerWrap)}>
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
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    padding: "0 32px",
    width: "100%",
  },
  caseContainerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
  },
});
