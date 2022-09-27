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
  BAR_ANIMATION_DURATION,
  ITEM_FADE_DURATION,
  Props as RootLeftSidebarItemProps,
} from "./sidebar_items/RootLeftSidebarItem";
import { ModalActions } from "~/redux/modals";
import { connect } from "react-redux";
import {
  getCookieOrLocalStorageValue,
  storeToCookieOrLocalStorage,
} from "~/config/utils/storeToCookieOrLocalStorage";
import { isServer } from "~/config/server/isServer";

type Props = {
  openLoginModal: any;
};

const getLeftSidebarItemAttrs = ({
  currentUser,
  isMinimized,
  router,
  openLoginModal,
}: {
  currentUser: any;
  isMinimized: boolean;
  router: NextRouter;
  openLoginModal: any;
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
    {
      icon: icons.book,
      label: "Notebook",
      isMinimized,
      isActive: pathname.includes("notebook"),
      onClick: (event: SyntheticEvent): void => {
        event.preventDefault();
        if (!isLoggedIn) {
          openLoginModal(true, "Please Sign in with Google to continue.");
        } else {
          router.push(`/${organization_slug}/notebook`);
        }
      },
    },
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

const ROOT_LEFT_SIDEBAR_FULL_WIDTH = 280;
const ROOT_LEFT_SIDEBAR_MIN_FORCE_KEY = "$%_ROOT_LEFT_SIDEBAR_MIN_FORCE_KEY_%$";
const ROOT_LEFT_SIDEBAR_MIN_WIDTH = 80;

function RootLeftSidebar({ openLoginModal }: Props): ReactElement {
  const router = useRouter();
  const { pathname = "" } = router ?? {};
  const currentUser = getCurrentUser();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(
    getCurrMediaWidth() >= breakpoints.large.int
  );
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isMinimizeForced, setIsMinimizeForced] = useState<boolean>(
    getCookieOrLocalStorageValue({
      key: ROOT_LEFT_SIDEBAR_MIN_FORCE_KEY,
    })?.value === "true"
  );
  const [didMount, setDidMount] = useState<boolean>(false);

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void => {
      const largeScreen = newMediaWidth >= breakpoints.large.int;
      setIsLargeScreen(largeScreen);
    },
  });

  useEffect((): void => {
    /* if [below] we consider user's screen size. Else, we minimize */
    if (
      !["", "/", "paper", "post", "hypothesis"].includes(pathname.split("/")[1])
    ) {
      setIsMinimized(true);
    } else {
      setIsMinimized(!isLargeScreen);
    }
  }, [pathname, isLargeScreen]);

  useEffect((): void => {
    setTimeout(() => {
      setDidMount(true);
    }, 2000);
  }, []);
  const isMinimizedConclusion = isMinimizeForced || isMinimized;
  console.warn("isMinimizeForced: ", isMinimizeForced);
  console.warn("isMinimized: ", isMinimized);
  console.warn("isMinimizedConclusion: ", isMinimizedConclusion);

  const leftSidebarItemAttrs: RootLeftSidebarItemProps[] =
    getLeftSidebarItemAttrs({
      currentUser,
      isMinimized: isMinimizedConclusion,
      router,
      openLoginModal,
    });

  const leftSidebarItems = leftSidebarItemAttrs.map(
    (
      attrs: RootLeftSidebarItemProps
    ): ReactElement<typeof RootLeftSidebarItem> => (
      <RootLeftSidebarItem {...attrs} />
    )
  );

  const {
    formattedFooterItemsButtonRow,
    formattedFooterTxtItem,
    formattedLeftSidebarItemsContainer,
    formattedLogoContainer,
    formattedRootLeftSidebar,
  } = {
    formattedLogoContainer: [
      styles.logoContainer,
      isMinimizedConclusion && styles.logoContainerMin,
    ],
    formattedRootLeftSidebar: css(styles.rootLeftSidebar),
    formattedLeftSidebarItemsContainer: css(
      styles.leftSidebarItemsContainer,
      isMinimizedConclusion && styles.leftSidebarItemsContainerMin
    ),
    formattedFooterTxtItem: [
      styles.leftSidebarFooterTxtItem,
      isMinimizedConclusion && styles.leftSidebarFooterTxtItemMin,
    ],
    formattedFooterItemsButtonRow: css(
      styles.leftSidebarFooterItemsBottomRow,
      isMinimizedConclusion && styles.leftSidebarFooterItemsBottomRowMin
    ),
  };

  console.warn(
    "formattedFooterItemsButtonRow: ",
    formattedFooterItemsButtonRow
  );

  return (
      <motion.div
        animate={isMinimizedConclusion ? "minimized" : "full"}
        variants={{
          minimized: {
            maxWidth: ROOT_LEFT_SIDEBAR_MIN_WIDTH,
            width: ROOT_LEFT_SIDEBAR_MIN_WIDTH,
          },
          full: {
            maxWidth: ROOT_LEFT_SIDEBAR_FULL_WIDTH,
            width: ROOT_LEFT_SIDEBAR_FULL_WIDTH,
          },
        }}
        transition={{
          duration: didMount
            ? BAR_ANIMATION_DURATION
            : 0 /* avoids landing animation */,
        }}
        className={formattedRootLeftSidebar}
      >
        <div className={css(styles.rootLeftSidebarStickyWrap)}>
          <div className={formattedLeftSidebarItemsContainer}>
            <div className={css(styles.leftSidebarItemsInnerContainer)}>
              <div className={css(styles.logoDiv)}>
                <ALink
                  href={"/"}
                  as={`/`}
                  overrideStyle={formattedLogoContainer}
                >
                  <RHLogo
                    iconStyle={styles.logo}
                    white={false}
                    withText={false}
                  />
                  <motion.img
                    alt="ResearchHub Text Logo"
                    animate={isMinimizedConclusion ? "minimized" : "full"}
                    className={css(styles.researchHubLogoText)}
                    initial={false}
                    key={"researchHub-text-logo"}
                    src={"/static/ResearchHubText.png"}
                    transition={{
                      duration: didMount
                        ? ITEM_FADE_DURATION
                        : 0 /* avoids landing animation */,
                    }}
                    variants={{
                      minimized: {
                        display: "none",
                        opacity: 0,
                        height: 14.05,
                        width: 0,
                      },
                      full: {
                        display: "flex",
                        opacity: 1,
                        height: 14.05,
                        marginLeft: 11.5,
                        width: "unset",
                        objectFit: "contain",
                        transform: "translateY(20%)",
                      },
                    }}
                  />
                </ALink>
              </div>
              {leftSidebarItems}
            </div>
          </div>
          {
            <div className={css(styles.leftSidebarFooter)}>
              <div className={css(styles.leftSidebarFooterItemsTop)}>
                <ALink href="/about" overrideStyle={formattedFooterTxtItem}>
                  {"About"}
                </ALink>
                <ALink
                  href="https://www.notion.so/Working-at-ResearchHub-6e0089f0e234407389eb889d342e5049"
                  overrideStyle={formattedFooterTxtItem}
                >
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
              {isMinimizedConclusion ? (
                <div
                  className={css(styles.arrowRight)}
                  onClick={(event: SyntheticEvent): void => {
                    // debugger;
                    event.preventDefault();
                    setIsMinimizeForced(false);
                    storeToCookieOrLocalStorage({
                      key: ROOT_LEFT_SIDEBAR_MIN_FORCE_KEY,
                      value: "false",
                    });
                  }}
                >
                  {icons.arrowRightToLine}
                </div>
              ) : (
                <div
                  className={css(styles.arrowRight, styles.arrowLeft)}
                  onClick={(event: SyntheticEvent): void => {
                    // debugger;
                    event.preventDefault();
                    setIsMinimizeForced(true);
                    storeToCookieOrLocalStorage({
                      key: ROOT_LEFT_SIDEBAR_MIN_FORCE_KEY,
                      value: "true",
                    });
                  }}
                >
                  {icons.arrowLeftToLine}
                </div>
              )}
            </div>
          }
        </div>
      </motion.div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebar: {
    background: colors.GREY_ICY_BLUE_HUE,
    boxSizing: "border-box",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
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
    boxSizing: "border-box",
  },
  leftSidebarItemsContainerMin: {},
  leftSidebarItemsInnerContainer: {
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
    justifyContent: "flex-start",
    alignItems: "flex-start",
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
    [`@media only screen and (max-width: ${breakpoints.large.int}px)`]: {
      display: "none",
    },
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
    padding: "0 26px",
    userSelect: "none",
    justifyContent: "flex-start",
    // margin: "0 auto",
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
  researchHubLogoText: {
    "@media only screen and (max-width: 1023px)": {
      marginLeft: 0,
    },
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(null, mapDispatchToProps)(RootLeftSidebar);
