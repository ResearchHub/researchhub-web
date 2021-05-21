import {
  AUTHOR_CLAIM_STATUS_LABEL,
  AUTHOR_CLAIM_STATUS,
} from "./constants/AuthorClaimStatus";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { ValueOf } from "../../config/types/root_types";
import AuthorClaimDashboardNavbarButton from "./AuthorClaimDashboardNavbarButton";
import React, { ReactElement, useMemo, useState } from "react";

type ButtonConfig = {
  label: ValueOf<typeof AUTHOR_CLAIM_STATUS_LABEL>;
  id: ValueOf<typeof AUTHOR_CLAIM_STATUS>;
};
type NavButton = ReactElement<typeof AuthorClaimDashboardNavbarButton>;
type Props = {
  innerElWidth: number;
};

const buttonConfigs: Array<ButtonConfig> = [
  /* logical ordering */
  { label: AUTHOR_CLAIM_STATUS_LABEL.OPEN, id: AUTHOR_CLAIM_STATUS.OPEN },
  { label: AUTHOR_CLAIM_STATUS_LABEL.CLOSED, id: AUTHOR_CLAIM_STATUS.CLOSED },
];

export default function AuthorClaimDashboardNavbar({
  innerElWidth,
}: Props): ReactElement<"div"> {
  const router = useRouter();
  const [activeButtonID, setActiveButtonID] = useState(
    router.query.case_status || AUTHOR_CLAIM_STATUS_LABEL.OPEN
  );

  const navButtons = useMemo(
    (): Array<NavButton> =>
      buttonConfigs.map(
        ({ label, id }: ButtonConfig): NavButton => (
          <AuthorClaimDashboardNavbarButton
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
    [activeButtonID, router]
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
  headerText: {
    marginTop: 24,
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
    height: 60,
    width: "100%",
  },
});
