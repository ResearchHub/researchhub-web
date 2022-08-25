import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import Link from "next/link";
import { RHLogo } from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";

type Props = {};

export default function RootLeftSidebar({}: Props): ReactElement {
  return (
    <div className={css(styles.rootLeftSidebar)}>
      <Link href={"/"} as={`/`}>
        <a className={css(styles.logoContainer, styles.logoContainerForMenu)}>
          <RHLogo iconStyle={styles.logo} white={false} />
        </a>
      </Link>
    </div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebar: {
    width: 315,
  },
  logo: {

  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 176,
    paddingBottom: 2.7,
    cursor: "pointer",
    userSelect: "none",
    marginTop: 2,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: 148,
    },
  },
});
