import {
  AUTHOR_CLAIM_STATUS_LABEL,
  AUTHOR_CLAIM_STATUS,
} from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { ValueOf } from "../../config/types/root_types";
import AuthorClaimDashboardNavbarButton from "./AuthorClaimDashboardNavbarButton";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { getCaseCounts, Counts } from "./api/AuthorClaimCaseGetCounts";

type ButtonConfig = {
  label: ValueOf<typeof AUTHOR_CLAIM_STATUS_LABEL>;
  id: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
};
type NavButton = ReactElement<typeof AuthorClaimDashboardNavbarButton>;
type Props = {
  innerElWidth: number;
  lastFetchTime: number;
};

const buttonConfigs: Array<ButtonConfig> = [
  /* logical ordering */
  { label: AUTHOR_CLAIM_STATUS_LABEL.OPEN, id: AUTHOR_CLAIM_STATUS.OPEN },
  { label: AUTHOR_CLAIM_STATUS_LABEL.CLOSED, id: AUTHOR_CLAIM_STATUS.CLOSED },
];

const useEffectFetchCounts = (
  lastFetchTime,
  setCounts: (counts: Counts) => void
): void => {
  useEffect((): void => {
    getCaseCounts({ onSuccess: setCounts });
  }, [lastFetchTime, setCounts]);
};

export default function AuthorClaimDashboardNavbar({
  innerElWidth,
  lastFetchTime,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const [counts, setCounts] = useState<Counts>({
    CLOSED: 0,
    OPEN: 0,
  });
  const [activeButtonID, setActiveButtonID] = useState(
    router.query.case_status || AUTHOR_CLAIM_STATUS_LABEL.OPEN
  );

  useEffectFetchCounts(lastFetchTime, setCounts);

  const navButtons = useMemo(
    (): Array<NavButton> =>
      buttonConfigs.map(
        ({ label, id }: ButtonConfig): NavButton => (
          <AuthorClaimDashboardNavbarButton
            count={counts[id]}
            isActive={activeButtonID === id}
            key={id}
            label={label}
            onClick={(): void => {
              setActiveButtonID(id);
              router.push({
                pathname: router.pathname,
                query: { case_status: id },
              });
            }}
          />
        )
      ),
    [activeButtonID, counts, router]
  );

  return (
    <div className={css(styles.authorClaimDashboardNavbar)}>
      <div
        className={css(styles.innerElementWrap)}
        style={{ width: innerElWidth }}
      >
        <div className={css(styles.header)}>
          <span className={css(styles.headerText)}>
            {"Author Claim Requests"}
          </span>
        </div>
        <div className={css(styles.navRow)}>{navButtons}</div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  authorClaimDashboardNavbar: {
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    display: "flex",
    minHeight: 120,
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
  headerText: {
    marginTop: 24,
  },
  innerElementWrap: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: "90%",
  },
  navRow: {
    alignItems: "center",
    display: "flex",
    height: 60,
    width: "100%",
  },
});
