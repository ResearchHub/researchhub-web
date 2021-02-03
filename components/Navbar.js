import { useEffect, useState, Fragment } from "react";

// NPM Components
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import "react-placeholder/lib/reactPlaceholder.css";
import { slide as Menu } from "@quantfive/react-burger-menu";
import Collapsible from "react-collapsible";

// Redux
import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import Button from "../components/Form/Button";
import FirstVoteModal from "../components/Modals/FirstVoteModal";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoginModal from "../components/Modals/LoginModal";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import Reputation from "./Reputation";
import Search from "./Search/Search";
// import SectionBountyModal from "../components/Modals/SectionBountyModal";
import WithdrawalModal from "../components/Modals/WithdrawalModal";
import UploadPaperModal from "../components/Modals/UploadPaperModal";
import Notification from "./Notifications/Notification";
import DndModal from "../components/Modals/DndModal";
import PromotionInfoModal from "~/components/Modals/PromotionInfoModal";
import ReCaptchaPrompt from "./Modals/ReCaptchaPrompt";
import UserStateBanner from "./Banner/UserStateBanner";
import OrcidConnectModal from "./Modals/OrcidConnectModal";

// Styles
import colors from "~/config/themes/colors";
import icons, { voteWidgetIcons } from "~/config/themes/icons";
import { RHLogo } from "~/config/themes/icons";
import { ROUTES as WS_ROUTES } from "~/config/ws";

const Navbar = (props) => {
  const router = useRouter();

  const {
    isLoggedIn,
    user,
    authChecked,
    signout,
    walletLink,
    auth,
    updateUser,
  } = props;

  let dropdown;
  let avatar;

  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */
  const handleOutsideClick = (e) => {
    if (dropdown && !dropdown.contains(e.target)) {
      setOpenMenu(false);
    }

    if (avatar && avatar.contains(e.target)) {
      // TODO: Is this doing what is intended? `avatar` is not a valid ref
      // because AuthorAvatar is a function, not a class
      e.stopPropagation();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  const [openMenu, setOpenMenu] = useState(false);
  const [sideMenu, setSideMenu] = useState(false);

  const tabData = [
    { label: "Home", route: "/", icon: "home" },
    { label: "Hubs", route: "/hubs", icon: "hub" },
    { label: "About", route: "/about", icon: "info-circle" },
    { label: "Help", route: "/help", icon: "help" },
    { label: "Live", route: "/live", icon: "live" },
    { label: "Leaderboard", route: "/leaderboard/users", icon: "trophy" },
  ];

  const menuTabsUpper = [
    {
      label: "Explore ResearchHub",
      icon: "compass",
      key: "explore",
    },
    {
      label: "Settings",
      icon: "cog",
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
      { label: "Help", route: "/help", icon: "help" },
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
        label: "Profile Settings",
        route: {
          href: "/user/settings",
        },
        icon: "signOut",
      },
    ],
  };

  function renderTabs() {
    let tabs = tabData.map((tab, index) => {
      if (tab.icon === "home") {
        return null;
      }
      if (tab.label === "Help") {
        return (
          <div
            key={index}
            className={css(
              styles.tab,
              index === 0 && styles.firstTab,
              index === 2 && styles.lastTab
            )}
          >
            <a
              className={css(styles.tabLink)}
              href={
                "https://www.notion.so/ResearchHub-Help-a25e87a91d0449abb71b2b30ba0acf93"
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              {tab.label}
            </a>
          </div>
        );
      }

      return (
        <Link href={tab.route} key={`navbar_tab_${index}`}>
          <div className={css(styles.tab, index === 0 && styles.firstTab)}>
            {tab.label}
          </div>
        </Link>
      );
    });
    return tabs;
  }

  function toggleMenu() {
    setOpenMenu(!openMenu);
  }

  function onAddPaperClick() {
    Router.push(`/paper/upload/info`, `/paper/upload/info`);
  }

  function toggleSideMenu() {
    setSideMenu(!sideMenu);
  }

  function navigateToRoute(route) {
    let { href, as } = route;
    if (href) {
      if (href === "/user/[authorId]/[tabName]") {
        Router.push(href, `/user/${user.author_profile.id}/contributions`);
      } else {
        Router.push(href, as);
      }
    } else {
      Router.push(route);
    }
    if (props.modals.openUploadPaperModal) {
      props.openUploadPaperModal(false);
      if (document.body.style) {
        document.body.style.overflow = "scroll";
      }
    }
    toggleSideMenu();
  }

  function renderCollapsible(tabs) {
    return tabs.map((tab, index) => {
      if (tab.label === "Help") {
        return (
          <div className={css(styles.menuItem)} key={`navbar_tab_${index}`}>
            <a
              className={css(styles.menuItem, styles.noMargin)}
              href={
                "https://www.notion.so/ResearchHub-Help-a25e87a91d0449abb71b2b30ba0acf93"
              }
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
          className={css(styles.menuItem)}
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
              <div>
                <span className={css(styles.tabIcon)} aria-hidden="true">
                  {icons[tab.icon]}
                </span>
                {tab.label}
              </div>
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
        <Search
          searchClass={styles.mobileSearch}
          inputClass={styles.inputClass}
          searchIconClass={styles.searchIconClass}
          dropdownClass={styles.dropdownClass}
          afterSearchClick={toggleSideMenu}
        />
        {menuTabsRender}
        {!isLoggedIn ? (
          renderMenuLoginButtons(isLoggedIn)
        ) : (
          <Button
            label={"Add Paper"}
            onClick={addPaperModal}
            hideRipples={true}
            customButtonStyle={[styles.addPaperButton]}
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

  function addPaperModal() {
    Router.push(`/paper/upload/info`);
    setSideMenu(!sideMenu);
  }

  function openWithdrawalModal() {
    props.openWithdrawalModal(true);
    setSideMenu(!sideMenu);
  }

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
          <a className={css(styles.logoContainer, styles.mobileLogoContainer)}>
            <RHLogo iconStyle={styles.logo} white={true} />
          </a>
        </Link>
        {renderMenuItems()}
      </Menu>
      <div
        className={css(
          styles.navbarContainer,
          router.route === "/paper/[paperId]/[paperName]" &&
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
        {/* <SectionBountyModal /> */}
        <Link href={"/"} as={`/`}>
          <a className={css(styles.logoContainer)}>
            <RHLogo iconStyle={styles.logo} />
          </a>
        </Link>
        <div className={css(styles.tabs)}>{renderTabs()}</div>
        <Search />
        <div className={css(styles.actions)}>
          <div className={css(styles.buttonLeft)}>
            {!isLoggedIn ? (
              renderLoginButtons(isLoggedIn)
            ) : (
              <div className={css(styles.userDropdown)}>
                <div
                  className={css(styles.avatarContainer)}
                  ref={(ref) => (avatar = ref)}
                  onClick={toggleMenu}
                >
                  <AuthorAvatar
                    author={user.author_profile}
                    size={33}
                    textSizeRatio={2.5}
                    disableLink={true}
                    showModeratorBadge={user && user.moderator}
                  />
                  <span className={css(styles.caret)}>
                    {voteWidgetIcons.downvote}
                  </span>
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
                    className={css(styles.dropdown)}
                    ref={(ref) => (dropdown = ref)}
                    onClick={toggleMenu}
                  >
                    <Link
                      href={"/user/[authorId]/[tabName]"}
                      as={`/user/${user.author_profile.id}/contributions`}
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
                    <Link href={"/user/settings"} as={`/user/settings`}>
                      <div className={css(styles.option)}>
                        <span className={css(styles.profileIcon)}>
                          {icons.cog}
                        </span>
                        Settings
                      </div>
                    </Link>
                    {/* <Link
                      href={{
                        pathname: "/paper/upload/info",
                        query: { type: "pre_registration" },
                      }}
                    >
                      <div className={css(styles.option)}>
                        <i
                          className={
                            css(styles.profileIcon) + " fas fa-layer-plus"
                          }
                        ></i>
                        Submit Funding Request
                      </div>
                    </Link> */}
                    <Link
                      href={{
                        pathname: "/referral",
                      }}
                    >
                      <div className={css(styles.option)}>
                        <span className={css(styles.profileIcon)}>
                          {icons.asterisk}
                        </span>
                        Refer a Friend
                      </div>
                    </Link>
                    <div
                      className={css(styles.option, styles.lastOption)}
                      onClick={() => {
                        signout({ walletLink });
                      }}
                    >
                      <span className={css(styles.profileIcon)}>
                        {icons.signOut}
                      </span>{" "}
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <PermissionNotificationWrapper
            onClick={onAddPaperClick}
            modalMessage="upload a paper"
            loginRequired={true}
            permissionKey="CreatePaper"
          >
            <Button
              customButtonStyle={{ ...styles.button, ...styles.addPaper }}
              label={"Add Paper"}
              hideRipples={true}
            />
          </PermissionNotificationWrapper>
        </div>
        <div className={css(styles.menuIcon)} onClick={toggleSideMenu}>
          {icons.burgerMenu}
        </div>
      </div>
      <UserStateBanner />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    width: "100%",
    padding: "20px 20px",
    boxSizing: "border-box",
    display: "flex",
    height: 80,
    background: "#fff",
    alignItems: "center",
    borderBottom: "rgb(151,151,151, .2) 1px solid",
    justifyContent: "space-around",
    position: "sticky",
    zIndex: 4,
    top: 0,
    left: 0,
    backgroundColor: "#FFF",
    "@media only screen and (max-width: 760px)": {
      justifyContent: "space-between",
      position: "sticky",
      zIndex: 4,
    },
  },
  unstickyNavbar: {
    position: "initial",
    zIndex: "unset",
  },
  tabs: {
    display: "flex",
    marginRight: "auto",
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  buttonLeft: {
    marginRight: 16,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 20,
      marginRight: 16,
    },
  },
  mobileSearch: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 32,
    height: 32,
    "@media only screen and (max-width: 1024px)": {
      display: "flex",
    },
  },
  searchIconClass: {
    top: 7,
  },
  loginContainer: {
    width: "100%",
  },
  tabIcon: {
    marginRight: 8,
    color: "#787c7e",
  },
  googleLoginButton: {
    margin: 0,
    width: "100%",
    "@media only screen and (max-width: 760px)": {
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
  dropdownClass: {
    top: 40,
    width: "100%",
    minWidth: "unset",
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
    marginLeft: 30,
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
  tab: {
    marginLeft: 15,
    marginRight: 15,
    cursor: "pointer",
    "@media only screen and (max-width: 900px)": {
      margin: "0 10px 0 10px",
      fontSize: 14,
    },
  },
  tabLink: {
    color: "#000",
    textDecoration: "none",
  },
  caret: {
    marginLeft: 10,
    color: "#aaa",
  },
  userDropdown: {
    position: "relative",
    zIndex: 5,
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
    // width: 210,
  },
  addPaperButton: {
    width: "100%",
    height: 50,

    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 50,
    },
  },
  searchbar: {
    padding: 10,
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 16,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    right: 10,
    top: 13,
    cursor: "text",
    opacity: 0.4,
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
    "@media only screen and (max-width: 760px)": {
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
  addPaper: {
    background: colors.BLUE(),
    border: `${colors.BLUE()} 1px solid`,
    color: "#fff",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  actions: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 155,
    paddingBottom: 2.7,
    cursor: "pointer",
    userSelect: "none",
  },
  mobileLogoContainer: {
    position: "absolute",
    top: 6,
    left: 6,
  },
  logo: {
    height: 30,
    objectFit: "contain",
    marginBottom: 8,
  },
  reputation: {
    marginLeft: 11,
    minWidth: 56,
  },
  dropdown: {
    position: "absolute",
    bottom: -215,
    right: 0,
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
    // position: "absolute",
    // left: 16,
    // top: "50%",
    // transform: "translateY(-50%)",
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
  avatarContainer: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notification: {
    marginLeft: 15,
    marginnRight: 15,
    "@media only screen and (max-width: 900px)": {
      marginLeft: 10,
    },
  },
  searchDropdown: {
    width: "150%",
    position: "absolute",
    zIndex: 4,
    top: 60,
    maxHeight: 400,
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 5px 10px 0 #ddd",
    background: "#fff",
    overflow: "scroll",
    borderRadius: 8,
    padding: 16,
    boxSizing: "border-box",
  },
  searchResult: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid rgb(235, 235, 235)",
  },
  menuIcon: {
    display: "none",
    fontSize: 22,
    cursor: "pointer",
    "@media only screen and (max-width: 760px)": {
      display: "unset",
      position: "relative",
    },
  },
  oauthContainer: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    minWidth: 160,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  user: state.auth.user,
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
  walletLink: state.auth.walletLink,
  auth: state.auth,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
