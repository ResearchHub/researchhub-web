import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { ReactElement, SyntheticEvent } from "react";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
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
      <RootLeftSidebarItem {...attrs} />
    )
  );

  return (
    <div className={css(styles.rootLeftSidebar)}>
      <div className={css(styles.rootLeftSidebarStickyWrap)}>
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
    borderRight: `1.5px solid ${colors.LIGHT_GREY_BORDER}`,
    minWidth: 280,
    position: "relative",
    width: 280,
  },
  rootLeftSidebarStickyWrap: {
    position: "sticky",
    top: NAVBAR_HEIGHT,
    width: "100%",
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
    marginTop: 20,
    maxWidth: "90%",
    width: "90%",
  },
});
