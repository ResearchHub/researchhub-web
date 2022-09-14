import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { NextRouter, useRouter } from "next/router";
import { ReactElement, SyntheticEvent, useState } from "react";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import RootLeftSidebarItem, {
  Props as RootLeftSidebarItemProps,
} from "./sidebar_items/RootLeftSidebarItem";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";

type Props = {};

const getLeftSidebarItemAttrs = ({
  isLargeScreen,
  router,
}: {
  isLargeScreen: boolean;
  router: NextRouter;
}): RootLeftSidebarItemProps[] => {
  const { pathname = "" } = router ?? {};
  return [
    {
      icon: icons.home,
      label: isLargeScreen ? "Home" : "",
      isActive: ["", "/"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.squares,
      label: isLargeScreen ? "Hubs" : "",
      isActive: ["hubs"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/hubs");
      },
    },
    {
      icon: icons.book,
      label: isLargeScreen ? "Notebook" : "",
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.coins,
      label: isLargeScreen ? "ResearchCoin" : "",
      isActive: ["hubs"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        // TODO: calvinhlee - placeholder
        event.preventDefault();
      },
    },
    {
      icon: icons.users,
      label: isLargeScreen ? "Community" : "",
      onClick: (event: SyntheticEvent): void => {
        // TODO: calvinhlee - placeholder
        event.preventDefault();
      },
    },
    {
      icon: icons.chartSimple,
      label: isLargeScreen ? "Leaderboard" : "",
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/leaderboard/users");
      },
    },
  ];
};

export default function RootLeftSidebar({}: Props): ReactElement {
  const router = useRouter();
  const [isLargeScreen, setIsLargeisLargeScreen] = useState<boolean>(
    getCurrMediaWidth() >= breakpoints.large.int
  );

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void =>
      setIsLargeisLargeScreen(newMediaWidth >= breakpoints.large.int),
  });

  const leftSidebarItems = getLeftSidebarItemAttrs({
    isLargeScreen,
    router,
  }).map(
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
            <ALink
              href="/about"
              overrideStyle={styles.leftSidebarFooterTxtItem}
            >
              {"About"}
            </ALink>
            <ALink href="/jobs" overrideStyle={styles.leftSidebarFooterTxtItem}>
              {"Jobs"}
            </ALink>
          </div>
          <div className={css(styles.leftSidebarFooterItemsBottomRow)}>
            <ALink
              href="https://twitter.com/researchhub"
              overrideStyle={styles.leftSidebarFooterIcon}
              target="__blank"
            >
              {icons.twitter}
            </ALink>
            <ALink
              href="https://discord.com/invite/ZcCYgcnUp5"
              overrideStyle={styles.leftSidebarFooterIcon}
              target="__blank"
            >
              {icons.discord}
            </ALink>
            <ALink
              href="https://medium.com/researchhub"
              overrideStyle={
                (styles.leftSidebarFooterIcon, styles.mediumIconOverride)
              }
              target="__blank"
            >
              {icons.medium}
            </ALink>
          </div>
          <div className={css(styles.leftSidebarFooterItemsBottomRow)}>
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
    boxSizing: "border-box",
    minWidth: 280,
    position: "relative",
    width: 280,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      minWidth: "unset",
      width: 80,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
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
    height: "49vh",
    justifyContent: "space-between",
  },
  leftSidebarFooterTxtItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 18,
    fontWeight: 400,
    textDecoration: "none",
    margin: "0 32px 18px",
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: 14,
      fontWeight: 300,
      margin: "8px auto",
    },
  },
  leftSidebarFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingTop: 24,
  },
  leftSidebarFooterItemsBottomRow: {
    alignItems: "center",
    display: "flex",
    height: 20,
    marginBottom: 20,
    justifyContent: "center",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "none",
    },
  },
  leftSidebarFooterIcon: {
    fontSize: 18,
    marginRight: 32,
    display: "block",
  },
  leftSidebarFooterBotItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 14,
    marginRight: 14,
    ":hover": {
      color: colors.TEXT_GREY(1),
    },
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
});
