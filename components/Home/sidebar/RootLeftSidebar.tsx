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
  isMinimized,
  router,
}: {
  currentUser: any;
  isMinimized: boolean;
  router: NextRouter;
}): RootLeftSidebarItemProps[] => {
  const { pathname = "" } = router ?? {};
  const { organization_slug = "", id } = currentUser ?? {};
  const isLoggedIn = !isEmpty(id);

  return filterNull([
    {
      icon: icons.home,
      label: !isMinimized ? "Home" : "",
      isActive: ["", "/"].includes(pathname),
      isMinimized,
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.squares,
      label: !isMinimized ? "Hubs" : "",
      isActive: ["/hubs"].includes(pathname),
      isMinimized,
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/hubs");
      },
    },
    isLoggedIn
      ? {
          icon: icons.book,
          label: !isMinimized ? "Notebook" : "",
          isMinimized,
          onClick: (event: SyntheticEvent): void => {
            event.preventDefault();
            router.push(`/${organization_slug}/notebook`);
          },
        }
      : null,
    {
      icon: icons.chartSimple,
      label: !isMinimized ? "Leaderboard" : "",
      isMinimized,
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
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(
    getCurrMediaWidth() >= breakpoints.large.int
  );
  const [isMinimized, setIsMinimized] = useState(true);

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void => {
      const largeScreen = newMediaWidth >= breakpoints.large.int;
      setIsLargeScreen(largeScreen);
    },
  });

  useEffect((): void => {
    if (!["", "/"].includes(pathname)) {
      // if not homepage, we render minimized version no matter what
      setIsMinimized(true);
    } else {
      // if on homepage, we consider user scree nsize
      setIsMinimized(!isLargeScreen);
    }
  }, [pathname, isLargeScreen]);

  const leftSidebarItemAttrs = useMemo(
    (): RootLeftSidebarItemProps[] =>
      getLeftSidebarItemAttrs({
        currentUser,
        isMinimized,
        router,
      }),
    [currentUser.id, router.pathname, isMinimized]
  );

  const leftSidebarItems = leftSidebarItemAttrs.map(
    (
      attrs: RootLeftSidebarItemProps
    ): ReactElement<typeof RootLeftSidebarItem> => (
      <RootLeftSidebarItem {...attrs} />
    )
  );

  const {
    formattedLogoContainer,
    formattedRootLeftSidebar,
    formattedFooterTxtItem,
    formattedFooterItemsButtonRow,
  } = {
    formattedLogoContainer: [
      styles.logoContainer,
      isMinimized && styles.logoContainerMin,
    ],
    formattedRootLeftSidebar: css(
      styles.rootLeftSidebar,
      isMinimized && styles.rootLeftSidebarMin
    ),
    formattedFooterTxtItem: [
      styles.leftSidebarFooterTxtItem,
      isMinimized && styles.leftSidebarFooterTxtItemMin,
    ],
    formattedFooterItemsButtonRow: css(
      styles.leftSidebarFooterItemsBottomRow,
      isMinimized && styles.leftSidebarFooterItemsBottomRowMin
    ),
  };

  return (
    <div className={formattedRootLeftSidebar}>
      <div className={css(styles.rootLeftSidebarStickyWrap)}>
        <div className={css(styles.leftSidebarItemsContainer)}>
          <div className={css(styles.leftSidebarItemsInnerContainer)}>
            <div className={css(styles.logoDiv)}>
              <ALink href={"/"} as={`/`} overrideStyle={formattedLogoContainer}>
                <RHLogo
                  iconStyle={styles.logo}
                  white={false}
                  withText={!isMinimized}
                />
              </ALink>
            </div>
            {leftSidebarItems}
          </div>
        </div>
        <div className={css(styles.leftSidebarFooter)}>
          <div className={css(styles.leftSidebarFooterItemsTop)}>
            <ALink href="/about" overrideStyle={formattedFooterTxtItem}>
              {"About"}
            </ALink>
            <ALink href="/jobs" overrideStyle={formattedFooterTxtItem}>
              {"Jobs"}
            </ALink>
          </div>
          <div>
            <div className={formattedFooterItemsButtonRow}>
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
            <div className={formattedFooterItemsButtonRow}>
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
  },
  rootLeftSidebarMin: {
    minWidth: 80,
    width: 80,
  },
  rootLeftSidebarStickyWrap: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    width: "100%",
  },
  leftSidebarItemsContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  leftSidebarItemsInnerContainer: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    maxWidth: "90%",
    width: "90%",
  },
  leftSidebarFooter: {
    display: "flex",
    flexDirection: "column",
    height: "65vh",
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
  },
  leftSidebarFooterTxtItemMin: {
    fontSize: 14,
    fontWeight: 300,
    margin: "8px auto",
  },
  leftSidebarFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 24,
  },
  leftSidebarFooterItemsBottomRow: {
    alignItems: "center",
    display: "flex",
    height: 20,
    marginBottom: 20,
    justifyContent: "center",
    width: "100%",
  },
  leftSidebarFooterItemsBottomRowMin: { display: "none" },
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
  },
  logoContainerMin: {
    padding: 0,
    justifyContent: "center",
  },
  logo: {
    height: 36,
    userSelect: "none",
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
});
