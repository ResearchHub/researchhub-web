import { AuthActions } from "../redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { formatMainHeader } from "./UnifiedDocFeed/UnifiedDocFeedUtil";
import { getCaseCounts } from "./AuthorClaimCaseDashboard/api/AuthorClaimCaseGetCounts";
import { Helpers } from "@quantfive/js-web-config";
import { isDevEnv } from "~/config/utils/env";
import { ModalActions } from "../redux/modals";
import { NavbarContext } from "~/pages/Base";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { slide as Menu } from "@quantfive/react-burger-menu";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState, Fragment, useRef, useContext } from "react";
import api from "~/config/api";
import AuthorAvatar from "~/components/AuthorAvatar";
import Collapsible from "react-collapsible";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import getFlagCountAPI from "./Flag/api/getFlagCountAPI";
import GoogleLoginButton from "../components/GoogleLoginButton";
import icons from "~/config/themes/icons";
import Link from "next/link";
import MobileOnly from "./MobileOnly";
import NewPostButton from "./NewPostButton";
import PaperUploadStateNotifier from "~/components/Notifications/PaperUploadStateNotifier.tsx";
import Reputation from "./Reputation";
import Router, { useRouter } from "next/router";
import Search from "./Search/Search";
import UserStateBanner from "./Banner/UserStateBanner";
import RHLogo from "~/components/Home/RHLogo";

export const NAVBAR_HEIGHT = 68;

// Dynamic modules
const DndModal = dynamic(() => import("~/components/Modals/DndModal"));
const FirstVoteModal = dynamic(() =>
  import("~/components/Modals/FirstVoteModal")
);
const LoginModal = dynamic(() => import("~/components/Modals/LoginModal"));
const OrcidConnectModal = dynamic(() =>
  import("~/components/Modals/OrcidConnectModal")
);
const PromotionInfoModal = dynamic(() =>
  import("~/components/Modals/PromotionInfoModal")
);
const UploadPaperModal = dynamic(() =>
  import("~/components/Modals/UploadPaperModal")
);
const WithdrawalModal = dynamic(() =>
  import("~/components/Modals/WithdrawalModal")
);
const ReCaptchaPrompt = dynamic(() =>
  import("~/components/Modals/ReCaptchaPrompt")
);
const Notification = dynamic(() =>
  import("~/components/Notifications/Notification")
);

const NewPostModal = dynamic(() => import("./Modals/NewPostModal"));

const Navbar = (props) => {
  const router = useRouter();
  const navbarRef = useRef(null);
  const [openCaseCounts, setOpenCaseCounts] = useState(0);
  const [showReferral, setShowReferral] = useState(false);
  const { numNavInteractions, setNumNavInteractions } =
    useContext(NavbarContext);
  const {
    isLoggedIn,
    user,
    authChecked,
    signout,
    walletLink,
    auth,
    updateUser,
  } = props;
  const isUserModerator = Boolean(user?.moderator);
  const isUserHubEditor = Boolean(user?.author_profile?.is_hub_editor);
  const dropdownRef = useRef();
  const avatarRef = useRef();

  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */
  const handleOutsideClick = (e) => {
    if (
      !dropdownRef.current?.contains(e.target) &&
      !avatarRef.current?.contains(e.target)
    ) {
      setOpenMenu(false);
    }
  };

  useEffect(async () => {
    let [caseCount, flagCount] = [{}, 0];
    if (isUserModerator) {
      caseCount = (await getCaseCounts({})) ?? {};
    }
    if (isUserModerator || isUserHubEditor) {
      flagCount = (await getFlagCountAPI()) ?? 0;
    }

    const totalCount = (caseCount["OPEN"] ?? 0) + flagCount;

    setOpenCaseCounts(totalCount);
    setNumNavInteractions(totalCount);
  }, [numNavInteractions, user]);

  useEffect(async () => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [openMenu, setOpenMenu] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);

  const menuTabsUpper = [
    {
      label: "Explore ResearchHub",
      key: "explore",
    },
    {
      label: "Account",
      key: "settings",
    },
  ];

  const menuTabs = {
    explore: [
      { label: "Hubs", route: "/hubs", icon: "hub" },
      {
        label: "Withdraw RSC",
        onClick: openWithdrawalModal,
        icon: "coins",
      },
      { label: "Leaderboard", route: "/leaderboard/users", icon: "trophy" },
      { label: "Live", route: "/live", icon: "live" },
      { label: "About", route: "/about", icon: "info-circle" },
      {
        label: "Help",
        route: "",
        link: "https://www.notion.so/researchhub/ResearchHub-a2a87270ebcf43ffb4b6050e3b766ba0",
        icon: "help",
      },
      {
        label: "Blog",
        route: "",
        link: "https://medium.com/researchhub",
        icon: "medium",
      },
    ],
    settings: [
      {
        label: "Profile",
        route: {
          href: "/user/[authorId]/[tabName]",
        },
        icon: "user",
      },
      {
        label: "Settings",
        route: {
          href: "/settings",
        },
        icon: "cog",
      },
      {
        label: "Refer a Friend",
        route: {
          href: "/referral",
        },
        icon: "asterisk",
      },
      {
        label: "Logout",
        onClick: () => {
          signout({ walletLink });
        },
        icon: "signOut",
      },
    ],
  };

  function toggleMenu(e) {
    setOpenMenu(!openMenu);
  }

  function toggleSideMenu() {
    setSideMenu(!sideMenu);
  }

  useEffect(() => {
    function fetchReferrals() {
      return fetch(api.SHOW_REFERRALS(), api.GET_CONFIG())
        .then(Helpers.checKStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          setShowReferral(res.show_referral);
        });
    }

    if (auth.isLoggedIn) {
      fetchReferrals();
    }
  }, [auth.isLoggedIn]);

  function navigateToRoute(route) {
    let { href, as } = route;
    if (href) {
      if (href === "/user/[authorId]/[tabName]") {
        Router.push(
          href,
          `/user/${user.author_profile && user.author_profile.id}/overview`
        );
      } else {
        Router.push(href, as);
      }
    } else {
      Router.push(route);
    }
    if (props.modals.openUploadPaperModal) {
      props.openUploadPaperModal(false);
    }
    toggleSideMenu();
  }

  function renderCollapsible(tabs) {
    return tabs.map((tab, index) => {
      if (tab.link) {
        return (
          <div
            className={css(styles.menuItem, styles[tab.className])}
            key={`navbar_tab_${index}`}
          >
            <a
              className={css(styles.menuItem, styles.noMargin)}
              href={tab.link}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className={css(styles.icon)} id={"icon"}>
                {icons[tab.icon]}
              </span>
              <span className="menu-item">{tab.label}</span>
            </a>
          </div>
        );
      }
      if (
        (tab.label === "Logout" ||
          tab.label === "Profile" ||
          tab.label === "Profile Settings") &&
        !isLoggedIn
      ) {
        return null;
      }
      return (
        <div
          className={css(styles.menuItem, styles[tab.className])}
          onClick={
            tab.onClick
              ? tab.onClick
              : tab.route
              ? () => navigateToRoute(tab.route, tab.label)
              : null
          }
          key={`navbar_tab_${index}`}
        >
          <span className={css(styles.icon)} id={"icon"}>
            {icons[tab.icon]}
          </span>
          <span className="menu-item">{tab.label}</span>
        </div>
      );
    });
  }

  function renderMenuItems() {
    const tabs = [...menuTabsUpper];
    let menuTabsRender = tabs.map((tab, index) => {
      if (!isLoggedIn && tab.key === "settings") {
        return null;
      }

      return (
        <Collapsible
          trigger={
            <div className={css(styles.trigger)}>
              <div>{tab.label}</div>
              <span className={css(styles.chevronDown)}>
                {icons.chevronDownLeft}
              </span>
            </div>
          }
          open={tab.key === "explore"}
          key={`${tab.key}_${index}`}
          openedClassName={css(styles.collapsible)}
          className={css(styles.collapsible)}
        >
          {renderCollapsible(menuTabs[tab.key])}
        </Collapsible>
      );
    });
    return (
      <Fragment>
        {menuTabsRender}
        {!isLoggedIn ? (
          renderMenuLoginButtons(isLoggedIn)
        ) : (
          <NewPostButton
            customButtonStyle={[styles.newPostButton]}
            onClick={() => {
              setSideMenu(false);
            }}
          />
        )}
      </Fragment>
    );
  }

  function renderMenuLoginButtons(isLoggedIn) {
    return (
      <div className={css(styles.loginContainer)} key={`navbar_tab_login`}>
        <GoogleLoginButton
          styles={[styles.loginMobile]}
          iconStyle={styles.googleIcon}
          rippleClass={styles.rippleClass}
          customLabel="Sign In"
          customLabelStyle={[styles.googleLabelMobile]}
          isLoggedIn
        />
      </div>
    );
  }

  function menuChange(state) {
    setSideMenu(state.isOpen);
  }

  const pathname = router?.pathname ?? "";

  function renderLoginButtons(isLoggedIn) {
    return (
      <div className={css(styles.oauthContainer)}>
        <GoogleLoginButton
          styles={[styles.button, styles.googleLoginButton, styles.login]}
          iconStyle={styles.googleIcon}
          customLabelStyle={[styles.googleLabel]}
          isLoggedIn={isLoggedIn}
          disabled={!authChecked}
        />
        <div className={css(styles.divider)}></div>
      </div>
    );
  }

  function openWithdrawalModal() {
    props.openWithdrawalModal(true);
    setSideMenu(!sideMenu);
  }

  return (
    <Fragment>
      <DndModal />
      <FirstVoteModal auth={auth} updateUser={updateUser} />
      <LoginModal />
      <NewPostModal />
      <OrcidConnectModal />
      <PromotionInfoModal />
      <ReCaptchaPrompt />
      <UploadPaperModal />
      <WithdrawalModal />
      <MobileOnly>
        <Menu
          top
          isOpen={sideMenu}
          styles={burgerMenuStyle}
          customBurgerIcon={false}
          onStateChange={menuChange}
        >
          {renderMenuItems()}
        </Menu>
      </MobileOnly>
      <div
        ref={navbarRef}
        className={`${css(
          styles.navbarContainer,
          (router.route === "/paper/[paperId]/[paperName]" ||
            router.route === "/hubs") &&
            styles.unstickyNavbar
        )} navbar`}
      >
        {pathname.includes("notebook") ? (
          <Link href={"/"} as={`/`}>
            <div className={css(styles.logoContainer)}>
              <RHLogo iconStyle={styles.logo} white={false} />
            </div>
          </Link>
        ) : (
          ["", "/"].includes(pathname) && (
            <div className={css(styles.logoContainer)}>
              {formatMainHeader({ isHomePage: true })}
            </div>
          )
        )}
        <div className={css(styles.searchWrapper)}>
          <Search
            overrideStyle={styles.navbarSearchOverride}
            navbarRef={navbarRef}
            id="navbarSearch"
          />
        </div>
        <div
          className={css(styles.actions, isLoggedIn && styles.actionsLoggedIn)}
        >
          <div className={css(styles.buttonLeft)}>
            {!isLoggedIn ? (
              renderLoginButtons(isLoggedIn)
            ) : (
              <div className={css(styles.userDropdown)}>
                <div className={css(styles.navbarButtonContainer)}>
                  <div
                    className={css(styles.avatarContainer)}
                    ref={avatarRef}
                    onClick={toggleMenu}
                  >
                    <AuthorAvatar
                      author={user.author_profile}
                      size={35}
                      textSizeRatio={2.5}
                      disableLink
                      showModeratorBadge={user && user.moderator}
                    />
                    <span className={css(styles.caret)}>{icons.caretDown}</span>
                  </div>
                  <div className={css(styles.reputation)}>
                    <Reputation showBalance={true} />
                  </div>
                  <div
                    className={css(styles.notification)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Notification
                      wsUrl={WS_ROUTES.NOTIFICATIONS(user.id)}
                      wsAuth={true}
                    />
                    {(isUserModerator || isUserHubEditor) && (
                      <div className={css(styles.modBtnContainer)}>
                        <Link
                          href={
                            isUserHubEditor && !isUserModerator
                              ? "/moderators/audit/all"
                              : "/moderators/author-claim-case-dashboard?case_status=OPEN"
                          }
                        >
                          <a className={css(styles.modBtn)}>
                            {icons.shield}
                            {openCaseCounts > 0 && (
                              <div className={css(styles.notifCount)}>
                                {openCaseCounts}
                              </div>
                            )}
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                {openMenu && (
                  <div
                    className={css(styles.dropdown)}
                    ref={dropdownRef}
                    onClick={toggleMenu}
                  >
                    <Link
                      href={"/user/[authorId]/[tabName]"}
                      as={`/user/${user.author_profile.id}/overview`}
                    >
                      <div className={css(styles.option)}>
                        <span
                          className={css(
                            styles.profileIcon,
                            styles.portraitIcon
                          )}
                        >
                          {icons.portrait}
                        </span>
                        {"Profile"}
                      </div>
                    </Link>
                    <Link href={`/${user.organization_slug}/notebook`}>
                      <div className={css(styles.option)}>
                        <span className={css(styles.profileIcon)}>
                          {icons.bookOpen}
                        </span>
                        {"Notebook"}
                      </div>
                    </Link>
                    <Link href={"/settings"} as={`/settings`}>
                      <div className={css(styles.option)}>
                        <span className={css(styles.profileIcon)}>
                          {icons.cog}
                        </span>
                        {"Settings"}
                      </div>
                    </Link>
                    {showReferral && (
                      <Link
                        href={{
                          pathname: "/referral",
                        }}
                      >
                        <div className={css(styles.option)}>
                          <span className={css(styles.profileIcon)}>
                            {icons.asterisk}
                          </span>
                          {"Referral Program"}
                        </div>
                      </Link>
                    )}
                    <div
                      className={css(styles.option, styles.lastOption)}
                      onClick={() => {
                        signout({ walletLink });
                      }}
                    >
                      <span className={css(styles.profileIcon)}>
                        {icons.signOut}
                      </span>
                      <span>{"Logout"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <NewPostButton />
          {Boolean(user.id) && (
            <PaperUploadStateNotifier
              wsAuth
              wsUrl={WS_ROUTES.PAPER_SUBMISSION(user.id)}
            />
          )}
        </div>
        <div
          className={css(styles.menuIcon)}
          onClick={toggleSideMenu}
          data-test={isDevEnv() ? `navbar-mobile-trigger` : undefined}
        >
          {icons.burgerMenu}
        </div>
      </div>
      <UserStateBanner />
    </Fragment>
  );
};

const burgerMenuStyle = {
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "26px",
    width: "26px",
    color: "#FFF",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    width: "100%",
    zIndex: 3147480000,
    height: "unset",
  },
  bmMenu: {
    background: "rgba(55, 58, 70, 1)",
    fontSize: "1.15em",
    padding: "2.5em .6em 32px",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    overflow: "auto",
    borderTop: "1px solid rgba(255,255,255,.2)",
    paddingTop: 16,
  },
  bmItem: {
    display: "inline-block",
    margin: "15px 0 15px 0",
    color: "#FFF",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
  },
};

const styles = StyleSheet.create({
  modBtnContainer: {
    position: "relative",
    padding: "2px 10px",
  },
  modBtn: {
    fontSize: 20,
    display: "inline-block",
    cursor: "pointer",
    color: "rgb(193, 193, 206)",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  navbarContainer: {
    alignItems: "center",
    background: "#fff",
    borderBottom: "1px solid #e8e8ef",
    boxSizing: "border-box",
    display: "flex",
    fontSize: 24,
    fontWeight: 500,
    height: NAVBAR_HEIGHT,
    justifyContent: "space-between",
    left: 0,
    padding: "0 28px",
    position: "sticky",
    top: 0,
    width: "100%",
    zIndex: 4,
    backgroundColor: "#FFF",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      padding: "20px 20px 20px 10px",
      justifyContent: "space-between",
    },
  },
  unstickyNavbar: {
    position: "initial",
  },
  tabs: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonLeft: {
    marginRight: 15,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 20,
      marginRight: 16,
    },
  },
  loginContainer: {
    width: "100%",
  },
  googleLoginButton: {
    margin: 0,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  googleIcon: {
    width: 25,
    height: 25,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    borderRadius: "50%",
  },
  inputClass: {
    padding: 16,
    marginBottom: 0,
    outline: "none",
    borderRadius: 32,
  },
  collapsible: {
    color: "#fff",
    width: "100%",
    marginBottom: 8,
  },
  chevronDown: {
    color: "#787c7e",
  },
  trigger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  banner: {
    textDecoration: "none",
    // padding: 16,
  },
  orcidIcon: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  divider: {
    width: 5,
  },
  lessImportantTab: {
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  googleLabel: {
    color: colors.PURPLE(),
  },
  googleLabelMobile: {
    color: colors.PURPLE(),
    fontVariant: "small-caps",
    fontSize: 20,
    letterSpacing: 0.7,

    "@media only screen and (max-width: 767px)": {
      color: "#fff",
    },
  },
  searchWrapper: {
    width: "100%",
    maxWidth: 364,
  },
  tab: {
    cursor: "pointer",
    padding: "20px 15px 20px 15px",
    color: colors.BLACK(),
    fontSize: 16,
    fontWeight: 400,
    ":hover": {
      color: colors.PURPLE(),
    },
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      padding: "21px 8px 21px 8px",
      fontSize: 14,
    },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      padding: "21px 8px 21px 8px",
      marginRight: 5,
      fontSize: 14,
    },
  },
  tabLink: {
    color: "#000",
    textDecoration: "none",
    position: "relative",
    ":first-child": {
      marginLeft: 15,
    },
  },
  notifications: {
    width: 12,
    height: 12,
    fontSize: 12,
    backgroundColor: colors.RED(),
    borderRadius: "50%",
    color: "#fff",
    padding: 3,
    display: "inline-block",
    textAlign: "center",
  },
  caret: {
    marginLeft: 10,
    color: "#aaa",
  },
  userDropdown: {
    position: "relative",
    zIndex: 5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
    // width: 210,
  },
  newPostButton: {
    width: "100%",
    height: 50,

    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 50,
    },
  },
  button: {
    width: 141,
    height: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    borderRadius: 4,
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    cursor: "pointer",
  },
  rippleClass: {
    width: "100%",
  },
  login: {
    color: colors.NEW_BLUE(),
    border: "1px solid #E7E7E7",
    background: "#FFF",
    ":hover": {
      backgroundColor: "rgba(250, 250, 250, 1)",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  loginMobile: {
    width: "100%",
    padding: 16,
    height: "unset",

    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  newPost: {
    background: colors.NEW_BLUE(),
    border: `${colors.NEW_BLUE()} 1px solid`,
    color: "#fff",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  actions: {
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  actionsLoggedIn: {
    maxWidth: "auto",
  },
  logoContainer: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: NAVBAR_HEIGHT,
    userSelect: "none",
    paddingTop: 8,
    width: "100%",
  },
  logo: {
    height: 36,
    userSelect: "none",
  },
  logoContainerForMenu: {
    position: "absolute",
    top: 7,
    left: ".6em",
    marginTop: 0,
    paddingBottom: 0,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "unset",
    },
  },
  logo: {
    objectFit: "contain",
    marginBottom: 8,
    height: 38,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      height: 30,
    },
  },
  reputation: {
    cursor: "pointer",
    marginLeft: 18,
  },
  dropdown: {
    position: "absolute",
    top: 45,
    left: -25,
    width: 225,
    boxShadow: "rgba(129,148,167,0.2) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 3,
  },
  noMargin: {
    margin: 0,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    letterSpacing: 0.7,
    fontSize: 16,
    width: "100%",
    margin: "12px 0px",
    color: "#FFF",
    textDecoration: "unset",
    ":hover": {
      color: colors.NEW_BLUE(1),
    },
    ":hover #icon": {
      color: colors.NEW_BLUE(1),
    },
  },
  icon: {
    marginRight: 20,
    fontSize: 18,
    width: 40,
    color: "#FFF",
    textAlign: "center",
  },
  lastOption: {
    borderBottom: 0,
  },
  profileIcon: {
    color: "#888A8C",
    marginRight: 16,
  },
  portraitIcon: {
    fontSize: "1.2em",
  },
  option: {
    width: "100%",
    padding: 16,
    boxSizing: "border-box",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    cursor: "pointer",
    position: "relative",
    letterSpacing: 0.7,
    color: "rgba(28, 28, 28, .8)",
    fontWeight: 500,
    fontSize: 15,

    ":hover": {
      background: "#eee",
    },
  },
  optionText: {
    position: "relative",
  },
  navbarButtonContainer: {
    alignItems: "center",
    display: "flex",
  },
  avatarContainer: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
  },
  notification: {
    marginLeft: 10,
    marginTop: 2,
    display: "flex",
    "@media only screen and (max-width: 900px)": {
      marginLeft: 10,
    },
  },
  notifCount: {
    minWidth: 10,
    width: 10,
    maxWidth: 10,
    minHeight: 10,
    height: 10,
    maxHeight: 10,
    position: "absolute",
    top: -2,
    right: 2,
    padding: 3,
    float: "left",
    borderRadius: "50%",
    backgroundColor: colors.RED(),
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
  },
  menuIcon: {
    display: "none",
    fontSize: 22,
    cursor: "pointer",
    // [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
    //   display: "unset",
    //   position: "relative",
    //   marginLeft: 20,
    // },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 0,
      display: "unset",
    },
  },
  oauthContainer: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    minWidth: 160,
  },
  navbarSearchOverride: {
    [`@media only screen and (max-width: ${breakpoints.medium.int}px)`]: {
      marginRight: 10,
    },
  },
  notebookIcon: {
    // fontSize: 18,
    // marginTop: 2,
    display: "flex",
  },
  newFeature: {
    marginLeft: 10,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  user: state.auth.user,
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
  walletLink: state.auth.walletLink,
  auth: state.auth,
  hubState: state.hubs,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
  getUser: AuthActions.getUser,
  signout: AuthActions.signout,
  openUploadPaperModal: ModalActions.openUploadPaperModal,
  openWithdrawalModal: ModalActions.openWithdrawalModal,
  openSignUpModal: ModalActions.openSignUpModal,
  updateUser: AuthActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
