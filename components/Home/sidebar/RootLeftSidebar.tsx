import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftToLine,
  faArrowRightToLine,
  faGrid2,
  faHouse,
  faTableTree,
  faWavePulse,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faMedium,
  faDiscord,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faChartSimple } from "@fortawesome/pro-regular-svg-icons";
import { faBook } from "@fortawesome/pro-duotone-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { NAVBAR_HEIGHT } from "~/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";
import { filterNull, isEmpty, silentEmptyFnc } from "~/config/utils/nullchecks";
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

import RHLogo from "~/components/Home/RHLogo";
import RootLeftSidebarItem, {
  ITEM_FADE_DURATION,
  Props as RootLeftSidebarItemProps,
} from "./sidebar_items/RootLeftSidebarItem";
import { ModalActions } from "~/redux/modals";
import { connect } from "react-redux";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import InviteButton from "~/components/Referral/InviteButton";
import killswitch from "~/config/killswitch/killswitch";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import RhTextTag from "~/components/shared/RhTextTag";

type Props = {
  openLoginModal: any;
  currentUser: any;
  rootLeftSidebarForceMin: boolean;
};

export const LEFT_SIDEBAR_MAX_WIDTH = 240;
export const LEFT_SIDEBAR_MIN_WIDTH = 80;
export const LEFT_SIDEBAR_FORCE_MIN_KEY =
  "RESEARCHHUB_ROOT_LEFT_SIDEBAR_FORCE_MIN";

export const getLeftSidebarItemAttrs = ({
  currentUser,
  isMinimized,
  router,
  openLoginModal,
  refManagerGateKeeper,
}: /* intentional string literal */
{
  currentUser: any;
  isMinimized: boolean;
  router: NextRouter;
  openLoginModal: any;
  refManagerGateKeeper: boolean;
}): RootLeftSidebarItemProps[] => {
  const { pathname = "" } = router ?? {};
  const { organization_slug = "", id } = currentUser ?? {};
  const isLoggedIn = !isEmpty(id);

  return filterNull([
    {
      icon: <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>,
      label: "Home",
      isActive: ["", "/"].includes(pathname),
      isMinimized,
      href: "/",
      onClick: silentEmptyFnc,
    },
    {
      icon: <FontAwesomeIcon icon={faWavePulse}></FontAwesomeIcon>,
      label: "Live",
      isMinimized,
      isActive: pathname.includes("live"),
      href: "/live",
      onClick: silentEmptyFnc,
    },
    {
      icon: <FontAwesomeIcon icon={faGrid2}></FontAwesomeIcon>,
      label: "Hubs",
      isActive: ["/hubs"].includes(pathname),
      isMinimized,
      href: "/hubs",
      onClick: silentEmptyFnc,
    },
    {
      icon: <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>,
      label: "Notebook",
      isMinimized,
      isActive: pathname.includes("notebook"),
      href: `/notebook`,
      onClick: (event: SyntheticEvent): void => {
        if (!isLoggedIn) {
          event.preventDefault();
          openLoginModal(true, "Please Sign in with Google to continue.");
        }
      },
    },
    killswitch("reference-manager")
      ? {
          icon: isMinimized ? (
            <RhTextTag
              width="28px"
              height="16px"
              tagLabel="Beta"
              style={{
                fontVariant: "all-small-caps",
              }}
              textColor={"grey"}
              backgroundColor={"transparent"}
              fontSize="10px"
              tagPosition={{ right: "-20px", bottom: "-10px", top: "unset" }}
            >
              <FontAwesomeIcon icon={faTableTree} />
            </RhTextTag>
          ) : (
            <FontAwesomeIcon icon={faTableTree} />
          ),
          label: isMinimized ? (
            "Reference Manager"
          ) : (
            <RhTextTag
              width="32px"
              height="20px"
              tagLabel="Beta"
              textTransform={"small-caps"}
              backgroundColor={"transparent"}
              textColor={"grey"}
              style={{
                fontVariant: "all-small-caps",
                top: "unset",
                bottom: -10,
                // right: 0,
              }}
              fontSize="12px"
              tagPosition={{ right: "-28px", top: "-10px" }}
            >
              {"Reference Manager"}
            </RhTextTag>
          ),
          isActive: pathname.includes("reference-manager"),
          isMinimized,
          href: refManagerGateKeeper
            ? "/reference-manager"
            : "https://docs.google.com/forms/d/e/1FAIpQLSc51K8cm7QrAwzTknDspqJ7MQ6k6GYBImehEgp8-ajRvQaa7A/viewform?usp=sharing",
          target: refManagerGateKeeper ? undefined : "__blank",
          onClick: silentEmptyFnc,
        }
      : null,
  ]);
};

function RootLeftSidebar({
  openLoginModal,
  rootLeftSidebarForceMin: isForceMinimized,
  currentUser,
}: Props): ReactElement {
  const router = useRouter();
  const { pathname = "" } = router ?? {};
  const { organization_slug = "", id } = currentUser ?? {};
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(
    getCurrMediaWidth() >= breakpoints.large.int
  );

  const [isMinimized, setIsMinimized] = useState<boolean>(isForceMinimized);
  const [isMinimizedLocal, setIsMinimizedLocal] =
    useState<boolean>(isForceMinimized);
  const [growMinimized, setGrowMinimized] = useState<boolean>(isForceMinimized);
  const [didMount, setDidMount] = useState<boolean>(false);
  const refManagerGateKeeper = gateKeepCurrentUser({
    application: "REFERENCE_MANAGER",
    shouldRedirect: false,
  });

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void => {
      const largeScreen = newMediaWidth >= breakpoints.large.int;
      setIsLargeScreen(largeScreen);
    },
  });

  useEffect((): void => {
    // const onSpecficHubPage =
    //   ["hubs"].includes(pathname.split("/")[1]) &&
    //   !isEmpty(pathname.split("/")[2]);
    const onDefaultMinViewPages = ![
      "",
      "/",
      "paper",
      "post",
      "hypothesis",
      "my-hubs",
      "live",
      "referral",
      "user",
    ].includes(pathname.split("/")[1]);

    // if (onSpecficHubPage) {
    //   setIsMinimized(isForceMinimized);
    //   setGrowMinimized(isForceMinimized);
    // } else 
    if (onDefaultMinViewPages) {
      setIsMinimized(isForceMinimized || true);
      setGrowMinimized(isForceMinimized || true);
    } else {
      setIsMinimized(isForceMinimized || !isLargeScreen);
      setGrowMinimized(isForceMinimized || !isLargeScreen);
    }
  }, [pathname, isLargeScreen]);

  useEffect((): void => {
    setTimeout(() => {
      setDidMount(true);
    }, 2000);
  }, []);

  useEffect((): void => {
    if (isMinimized) {
      const sidebarSlideDuration = ITEM_FADE_DURATION * 1000 - 10;
      setTimeout(() => {
        setIsMinimizedLocal(isMinimized);
      }, sidebarSlideDuration);
    } else {
      setIsMinimizedLocal(isMinimized);
    }
  }, [isMinimized]);

  const leftSidebarItemAttrs = useMemo(
    (): RootLeftSidebarItemProps[] =>
      getLeftSidebarItemAttrs({
        currentUser,
        isMinimized,
        router,
        openLoginModal,
        refManagerGateKeeper,
      }),
    [currentUser?.id, router.pathname, isMinimized, refManagerGateKeeper]
  );

  const leftSidebarItems = leftSidebarItemAttrs.map(
    (
      attrs: RootLeftSidebarItemProps,
      ind: number
    ): ReactElement<typeof RootLeftSidebarItem> => (
      <RootLeftSidebarItem key={`${attrs.label}-${ind}`} {...attrs} />
    )
  );

  const {
    formattedFooterItemsButtonRow,
    formattedFooterTxtItem,
    formattedItemsContainer,
    formattedLogoContainer,
    formattedRootLeftSidebar,
  } = {
    formattedFooterItemsButtonRow: css(
      styles.leftSidebarFooterItemsBottomRow,
      isMinimized && styles.leftSidebarFooterItemsBottomRowMin
    ),
    formattedFooterTxtItem: [
      styles.leftSidebarFooterTxtItem,
      isMinimized && styles.leftSidebarFooterTxtItemMin,
    ],
    formattedItemsContainer: css(styles.leftSidebarItemsContainer),
    formattedLogoContainer: [
      styles.logoContainer,
      isMinimizedLocal && isMinimized && styles.logoContainerMin,
    ],
    formattedRootLeftSidebar: css(
      styles.rootLeftSidebar,
      isMinimizedLocal && isMinimized && styles.rootLeftSidebarMin
    ),
  };

  return (
    <motion.div
      animate={growMinimized ? "minimized" : "full"}
      className={formattedRootLeftSidebar + " root-left-sidebar"}
      style={
        ["notebook"].includes(pathname.split("/")[2]) ||
        ["user", "reference-manager", "live"].includes(
          pathname.split("/")[1]
        ) ||
        pathname === "/hypothesis/create"
          ? {
              borderRight: `1px solid ${colors.GREY_BORDER}`,
              width: !process.env.browser
                ? isForceMinimized
                  ? LEFT_SIDEBAR_MIN_WIDTH
                  : LEFT_SIDEBAR_MAX_WIDTH
                : "unset",
            }
          : {
              width: !process.env.browser
                ? isForceMinimized
                  ? LEFT_SIDEBAR_MIN_WIDTH
                  : LEFT_SIDEBAR_MAX_WIDTH
                : "unset",
            }
      }
      transition={{
        duration: didMount
          ? ITEM_FADE_DURATION
          : 0 /* avoids landing animation */,
      }}
      variants={{
        minimized: {
          width: LEFT_SIDEBAR_MIN_WIDTH,
          minWidth: LEFT_SIDEBAR_MIN_WIDTH,
        },
        full: {
          width: LEFT_SIDEBAR_MAX_WIDTH,
          minWidth: LEFT_SIDEBAR_MAX_WIDTH,
        },
      }}
    >
      <div className={css(styles.rootLeftSidebarStickyWrap)}>
        <div className={formattedItemsContainer}>
          <div className={css(styles.leftSidebarItemsInnerContainer)}>
            <div className={css(styles.logoDiv)}>
              <ALink href={"/"} as={`/`} overrideStyle={formattedLogoContainer}>
                <RHLogo
                  iconStyle={styles.logo}
                  white={false}
                  withText={false}
                />
                <AnimatePresence initial={false}>
                  {!isMinimized && (
                    <motion.img
                      alt="ResearchHub Text Logo"
                      className={css(styles.researchHubLogoText)}
                      exit={"minimized"}
                      src={"/static/ResearchHubText.png"}
                      transition={{
                        duration: didMount
                          ? ITEM_FADE_DURATION
                          : 0 /* avoids landing animation */,
                      }}
                      variants={{
                        minimized: {
                          opacity: 0,
                        },
                        full: {
                          display: "visible",
                          opacity: 1,
                        },
                      }}
                    />
                  )}
                </AnimatePresence>
              </ALink>
            </div>
            {leftSidebarItems}
          </div>
        </div>
        <div className={css(styles.leftSidebarFooter)}>
          <div className={css(styles.leftSidebarFooterItemsTop)}>
            <span className={css(formattedFooterTxtItem)}>
              <InviteButton context={"referral"}>
                <span className={css(styles.referralProgramItem)}>
                  {isMinimized ? (
                    "Invite"
                  ) : (
                    <>
                      {"Invite and earn"}
                      <ResearchCoinIcon
                        width={20}
                        height={20}
                        version={4}
                        color={"#AAA8B4"}
                        overrideStyle={styles.rscIcon}
                      />
                    </>
                  )}
                </span>
              </InviteButton>
            </span>
            <ALink
              href="https://docs.researchhub.com"
              target="_blank"
              overrideStyle={formattedFooterTxtItem}
            >
              {"About"}
            </ALink>
            <ALink
              href="https://researchhub.notion.site/Working-at-ResearchHub-6e0089f0e234407389eb889d342e5049"
              overrideStyle={formattedFooterTxtItem}
            >
              {"Jobs"}
            </ALink>
            <ALink
              href="/leaderboard/users"
              overrideStyle={formattedFooterTxtItem}
            >
              {isMinimized ? "Top" : "Leaderboard"}
            </ALink>
            <ALink
              href="https://researchhub.foundation"
              overrideStyle={formattedFooterTxtItem}
            >
              {isMinimized ? "Comm.." : "Community"}
            </ALink>
          </div>
          <div className={css(styles.footer)}>
            <div className={formattedFooterItemsButtonRow}>
              <ALink
                href="https://twitter.com/researchhub"
                overrideStyle={styles.leftSidebarFooterIcon}
                target="__blank"
              >
                {<FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>}
              </ALink>
              <ALink
                href="https://discord.com/invite/ZcCYgcnUp5"
                overrideStyle={styles.leftSidebarFooterIcon}
                target="__blank"
              >
                {<FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon>}
              </ALink>
              <ALink
                href="https://medium.com/researchhub"
                overrideStyle={
                  (styles.leftSidebarFooterIcon, styles.mediumIconOverride)
                }
                target="__blank"
              >
                {<FontAwesomeIcon icon={faMedium}></FontAwesomeIcon>}
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
              <FontAwesomeIcon icon={faArrowRightToLine}></FontAwesomeIcon>
            </div>
          ) : (
            <div
              className={css(styles.arrowRight, styles.arrowLeft)}
              onClick={() => {
                setGrowMinimized(true);
                setIsMinimized(true);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeftToLine}></FontAwesomeIcon>
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
    boxSizing: "border-box",
    position: "relative",
    zIndex: 10,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  rootLeftSidebarMin: {
    minWidth: LEFT_SIDEBAR_MIN_WIDTH,
  },
  rootLeftSidebarStickyWrap: {
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    minHeight: "100vh",
    width: "100%",
  },
  leftSidebarItemsContainer: {
    width: "100%",
    display: "flex",
    overflow: "hidden",
    justifyContent: "center",
  },
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
    justifyContent: "space-between",
    flex: 1,
    height: "100%",
  },
  leftSidebarFooterTxtItem: {
    color: colors.TEXT_GREY(1),
    fontSize: 16,
    fontWeight: 400,
    textDecoration: "none",
    margin: "0 32px 18px",
    ":hover": {
      color: colors.NEW_BLUE(1),
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
  referralProgramItem: {
    // color: colors.ORANGE_DARK2(),
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    cursor: "pointer",
  },
  rscIcon: {
    marginTop: 5,
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
    color: "#aaa",
    cursor: "pointer",
    margin: "auto",
    marginBottom: 0,
    padding: 16,
    [`@media only screen and (max-width: ${breakpoints.large.int}px)`]: {
      display: "none",
    },
  },
  arrowLeft: {
    cursor: "pointer",
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
    width: "100%",
    paddingLeft: 18,
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
    height: 14.05,
    marginLeft: 4,
    marginTop: 6,
    objectFit: "contain",
    transform: "translateY(20%)",
    // marginTop: 10,
    "@media only screen and (max-width: 1023px)": {
      marginLeft: 0,
    },
  },
  mediumIconOverride: { fontSize: 18, marginTop: "-4px" },
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(RootLeftSidebar);
