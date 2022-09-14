import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { ReactElement, SyntheticEvent } from "react";
import icons, { RHLogo } from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import Link from "next/link";
import RootLeftSidebarItem, {
  Props as RootLeftSidebarItemProps,
} from "./sidebar_items/RootLeftSidebarItem";

type Props = {};

const LeftSidebarItemAttrs: RootLeftSidebarItemProps[] = [
  {
    icon: icons.home,
    label: "Home",
    onClick: (event: SyntheticEvent): void => {
      event.preventDefault();
    },
  },
  {
    icon: icons.squares,
    label: "Hubs",
    onClick: (event: SyntheticEvent): void => {
      event.preventDefault();
    },
  },
  {
    icon: icons.book,
    label: "Notebook",
    onClick: (event: SyntheticEvent): void => {
      event.preventDefault();
    },
  },
  {
    icon: icons.coins,
    label: "Research Coin",
    onClick: (event: SyntheticEvent): void => {
      event.preventDefault();
    },
  },
  {
    icon: icons.users,
    label: "Community",
    onClick: (event: SyntheticEvent): void => {
      event.preventDefault();
    },
  },
  {
    icon: icons.chartSimple,
    label: "Leaderboard",
    onClick: (event: SyntheticEvent): void => {
      event.preventDefault();
    },
  },
];

export default function RootLeftSidebar({}: Props): ReactElement {
  const leftSidebarItems = LeftSidebarItemAttrs.map(
    (
      attrs: RootLeftSidebarItemProps
    ): ReactElement<typeof RootLeftSidebarItem> => (
      <RootLeftSidebarItem {...attrs} isActive />
    )
  );

  return (
    <div className={css(styles.rootLeftSidebar)}>
      <div className={css(styles.rootLeftSidebarStickyWrap)}>
        <Link href={"/"} as={`/`}>
          <div className={css(styles.logoContainer)}>
            <RHLogo iconStyle={styles.logo} white={false} />
          </div>
        </Link>
        <div className={css(styles.leftSidebarItemsContainer)}>
          <div className={css(styles.leftSidebarItemsInnerContainer)}>
            {leftSidebarItems}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebar: {
    background: colors.GREY_ICY_BLUE_HUE,
    position: "relative",
    width: 280,
    minWidth: 280,
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
    userSelect: "none",
    paddingLeft: 32,
    paddingTop: 8,
    width: "100%",
  },
  logo: {
    height: 36,
    userSelect: "none",
  },
  leftSidebarItemsContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  leftSidebarItemsInnerContainer: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    marginTop: 24,
    maxWidth: "90%",
    width: "90%",
  },
});