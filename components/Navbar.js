import { useEffect, useState, useRef, Fragment } from "react";

// NPM Components
import Link from "next/link";
import Router from "next/router";
import { StyleSheet, css } from "aphrodite";
import { connect, useDispatch, useStore } from "react-redux";
import "react-placeholder/lib/reactPlaceholder.css";
import { slide as Menu } from "react-burger-menu";

// Redux
import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import InviteToHubModal from "../components/modal/InviteToHubModal";
import LoginModal from "../components/modal/LoginModal";
import UploadPaperModal from "../components/modal/UploadPaperModal";
import Button from "../components/Form/Button";
import Search from "./Search";

import { RHLogo } from "~/config/themes/icons";
import { getCurrentUserReputation, getNestedValue } from "~/config/utils";

// Styles
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import GoogleLoginButton from "./GoogleLoginButton";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";

const Navbar = (props) => {
  const dispatch = useDispatch();
  const store = useStore();

  const {
    isLoggedIn,
    user,
    openLoginModal,
    getUser,
    authChecked,
    openUploadPaperModal,
    signout,
  } = props;
  const minimumReputation = getNestedValue(
    store.getState().permission,
    ["data", "CreatePaper", "minimumReputation"],
    null
  );

  const [searchResults, setSearchResults] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  let dropdown;
  let avatar;
  const searchBar = useRef(null);
  const searchDropdown = useRef(null);

  useEffect(() => {
    getUser();
  }, []);

  /**
   * When we click anywhere outside of the dropdown, close it
   * @param { Event } e -- javascript event
   */
  const handleOutsideClick = (e) => {
    if (dropdown && !dropdown.contains(e.target)) {
      setOpenMenu(false);
    }

    if (
      searchBar &&
      !searchBar.current.contains(e.target) &&
      searchDropdown &&
      !searchDropdown.current.contains(e.target)
    ) {
      setShowSearch(false);
    }

    if (
      searchBar &&
      searchBar.current.contains(e.target) &&
      searchResults > 0
    ) {
      setShowSearch(true);
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
    { label: "About", route: "/about", icon: "home" },
    { label: "Hubs", route: "/hubs", icon: "hub" },
    { label: "Help", route: "/help", icon: "help" },
  ];

  const menuTabs = [
    { label: "Add Paper", onClick: addPaperModal, icon: "addPaper" },
    {
      label: "Profile",
      route: {
        href: "/user/[authorId]/[tabName]",
        as: `/user/${user.id}/contributions`,
      },
      icon: "user",
    },
    { label: "Logout", onClick: signout, icon: "signOut" },
  ];

  function renderTabs() {
    let tabs = tabData.map((tab, index) => {
      return (
        <Link href={tab.route} key={`navbar_tab_${index}`}>
          <div
            className={css(
              styles.tab,
              index === 0 && styles.firstTab,
              index === 2 && styles.lastTab
            )}
          >
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
    openUploadPaperModal(true);
  }

  function toggleSideMenu() {
    setSideMenu(!sideMenu);
  }

  function navigateToRoute(route) {
    let { href, as } = route;
    if (href) {
      Router.push(href, as);
    } else {
      Router.push(route);
    }
    if (props.modals.openUploadPaperModal) {
      props.openUploadPaperModal(false);
      document.body.style.overflow = "scroll";
    }
    toggleSideMenu();
  }

  function renderMenuItems() {
    const tabs = [...tabData, ...menuTabs];
    return tabs.map((tab, index) => {
      if (tab.label === "Logout") {
        if (!isLoggedIn) {
          return null;
        } else {
          return (
            <div
              className={css(styles.menuItem)}
              onClick={
                tab.onClick
                  ? tab.onClick
                  : tab.route
                  ? () => navigateToRoute(tab.route)
                  : null
              }
              key={`navbar_tab_${index}`}
            >
              <span className={css(styles.icon)}>{icons[tab.icon]}</span>
              <span className="menu-item">{tab.label}</span>
            </div>
          );
        }
      } else {
        return (
          <div
            className={css(styles.menuItem)}
            onClick={
              tab.onClick
                ? tab.onClick
                : tab.route
                ? () => navigateToRoute(tab.route)
                : null
            }
            key={`navbar_tab_${index}`}
          >
            <span className={css(styles.icon)}>{icons[tab.icon]}</span>
            <span className="menu-item">{tab.label}</span>
          </div>
        );
      }
    });
  }

  function addPaperModal() {
    props.openUploadPaperModal(true);
    setSideMenu(!sideMenu);
  }

  function navigateHome() {
    Router.push("/");
    if (props.modals.openUploadPaperModal) {
      props.openUploadPaperModal(false);
      document.body.style.overflow = "scroll";
    }
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
      height: "100%",
      width: window.innerWidth < 436 ? 210 : 300,
    },
    bmMenu: {
      background: "rgba(55, 58, 70, 1)",
      padding: "2.5em 1.5em 0",
      fontSize: "1.15em",
    },
    bmMorphShape: {
      fill: "#373a47",
    },
    bmItemList: {
      color: "#b8b7ad",
      padding: "0.8em",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
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
        right
        isOpen={sideMenu}
        styles={burgerMenuStyle}
        customBurgerIcon={false}
      >
        {renderMenuItems()}
      </Menu>
      <div className={css(styles.navbarContainer)}>
        <UploadPaperModal />
        <LoginModal />
        <InviteToHubModal />
        <div className={css(styles.logoContainer)} onClick={navigateHome}>
          <RHLogo iconStyle={styles.logo} />
        </div>
        <div className={css(styles.tabs)}>{renderTabs()}</div>
        <Search
          showDropdown={showSearch}
          getDropdownRef={searchDropdown}
          getSearchBarRef={searchBar}
          getNumberOfResults={setSearchResults}
        />
        <div className={css(styles.actions)}>
          <div className={css(styles.buttonLeft)}>
            {!isLoggedIn ? (
              authChecked ? (
                <GoogleLoginButton
                  styles={[
                    styles.button,
                    styles.googleLoginButton,
                    styles.login,
                  ]}
                  iconStyle={styles.googleIcon}
                  customLabelStyle={[styles.googleLabel]}
                />
              ) : null
            ) : (
              <div className={css(styles.userDropdown)}>
                <div
                  className={css(styles.avatarContainer)}
                  ref={(ref) => (avatar = ref)}
                  onClick={toggleMenu}
                >
                  <AuthorAvatar
                    author={user.author_profile}
                    size={34}
                    textSizeRatio={2.5}
                    disableLink={true}
                  />
                  <i className={css(styles.caret) + " fas fa-caret-down"}></i>
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
                      <div className={css(styles.option)}>Profile</div>
                    </Link>
                    <div
                      className={css(styles.option, styles.lastOption)}
                      onClick={signout}
                    >
                      Logout
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
            />
          </PermissionNotificationWrapper>
        </div>
        <div className={css(styles.menuIcon)} onClick={toggleSideMenu}>
          {icons.burgerMenu}
        </div>
      </div>
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
    alignItems: "center",
    borderBottom: "rgb(151,151,151, .2) 1px solid",
    justifyContent: "space-around",
    "@media only screen and (max-width: 760px)": {
      justifyContent: "space-between",
    },
  },
  tabs: {
    display: "flex",
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  buttonLeft: {
    marginLeft: 35,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 70,
      marginRight: 16,
    },
  },
  googleLoginButton: {
    margin: 0,
    width: 200,
    "@media only screen and (max-width: 760px)": {
      display: "none",
    },
  },
  googleIcon: {
    width: 25,
    height: 25,
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
  tab: {
    marginLeft: 20,
    marginRight: 20,
    cursor: "pointer",
    "@media only screen and (max-width: 840px)": {
      margin: "0 15px 0 15px",
      fontSize: 14,
    },
  },
  tabLink: {
    color: "#000",
    underline: "none",
  },
  caret: {
    marginLeft: 16,
    color: "#aaa",
  },
  userDropdown: {
    marginRight: 16,
    position: "relative",
    zIndex: 999,
    "@media only screen and (max-width: 760px)": {
      display: "none",
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
  login: {
    color: colors.BLUE(),
    border: `${colors.BLUE()} 1px solid`,
    background: "transparent",
    ":hover": {
      backgroundColor: "rgba(250, 250, 250, 1)",
    },
    "@media only screen and (max-width: 760px)": {
      display: "none",
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
  logo: {
    height: 40,
    minWidth: 155,
  },
  dropdown: {
    position: "absolute",
    bottom: -126,
    right: 0,
    width: 200,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 3,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    ":hover": {
      color: colors.GREEN(1),
    },
  },
  icon: {
    marginRight: 20,
    fontSize: 30,
    width: 40,
    color: "#FFF",
  },
  lastOption: {
    borderBottom: 0,
  },
  option: {
    width: "100%",
    padding: 16,
    boxSizing: "border-box",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",

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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  user: state.auth.user,
  isLoggedIn: state.auth.isLoggedIn,
  authChecked: state.auth.authChecked,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
  getUser: AuthActions.getUser,
  signout: AuthActions.signout,
  openUploadPaperModal: ModalActions.openUploadPaperModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
