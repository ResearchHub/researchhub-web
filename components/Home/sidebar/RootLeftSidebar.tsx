import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import Link from "next/link";
import { RHLogo } from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import colors from "~/config/themes/colors";
import { NAVBAR_HEIGHT } from "~/components/Navbar";

type Props = {};

export default function RootLeftSidebar({}: Props): ReactElement {
  return (
    <div className={css(styles.rootLeftSidebar)}>
      <div className={css(styles.rootLeftSidebarStickyWrap)}>
        <Link href={"/"} as={`/`}>
          <div className={css(styles.logoContainer)}>
            <RHLogo iconStyle={styles.logo} white={false} />
          </div>
        </Link>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebar: {
    background: colors.GREY_ICY_BLUE_HUE,
    position: "relative",
    width: 315,
  },
  rootLeftSidebarStickyWrap: {
    position: "sticky",
    top: 0,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: NAVBAR_HEIGHT,
    justifyContent: "center",
    paddingBottom: 2.7,
    userSelect: "none",
    width: "100%",
  },
  logo: {
    height: 36,
    userSelect: "none",
  },
});
