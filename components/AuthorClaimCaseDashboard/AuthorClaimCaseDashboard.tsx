import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import AuthorClaimCaseContainer from "./AuthorClaimCaseContainer";
import AuthorClaimDashboardNavbar from "./AuthorClaimDashboardNavbar";
import Head from "../Head";
import { formColors } from "~/config/themes/colors";

export const INNER_EL_WIDTH = 1276;

export default function AuthorClaimCaseDashboard(): ReactElement<"div"> {
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  return (
    <div className={css(styles.authorClaimCaseDashboard)}>
      <AuthorClaimDashboardNavbar lastFetchTime={lastFetchTime} />
      <Head />
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
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "auto",
    paddingLeft: 32,
    width: "100%",
  },
  caseContinaerWrap: {
    boxSizing: "border-box",
    marginTop: 16,
    width: "100%",
  },
});
