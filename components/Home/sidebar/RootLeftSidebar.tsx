import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";
import { filterNull, isEmpty } from "~/config/utils/nullchecks";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
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
  ITEM_FADE_DURATION,
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
      label: "Home",
      isActive: ["", "/"].includes(pathname),
      isMinimized,
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        router.push("/");
      },
    },
    {
      icon: icons.squares,
      label: "Hubs",
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
          label: "Notebook",
          isMinimized,
          isActive: pathname.includes("notebook"),
          onClick: (event: SyntheticEvent): void => {
            event.preventDefault();
            router.push(`/${organization_slug}/notebook`);
          },
        }
      : null,
    {
      icon: icons.chartSimple,
      label: "Leaderboard",
      isMinimized,
      isActive: pathname.includes("leaderboard"),
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
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [growMinimized, setGrowMinimized] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false);

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void => {
      const largeScreen = newMediaWidth >= breakpoints.large.int;
      setIsLargeScreen(largeScreen);
    },
  });
  useEffect((): void => {
    /* if [below] we consider user's screen size. Else, we minimize */
    if (!["", "/"].includes(pathname.split("/")[1])) {
      setIsMinimized(true);
      setGrowMinimized(true);
    } else {
      setIsMinimized(!isLargeScreen);
      setGrowMinimized(!isLargeScreen);
    }
  }, [pathname, isLargeScreen]);

  useEffect((): void => {
    setTimeout(() => {
      setDidMount(true);
    }, 2000);
  }, []);

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

  const variants = {
    minimized: {
      width: 80,
      // opacity: 0,
    },
    full: {
      width: 280,
    },
  };

  const rscIconVariants = {
    minimized: {
      opacity: 0,
      width: 0,
      transform: "scaleX(0)",
      marginLeft: 0,
    },
    full: {
      transform: "scaleX(1)",
      width: "100%",
      opacity: 1,
    },
  };

  return (
    <motion.div
      animate={growMinimized ? "minimized" : "full"}
      variants={variants}
      transition={{
        duration: didMount
          ? ITEM_FADE_DURATION
          : 0 /* avoids landing animation */,
      }}
      className={formattedRootLeftSidebar}
    >
      <div className={css(styles.rootLeftSidebarStickyWrap)}>
        <div className={css(styles.leftSidebarItemsContainer)}>
          <div className={css(styles.leftSidebarItemsInnerContainer)}>
            <div className={css(styles.logoDiv)}>
              <ALink href={"/"} as={`/`} overrideStyle={formattedLogoContainer}>
                <RHLogo
                  iconStyle={styles.logo}
                  white={false}
                  withText={false}
                />
                <motion.img
                  variants={rscIconVariants}
                  animate={isMinimized ? "minimized" : "full"}
                  key={`RHLogo-max`}
                  transition={{
                    duration: didMount
                      ? ITEM_FADE_DURATION
                      : 0 /* avoids landing animation */,
                  }}
                  className={css(styles.researchHubLogoText)}
                  src={"/static/ResearchHubText.png"}
                  alt="ResearchHub Text Logo"
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
          <div className={css(styles.footer)}>
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
          {isMinimized ? (
            <div
              className={css(styles.arrowRight)}
              onClick={() => {
                setGrowMinimized(false);
                setIsMinimized(false);
              }}
            >
              {icons.arrowRightToLine}
            </div>
          ) : (
            <div
              className={css(styles.arrowRight, styles.arrowLeft)}
              onClick={() => {
                setGrowMinimized(true);
                setIsMinimized(true);
              }}
            >
              {icons.arrowLeftToLine}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebar: {
    background: colors.GREY_ICY_BLUE_HUE,
    borderRight: `1.5px solid ${colors.LIGHT_GREY_BORDER}`,
    boxSizing: "border-box",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  rootLeftSidebarMin: {},
  rootLeftSidebarStickyWrap: {
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
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
    maxWidth: "90%",
    width: "90%",
  },
  leftSidebarFooter: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
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
    display: "flex",
    alignItems: "center",
    height: NAVBAR_HEIGHT,
    marginBottom: 20,
    [`@media only screen and (min-width: ${breakpoints.large.int}px)`]: {
      width: "100%",
    },
  },
  footer: {
    marginTop: "auto",
  },
  arrowRight: {
    margin: "auto",
    marginBottom: 0,
    padding: 16,
    color: "#aaa",
    cursor: "pointer",
  },
  arrowLeft: {
    marginTop: 0,
  },
  logoContainer: {
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    height: "68px",
    padding: "0 16px",
    userSelect: "none",
    width: "100%",
  },
  logoContainerMin: {
    paddingLeft: 16,
    justifyContent: "center",
  },
  logo: {
    height: 36,
    userSelect: "none",
  },
  researchHubLogoText: {
    height: 16,
    marginLeft: 4,
    objectFit: "contain",
    marginTop: 7,
    "@media only screen and (max-width: 1023px)": {
      marginLeft: 0,
    },
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
});
