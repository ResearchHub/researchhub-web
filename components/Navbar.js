import { useEffect, useState, Fragment, useRef, useContext } from "react";

// NPM Components
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { Helpers } from "@quantfive/js-web-config";

import { slide as Menu } from "@quantfive/react-burger-menu";
import Collapsible from "react-collapsible";

// Redux
import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";
import dynamic from "next/dynamic";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import GoogleLoginButton from "../components/GoogleLoginButton";
import NewPostButton from "./NewPostButton";
import Reputation from "./Reputation";
import Search from "./Search/Search";
import TabNewFeature from "~/components/NewFeature/TabNewFeature";
import UserStateBanner from "./Banner/UserStateBanner";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

// Styles
import { filterNull, isNullOrUndefined } from "~/config/utils/nullchecks";
import icons, { RHLogo, voteWidgetIcons } from "~/config/themes/icons";

// Config
import { ROUTES as WS_ROUTES } from "~/config/ws";
import colors from "~/config/themes/colors";
import { isDevEnv } from "~/config/utils/env";
import { breakpoints } from "~/config/themes/screen";
import { getCaseCounts } from "./AuthorClaimCaseDashboard/api/AuthorClaimCaseGetCounts";
import { NavbarContext } from "~/pages/Base";
import HubSelector from "~/components/HubSelector";
import api from "~/config/api";

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

const Navbar = (props) => {
  const router = useRouter();
  const navbarRef = useRef(null);
  const [openCaseCounts, setOpenCaseCounts] = useState(0);
  const [showReferral, setShowReferral] = useState(false);
  const { numNavInteractions } = useContext(NavbarContext);

  const {
    isLoggedIn,
    user,
    authChecked,
    signout,
    walletLink,
    auth,
    updateUser,
  } = props;
  const isUserModerator = !isNullOrUndefined(user)
    ? Boolean(user.moderator)
    : false;
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
    const counts = await getCaseCounts({});
    if (counts) {
      setOpenCaseCounts(counts["OPEN"]);
    }
  }, [numNavInteractions]);

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

  function renderTabs() {
    const _isSelected = (path) => {
      const paths = {
        discuss: [
          "/",
          "/post*",
          "/hubs*",
          "/paper*",
          "/hypothesis*",
          "/my-hubs*",
        ],
        publish: ["/[orgSlug]*"],
        leaderboard: ["/leaderboard/*"],
      };

      return paths[path].reduce((prev, curr) => {
        if (curr.slice(-1) === "*") {
          curr = curr.slice(0, -1);
          return prev || router.pathname.indexOf(curr) >= 0;
        } else {
          return prev || router.pathname === curr;
        }
      }, false);
    };

    return (
      <Fragment>
        <Link href={"/"} key={`navbar_tab_discuss`}>
          <a className={css(styles.tabLink)}>
            <div
              className={css(
                styles.tab,
                styles.firstTab,
                _isSelected("discuss")
                  ? styles.tabSelected
                  : styles.tabUnselected
              )}
            >
              Discuss
            </div>
          </a>
        </Link>
        {user?.id ? (
          <Link
            href={`/${user.organization_slug}/notebook`}
            key={`navbar_tab_publish`}
          >
            <a className={css(styles.tabLink)}>
              <div
                className={css(
                  styles.tab,
                  _isSelected("publish")
                    ? styles.tabSelected
                    : styles.tabUnselected
                )}
              >
                Publish
              </div>
            </a>
          </Link>
        ) : (
          <PermissionNotificationWrapper
            modalMessage="access our publishing tools"
            loginRequired={true}
            hideRipples={true}
            onClick={() => router.push(`/${user.organization_slug}/notebook`)}
            styling={styles.tab}
          >
            {`Publish`}
          </PermissionNotificationWrapper>
        )}
        <Link href={"/leaderboard/users"} key={`navbar_tab_leaderboard`}>
          <a className={css(styles.tabLink)}>
            <div
              className={css(
                styles.tab,
                _isSelected("leaderboard")
                  ? styles.tabSelected
                  : styles.tabUnselected
              )}
            >
              Leaderboard
            </div>
          </a>
        </Link>
      </Fragment>
    );
  }

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
            onClick={() => setSideMenu(!sideMenu)}
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
      <Menu
        top
        isOpen={sideMenu}
        styles={burgerMenuStyle}
        customBurgerIcon={false}
        onStateChange={menuChange}
      >
        <Link href={"/"} as={`/`}>
          <a className={css(styles.logoContainer, styles.logoContainerForMenu)}>
            <RHLogo iconStyle={styles.logo} white={true} />
          </a>
        </Link>
        {renderMenuItems()}
      </Menu>
      <div
        ref={navbarRef}
        className={css(
          styles.navbarContainer,
          (router.route === "/paper/[paperId]/[paperName]" ||
            router.route === "/hubs") &&
            styles.unstickyNavbar
        )}
      >
        <UploadPaperModal />
        <LoginModal />
        <WithdrawalModal />
        <FirstVoteModal auth={auth} updateUser={updateUser} />
        <OrcidConnectModal />
        <DndModal />
        <PromotionInfoModal />
        <ReCaptchaPrompt />
        <Link href={"/"} as={`/`}>
          <a className={css(styles.logoContainer)}>
            <RHLogo iconStyle={styles.logo} withText={true} />
          </a>
        </Link>

        <div className={css(styles.tabsWrapper)}>
          <div className={css(styles.tabs)}>{renderTabs()}</div>
          <div className={css(styles.searchWrapper)}>
            <Search
              overrideStyle={styles.navbarSearchOverride}
              navbarRef={navbarRef}
              id="navbarSearch"
            />
          </div>
        </div>

        <div className={css(styles.hubPopoverWrapper)}>
          <HubSelector />
        </div>

        <div className={css(styles.searchSmallScreen)}>
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
                    <span className={css(styles.caret)}>
                      {voteWidgetIcons.downvote}
                    </span>
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
                  </div>
                </div>
                {openMenu && (
                  <div
                    className={css(
                      styles.dropdown,
                      isUserModerator && styles.dropdownForEditors,
                      !showReferral && styles.lowDropdown
                    )}
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
                        Profile
                      </div>
                    </Link>

                    {isUserModerator && (
                      <Link
                        href={"/user/[authorId]/[tabName]"}
                        as={`/user/${user.author_profile.id}/overview`}
                      >
                        <div className={css(styles.option)}>
                          <span className={css(styles.profileIcon)}>
                            {icons.checkDouble}
                          </span>
                          <span className={css(styles.optionText)}>
                            Editors{" "}
                            <span className={css(styles.notifications)}>
                              {openCaseCounts}
                            </span>
                          </span>
                        </div>
                      </Link>
                    )}

                    <Link href={`/${user.organization_slug}/notebook`}>
                      <div className={css(styles.option)}>
                        <span className={css(styles.profileIcon)}>
                          {icons.bookOpen}
                        </span>
                        Notebook
                        <TabNewFeature overrideStyles={styles.newFeature} />
                      </div>
                    </Link>
                    <Link href={"/settings"} as={`/settings`}>
                      <div className={css(styles.option)}>
                        <span className={css(styles.profileIcon)}>
                          {icons.cog}
                        </span>
                        Settings
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
                          Referral Program
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
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <NewPostButton />
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
  hubPopoverWrapper: {
    display: "none",
    marginRight: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  navbarContainer: {
    width: "100%",
    padding: "20px 20px",
    boxSizing: "border-box",
    display: "flex",
    height: 68,
    background: "#fff",
    alignItems: "center",
    borderBottom: "1px solid #e8e8ef",
    justifyContent: "space-around",
    position: "sticky",
    zIndex: 4,
    top: 0,
    left: 0,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
      height: 66,
    },
  },
  unstickyNavbar: {
    position: "initial",
  },
  tabsWrapper: {
    marginTop: 5,
    display: "flex",
    marginRight: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  tabs: {
    display: "flex",
  },
  buttonLeft: {
    marginRight: 16,
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
  firstTab: {
    marginLeft: 15,
  },
  lastTab: {
    marginRight: 30,
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
    marginTop: 9,
    marginLeft: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      marginTop: 15,
      marginLeft: 10,
    },
  },
  searchSmallScreen: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  tab: {
    cursor: "pointer",
    padding: "20px 15px 20px 15px",
    marginRight: 8,
    color: colors.BLACK(0.5),
    fontSize: 16,
    fontWeight: 500,
    ":hover": {
      color: colors.PURPLE(),
    },
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      padding: "21px 8px 21px 8px",
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
  },
  tabSelected: {
    color: colors.PURPLE(),
    borderBottom: "solid 3px",
    borderColor: colors.PURPLE(),
  },
  tabUnselected: {
    borderBottom: "3px solid transparent",
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
    color: colors.BLUE(),
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
    background: colors.BLUE(),
    border: `${colors.BLUE()} 1px solid`,
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 176,
    paddingBottom: 2.7,
    cursor: "pointer",
    userSelect: "none",
    marginTop: 2,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: 148,
    },
  },
  logoContainerForMenu: {
    position: "absolute",
    top: 6,
    left: 6,
  },
  logo: {
    objectFit: "contain",
    marginBottom: 8,
    height: 38,
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      height: 33,
    },
  },
  reputation: {
    cursor: "pointer",
    marginLeft: 11,
  },
  dropdown: {
    position: "absolute",
    bottom: -265,
    right: 0,
    width: 225,
    boxShadow: "rgba(129,148,167,0.2) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 3,
  },
  dropdownForEditors: {
    bottom: -310,
  },
  lowDropdown: {
    bottom: -215,
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
      color: colors.BLUE(1),
    },
    ":hover #icon": {
      color: colors.BLUE(1),
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
    marginLeft: 15,
    "@media only screen and (max-width: 900px)": {
      marginLeft: 10,
    },
  },
  menuIcon: {
    display: "none",
    fontSize: 22,
    cursor: "pointer",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "unset",
      position: "relative",
      marginLeft: 20,
    },
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
