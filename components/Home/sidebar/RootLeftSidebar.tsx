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
  faXTwitter,
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
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import RhTextTag from "~/components/shared/RhTextTag";
import VerificationModal from "~/components/Verification/VerificationModal";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import NewPostButton from "~/components/NewPostButton";
import NewPostModal from "~/components/Modals/NewPostModal";

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
}: /* intentional string literal */
{
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
    // Disabled for now until we go live with funding.
    // {
    //   icon: ["/funding"].includes(pathname) ? (
    //     <img
    //       src="/static/rsc-icon-dark-blue.svg"
    //       width="24"
    //       height="24"
    //       style={{
    //         marginLeft: "-2px",
    //       }}
    //     />
    //   ) : (
    //     <img
    //       src="/static/rsc-icon-gray.svg"
    //       width="24"
    //       height="24"
    //       style={{
    //         marginLeft: "-2px",
    //       }}
    //     />
    //   ),
    //   label: "Funding",
    //   isActive: ["/funding"].includes(pathname),
    //   isMinimized,
    //   href: "/funding",
    //   onClick: silentEmptyFnc,
    // },
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
      label: "Lab Notebook",
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
    {
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
      // if user isn't logged in, go to the product page
      href: isLoggedIn ? "/reference-manager" : "/product/reference-manager",
    },
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
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

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
    const onDefaultMinViewPages =
      [
        "",
        "/",
        "paper",
        "question",
        "post",
        "hypothesis",
        "live",
        "funding",
        "hubs",
        "referral",
        "user",
      ].includes(pathname.split("/")[1]) !== true;
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
      }),
    [currentUser?.id, router.pathname, isMinimized]
  );

  const leftSidebarItems = leftSidebarItemAttrs.map(
    (
      attrs: RootLeftSidebarItemProps,
      ind: number
    ): ReactElement<typeof RootLeftSidebarItem> => (
      <>
        {attrs.label === "Lab Notebook" && !isMinimized && (
          <div className={css(styles.subheader)}>Tools</div>
        )}
        <RootLeftSidebarItem key={`${attrs.label}-${ind}`} {...attrs} />
      </>
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
          <div
            className={css(
              styles.leftSidebarItemsInnerContainer,
              isMinimized && styles.leftSidebarItemsInnerContainerMin
            )}
          >
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
            <div
              className={css(
                isMinimized
                  ? styles.newPostButtonContainerMin
                  : styles.newPostButtonContainer
              )}
            >
              <NewPostButton
                customButtonStyle={styles.newPostButtonCustom}
                isMinimized={isMinimized}
              />
            </div>
            <NewPostModal />
            {leftSidebarItems}
          </div>
        </div>
        <div className={css(styles.leftSidebarFooter)}>
          {!isMinimized && (
            <div className={css(styles.subheader)}>Resources</div>
          )}
          <div className={css(styles.leftSidebarFooterItemsTop)}>
            {/* <span className={css(formattedFooterTxtItem)}>
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
            </span> */}
            <ALink
              href="https://docs.researchhub.com"
              target="_blank"
              overrideStyle={formattedFooterTxtItem}
            >
              {"About"}
            </ALink>
            <ALink
              href="https://researchhub.foundation"
              overrideStyle={formattedFooterTxtItem}
            >
              {isMinimized ? "Comm.." : "Community"}
            </ALink>
            <span className={css(formattedFooterTxtItem)}>
              <VerificationModal
                isModalOpen={isVerificationModalOpen}
                handleModalClose={() => setIsVerificationModalOpen(false)}
              />
              <span
                className={css(styles.referralProgramItem)}
                onClick={() => setIsVerificationModalOpen(true)}
              >
                {isMinimized ? (
                  "Verify"
                ) : (
                  <>
                    {"Verify Authorship"}
                    <VerifiedBadge
                      height={20}
                      width={20}
                      variation="grey"
                      showTooltipOnHover={false}
                    />
                  </>
                )}
              </span>
            </span>
            <ALink
              href="/leaderboard/users"
              overrideStyle={formattedFooterTxtItem}
            >
              {isMinimized ? "Top" : "Leaderboard"}
            </ALink>
            <ALink
              href="https://researchhub.notion.site/Working-at-ResearchHub-6e0089f0e234407389eb889d342e5049"
              overrideStyle={formattedFooterTxtItem}
            >
              {"Jobs"}
            </ALink>
          </div>
          <div className={css(styles.footer)}>
            <div className={formattedFooterItemsButtonRow}>
              <ALink
                href="https://x.com/researchhub"
                overrideStyle={styles.leftSidebarFooterIcon}
                target="__blank"
              >
                {<FontAwesomeIcon icon={faXTwitter}></FontAwesomeIcon>}
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
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  leftSidebarItemsInnerContainerMin: {
    paddingBottom: 16,
    marginBottom: 16,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      borderBottom: `1px solid ${colors.GREY_BORDER}`,
    },
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
    margin: "0 30px 12px",
    ":hover": {
      color: colors.NEW_BLUE(1),
    },
  },
  leftSidebarFooterTxtItemMin: {
    fontSize: 14,
    fontWeight: 300,
    margin: "0 auto 12px",
  },
  leftSidebarFooterItemsTop: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 10,
  },
  leftSidebarFooterItemsBottomRow: {
    alignItems: "center",
    display: "flex",
    padding: "8px 30px",
    justifyContent: "flex-start",
    width: "100%",
  },
  leftSidebarFooterItemsBottomRowMin: { display: "none" },
  referralProgramItem: {
    // color: colors.ORANGE_DARK2(),
    display: "flex",
    alignItems: "center",
    columnGap: "6px",
    cursor: "pointer",
  },
  rscIcon: {
    // marginTop: 5,
  },
  leftSidebarFooterIcon: {
    fontSize: 18,
    marginRight: 20,
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
    marginBottom: 8,
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
    padding: "10px 32px 24px",
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
    padding: "0 30px",
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
  subheader: {
    borderTop: `1px solid ${colors.GREY_BORDER}`,
    marginTop: 12,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.LIGHT_GREY_TEXT,
    padding: "16px 30px 10px",
  },
  newPostButtonContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "10px auto 18px",
    width: "calc(100% - 52px)",
  },
  newPostButtonContainerMin: {
    display: "flex",
    justifyContent: "center",
    margin: "10px auto 20px",
    width: "calc(100% - 26px)",
  },
  newPostButtonCustom: {
    height: 40,
    width: "100%",
  },
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(RootLeftSidebar);
