import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useMemo, useState } from "react";
import AuthorClaimDashboadNavbarButton from "./AuthorClaimDashboadNavbarButton";

type ButtonConfig = {
  label: string;
  id: string;
};
type NavButton = ReactElement<typeof AuthorClaimDashboadNavbarButton>;
type Props = {
  innerElWidth: number;
};

const buttonConfigs: Array<ButtonConfig> = [
  { label: "Open", id: "open" },
  { label: "Closed", id: "closed" },
];

export default function AuthorClaimDashbaordNavbar({
  innerElWidth,
}: Props): ReactElement<"div"> {
  const [activeButtonID, setActiveButtonID] = useState("open");
  const navButtons = useMemo(
    (): Array<NavButton> =>
      buttonConfigs.map(
        ({ label, id }: ButtonConfig): NavButton => (
          <AuthorClaimDashboadNavbarButton
            isActive={activeButtonID === id}
            key={id}
            label={label}
            onClick={(): void => {
              setActiveButtonID(id);
            }}
          />
        )
      ),
    [activeButtonID]
  );

  return (
    <div className={css(styles.authorClaimDashbaordNavbar)}>
      <div
        className={css(styles.innerElementWrap)}
        style={{ width: innerElWidth }}
      >
        <div className={css(styles.header)}>
          <span className={css(styles.headerText)}>
            {"Author-Claim Requests"}
          </span>
        </div>
        <div className={css(styles.navRow)}>{navButtons}</div>
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
