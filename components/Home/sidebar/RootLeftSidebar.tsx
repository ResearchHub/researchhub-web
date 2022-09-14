import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { ReactElement, SyntheticEvent } from "react";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import RootLeftSidebarItem, {
  Props as RootLeftSidebarItemProps,
} from "./sidebar_items/RootLeftSidebarItem";
import { NextRouter, useRouter } from "next/router";

type Props = {};

const getLeftSidebarItemAttrs = (
  router: NextRouter
): RootLeftSidebarItemProps[] => {
  const { pathname = "" } = router ?? {};
  return [
    {
      icon: icons.home,
      label: "Home",
      isActive: ["", "/"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.squares,
      label: "Hubs",
      isActive: ["hubs"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/hubs");
      },
    },
    {
      icon: icons.book,
      label: "Notebook",
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.coins,
      label: "Research Coin",
      isActive: ["hubs"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        // TODO: calvinhlee - placeholder
        event.preventDefault();
      },
    },
    {
      icon: icons.users,
      label: "Community",
      onClick: (event: SyntheticEvent): void => {
        // TODO: calvinhlee - placeholder
        event.preventDefault();
      },
    },
    {
      icon: icons.chartSimple,
      label: "Leaderboard",
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/leaderboard/users");
      },
    },
  ];
};

export default function RootLeftSidebar({}: Props): ReactElement {
  const router = useRouter();
  const leftSidebarItems = getLeftSidebarItemAttrs(router).map(
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
        <div className={css(styles.leftSidebarFooter)}>
          <div className={css(styles.leftSidebarFooterItemsTop)}>
            <ALink href="/about" overrideStyle={styles.leftSidebarFooterItem}>
              {"About"}
            </ALink>
          </div>
          <div className={css(styles.leftSidebarFooterItemsBottom)}>
            <ALink
              href="/about/tos"
              overrideStyle={styles.leftSidebarFooterBotItem}
            >
              {"Terms"}
            </ALink>
            <ALink
              href="/about/privacy"
              overrideStyle={styles.leftSidebarFooterBotItem}
            >
              {"Privacy"}
            </ALink>
            <ALink
              href="https://researchhub.notion.site/ResearchHub-a2a87270ebcf43ffb4b6050e3b766ba0"
              overrideStyle={styles.leftSidebarFooterBotItem}
            >
              {"Help"}
            </ALink>
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
  leftSidebarFooter: {
    display: "flex",
    flexDirection: "column",
    height: "50vh",
    justifyContent: "space-between",
  },
  leftSidebarFooterItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 18,
    fontWeight: 400,
    textDecoration: "none",
    margin: "24px 32px",
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  leftSidebarFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  leftSidebarFooterItemsBottom: {
    alignItems: "center",
    display: "flex",
    height: 80,
    justifyContent: "center",
    width: "100%",
  },
  leftSidebarFooterBotItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 14,
    marginRight: 14,
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
});
