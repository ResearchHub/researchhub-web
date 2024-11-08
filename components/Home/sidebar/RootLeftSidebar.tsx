import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftToLine,
  faArrowRightToLine,
  faGrid2,
  faHandHoldingDollar,
  faHouse,
  faNewspaper,
  faTableTree,
  faWavePulse,
  faFire,
  faBooks,
  faBookOpenCover,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faLinkedin,
  faDiscord,
  faXTwitter,
  faGithub,
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
import { connect, useSelector } from "react-redux";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import RhTextTag from "~/components/shared/RhTextTag";
import VerificationModal from "~/components/Verification/VerificationModal";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import NewPostButton from "~/components/NewPostButton";
import NewPostModal from "~/components/Modals/NewPostModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import RhJournalIcon from "~/components/Icons/RhJournalIcon";

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
      icon: isMinimized ? (
        <RhTextTag
          width="28px"
          height="16px"
          tagLabel="new"
          style={{
            fontVariant: "all-small-caps",
          }}
          textColor={"grey"}
          backgroundColor={"transparent"}
          fontSize="10px"
          tagPosition={{ right: "-20px", bottom: "-10px", top: "unset" }}
        >
          <RhJournalIcon width={21} height={21} color={pathname === "/researchhub-journal" ? colors.NEW_BLUE() : "#C1C1CF"} />
        </RhTextTag>
      ) : (
        <RhJournalIcon width={21} height={21} color={pathname === "/researchhub-journal" ? colors.NEW_BLUE() : "#C1C1CF"} />
      ),
      label: isMinimized ? (
        "RH Journal"
      ) : (
        <RhTextTag
          width="32px"
          height="20px"
          tagLabel="new"
          textTransform={"small-caps"}
          backgroundColor={"transparent"}
          textColor={"grey"}
          style={{
            fontVariant: "all-small-caps",
            top: "unset",
            bottom: -10,
          }}
          fontSize="12px"
          tagPosition={{ right: "-28px", top: "-10px" }}
        >
          {"RH Journal"}
        </RhTextTag>
      ),
      isActive: pathname === "/researchhub-journal",
      isMinimized,
      href: "/researchhub-journal",
      onClick: silentEmptyFnc,
    },
    {
      icon: <ResearchCoinIcon height={21} width={21} version={4} color={["/grants"].includes(pathname) ? colors.NEW_BLUE() : "#C1C1CF"}></ResearchCoinIcon>,
      label: "Grants",
      isActive: ["/grants"].includes(pathname),
      isMinimized,
      href: "/grants",
      onClick: silentEmptyFnc,
    },
    {
      icon: <FontAwesomeIcon icon={faHandHoldingDollar}></FontAwesomeIcon>,
      label: "Funding",
      isActive: ["/funding"].includes(pathname),
      isMinimized,
      href: "/funding",
      onClick: silentEmptyFnc,
    },
    {
      icon: <FontAwesomeIcon icon={faBooks}></FontAwesomeIcon>,
      label: "Journals",
      isActive: ["/journals"].includes(pathname),
      isMinimized,
      href: "/journals",
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
  const auth = useSelector((state: any) => state.auth);
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
        "for-you",
        "funding",
        "hubs",
        "referral",
        "search",
        "grants",
        "bounties",
        "journals",
        "user",
        "author",
        "researchhub-journal",
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
        {attrs.label === "Journals" && !isMinimized && (
          <div className={css(styles.subheader)}>Browse</div>
        )}      
        {attrs.label === "Grants" && !isMinimized && (
          <div className={css(styles.subheader)}>ResearchCoin</div>
        )}
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
      <div className={css(styles.fixedHeader)}>
        <div className={css(styles.logoDiv)}>
          <ALink href={"/"} as={`/`} overrideStyle={formattedLogoContainer}>
            <RHLogo iconStyle={styles.logo} white={false} withText={false} />
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
      </div>

      <div className={css(styles.scrollableContent)}>
        <div className={css(styles.rootLeftSidebarStickyWrap)}>
          <div className={formattedItemsContainer}>
            <div
              className={css(
                styles.leftSidebarItemsInnerContainer,
                isMinimized && styles.leftSidebarItemsInnerContainerMin
              )}
            >
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
              <span className={css(formattedFooterTxtItem)}>
                {/* @ts-ignore */}
                <VerifyIdentityModal
                  // @ts-ignore legacy
                  wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
                  // @ts-ignore legacy
                  wsAuth
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: 5,
                      cursor: "pointer",
                    }}
                  >
                    {isMinimized ? "Verify" : (
                      <>
                        Verify Identity
                        <VerifiedBadge
                          height={20}
                          width={20}
                          variation="grey"
                          showTooltipOnHover={false}
                        />
                      </>
                    )}
                  </div>
                </VerifyIdentityModal>
              </span>            
              <ALink
                href="https://researchhub.foundation"
                overrideStyle={formattedFooterTxtItem}
              >
                {isMinimized ? "Comm.." : "Community"}
              </ALink>
              <ALink 
                href="https://airtable.com/appuhMJaf1kb3ic8e/pagYeh6cB9sgiTIgx/form"
                overrideStyle={formattedFooterTxtItem}
                target="_blank"
              >
                {"Support"}
              </ALink>
              <ALink href="/about" overrideStyle={formattedFooterTxtItem}>
                {"About"}
              </ALink>            
              {/* <ALink
                href="/leaderboard/users"
                overrideStyle={formattedFooterTxtItem}
              >
                {isMinimized ? "Top" : "Leaderboard"}
              </ALink> */}
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
                  href="https://github.com/ResearchHub"
                  overrideStyle={styles.leftSidebarFooterIcon}
                  target="__blank"
                >
                  {<FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>}
                </ALink>
                <ALink
                  href="https://www.linkedin.com/company/researchhubtechnologies"
                  overrideStyle={styles.leftSidebarFooterIcon}
                  target="__blank"
                >
                  {<FontAwesomeIcon icon={faLinkedin}></FontAwesomeIcon>}
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
                  href="https://github.com/ResearchHub/issues/issues/new/choose"
                  target="__blank"
                  overrideStyle={styles.leftSidebarFooterBotItem}
                >
                  {"Issues"}
                </ALink>
                <ALink
                  href="https://docs.researchhub.com/"
                  overrideStyle={styles.leftSidebarFooterBotItem}
                >
                  {"Docs"}
                </ALink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = StyleSheet.create({
  rootLeftSidebar: {
    background: colors.GREY_ICY_BLUE_HUE,
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 10,
    height: "100vh",
    overflowY: "hidden",
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
    fontSize: 15,
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
    margin: "0 auto 10px",
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
  fixedHeader: {
    position: 'sticky',
    top: 0,
    background: colors.GREY_ICY_BLUE_HUE,
    zIndex: 2,
    //borderBottom: `1px solid ${colors.GREY_BORDER}`,
  },

  scrollableContent: {
    height: 'calc(100vh - 136px)', // Desktop height
    overflowY: 'auto',
    overflowX: 'hidden',
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      height: 'auto', // Remove fixed height on mobile
      overflowY: 'visible', // Disable scrolling on mobile
    },
  },
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(RootLeftSidebar);
