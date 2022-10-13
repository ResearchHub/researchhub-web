import { AuthActions } from "../redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { deSlug } from "~/config/utils/deSlug";
import { formatMainHeader } from "./UnifiedDocFeed/UnifiedDocFeedUtil";
import { isDevEnv } from "~/config/utils/env";
import { ModalActions } from "../redux/modals";
import { NavbarContext } from "~/pages/Base";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { slide as Menu } from "@quantfive/react-burger-menu";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState, Fragment, useRef, useContext } from "react";
import Collapsible from "react-collapsible";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import GoogleLoginButton from "../components/GoogleLoginButton";
import icons from "~/config/themes/icons";
import MobileOnly from "./MobileOnly";
import NewPostButton from "./NewPostButton";
import PaperUploadStateNotifier from "~/components/Notifications/PaperUploadStateNotifier.tsx";
import Router, { useRouter } from "next/router";
import Search from "./Search/Search";
import UserStateBanner from "./Banner/UserStateBanner";
import NavbarRightButtonGroup from "./Home/NavbarRightButtonGroup";
import RhSearchBar from "./SearchV2/RhSearchBar";

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

const NewPostModal = dynamic(() => import("./Modals/NewPostModal"));

const Navbar = (props) => {
  const router = useRouter();
  const navbarRef = useRef(null);
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

  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */

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

  function toggleSideMenu() {
    setSideMenu(!sideMenu);
  }

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
  const headerLabel = pathname.includes("notebook")
    ? "Lab Notebook"
    : pathname.includes("leaderboard")
    ? "Leaderboard"
    : deSlug(router?.query?.slug ?? "");

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
        <div className={css(styles.logoContainer)}>
          {formatMainHeader({
            label: headerLabel,
            isHomePage: !Boolean(headerLabel),
          })}
          <div className={css(styles.searchWrapper)}>
            <RhSearchBar />
          </div>
        </div>
        <div
          className={css(styles.actions, isLoggedIn && styles.actionsLoggedIn)}
        >
          <div className={css(styles.buttonRight)}>
            {!isLoggedIn ? (
              renderLoginButtons(isLoggedIn)
            ) : (
              <NavbarRightButtonGroup />
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
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
  buttonRight: {
    marginRight: 8,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 20,
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
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: 340,
    width: "100%",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      width: "unset",
      marginBottom: 4,
      maxWidth: "unset",
    },
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
    display: "flex",
    height: NAVBAR_HEIGHT,
    justifyContent: "space-between",
    userSelect: "none",
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
  optionText: {
    position: "relative",
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
