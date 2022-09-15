import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";
import { filterNull, isEmpty } from "~/config/utils/nullchecks";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { isServer } from "~/config/server/isServer";
import { NextRouter, useRouter } from "next/router";
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import RHLogo from "~/components/Home/RHLogo";
import RootLeftSidebarItem, {
  Props as RootLeftSidebarItemProps,
} from "./sidebar_items/RootLeftSidebarItem";

type Props = {};

const getLeftSidebarItemAttrs = ({
  currentUser,
  shouldMaximize,
  router,
}: {
  currentUser: any;
  shouldMaximize: boolean;
  router: NextRouter;
}): RootLeftSidebarItemProps[] => {
  const { pathname = "" } = router ?? {};
  const { organization_slug = "", id } = currentUser ?? {};
  const isLoggedIn = !isEmpty(id);

  return filterNull([
    {
      icon: icons.home,
      label: shouldMaximize ? "Home" : "",
      isActive: ["", "/"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.squares,
      label: shouldMaximize ? "Hubs" : "",
      isActive: ["/hubs"].includes(pathname),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/hubs");
      },
    },
    isLoggedIn
      ? {
          icon: icons.book,
          label: shouldMaximize ? "Notebook" : "",
          onClick: (event: SyntheticEvent): void => {
            event.preventDefault();
            router.push(`/${organization_slug}/notebook`);
          },
        }
      : null,
    {
      icon: icons.coins,
      label: shouldMaximize ? "ResearchCoin" : "",
      onClick: (event: SyntheticEvent): void => {
        // TODO: calvinhlee - placeholder
        event.preventDefault();
      },
    },
    {
      icon: icons.users,
      label: shouldMaximize ? "Community" : "",
      onClick: (event: SyntheticEvent): void => {
        // TODO: calvinhlee - placeholder
        event.preventDefault();
      },
    },
    {
      icon: icons.chartSimple,
      label: shouldMaximize ? "Leaderboard" : "",
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/leaderboard/users");
      },
    },
  ]);
};

export default function RootLeftSidebar({}: Props): ReactElement {
  const router = useRouter();
  const { pathname = "" } = router ?? {};
  const currentUser = getCurrentUser();
  const [screenSize, setScreenSize] = useState<number>(getCurrMediaWidth());
  const [isLargeScreen, setIsLargeisLargeScreen] = useState<boolean>(
    getCurrMediaWidth() >= breakpoints.large.int
  );
  const shouldMaximize = isLargeScreen; // NOTE: Leaving this here. We may need more logic in the future.

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void => {
      const largeScreen = newMediaWidth >= breakpoints.large.int;
      setIsLargeisLargeScreen(largeScreen);
    },
  });

  useEffect((): void => {
    setScreenSize(getCurrMediaWidth());
  });

  const leftSidebarItemAttrs = useMemo(
    (): RootLeftSidebarItemProps[] =>
      getLeftSidebarItemAttrs({
        currentUser,
        shouldMaximize,
        router,
      }),
    [currentUser.id, router.pathname, shouldMaximize, screenSize]
  );

  const isOnNoteBookPage = pathname.includes("notebook");
  if (isOnNoteBookPage) {
    return <></>;
  }

  const leftSidebarItems = leftSidebarItemAttrs.map(
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
            <div className={css(styles.logoDiv)}>
              <ALink href={"/"} as={`/`} overrideStyle={[styles.logoContainer]}>
                <RHLogo
                  iconStyle={styles.logo}
                  white={false}
                  withText={isServer() ? undefined : shouldMaximize}
                />
              </ALink>
            </div>
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
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.large.int - 1}px)`]: {
      minWidth: 80,
      width: 80,
    },
  },
  rootLeftSidebarStickyWrap: {
    position: "sticky",
    top: 0,
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
    [`@media only screen and (max-width: ${breakpoints.large.int - 1}px)`]: {
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
    [`@media only screen and (max-width: ${breakpoints.large.int - 1}px)`]: {
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
  logoDiv: {
    [`@media only screen and (min-width: ${breakpoints.large.int}px)`]: {
      width: "100%",
    },
  },
  logoContainer: {
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    height: NAVBAR_HEIGHT,
    padding: "0 16px",
    userSelect: "none",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.large.int - 1}px)`]: {
      padding: 0,
      marginBottom: 14,
    },
  },
  logo: {
    height: 36,
    userSelect: "none",
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
});
