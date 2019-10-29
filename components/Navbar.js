import { useEffect, useState } from "react";

// NPM Components
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { connect, useDispatch, useStore } from "react-redux";

// Redux
import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import InviteToHubModal from "../components/modal/InviteToHubModal";
import LoginModal from "../components/modal/LoginModal";
import UploadPaperModal from "../components/modal/UploadPaperModal";

import { RHLogo } from "~/config/themes/icons";
import { getCurrentUserReputation, getNestedValue } from "~/config/utils";

// Styles
import colors from "~/config/themes/colors";
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

  let dropdown;
  let avatar;

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

  const tabData = [
    { label: "About", route: "/about" },
    { label: "Hubs", route: "/hubs" },
    { label: "Help", route: "/help" },
  ];

  function renderTabs() {
    let tabs = tabData.map((tab, index) => {
      return (
        // <Link href={tab.route} key={`navbar_tab_${index}`}>
        <div
          onClick={() => alert("Not yet implemented!")}
          className={css(
            styles.tab,
            index === 0 && styles.firstTab,
            index === 2 && styles.lastTab
          )}
        >
          {tab.label}
        </div>
        // </Link>
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

  return (
    <div className={css(styles.navbarContainer)}>
      <UploadPaperModal />
      <LoginModal />
      <InviteToHubModal />
      <Link href={"/"}>
        <div className={css(styles.logoContainer)}>
          <RHLogo iconStyle={styles.logo} />
        </div>
      </Link>
      <div className={css(styles.tabs)}>{renderTabs()}</div>
      <div className={css(styles.search)}>
        <input className={css(styles.searchbar)} placeholder={"Search..."} />
        <i className={css(styles.searchIcon) + " far fa-search"}></i>
      </div>
      <div className={css(styles.actions)}>
        <div className={css(styles.buttonLeft)}>
          {!isLoggedIn ? (
            authChecked ? (
              <GoogleLoginButton
                styles={[styles.button, styles.googleLoginButton, styles.login]}
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
          <button className={css(styles.button, styles.addPaper)}>
            Add Paper
          </button>
        </PermissionNotificationWrapper>
      </div>
    </div>
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
  },
  tabs: {
    display: "flex",
  },
  buttonLeft: {
    marginLeft: 35,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 70,
    },
  },
  googleLoginButton: {
    margin: 0,
    width: 200,
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
  },
  tabLink: {
    color: "#000",
    underline: "none",
  },
  search: {
    // width: 690,
    width: 600,
    height: 45,
    boxSizing: "border-box",
    background: "#FBFBFD",
    border: "#E8E8F2 1px solid",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  caret: {
    marginLeft: 16,
    color: "#aaa",
  },
  userDropdown: {
    marginRight: 16,
    position: "relative",
    zIndex: 9999,
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
  },
  addPaper: {
    background: colors.BLUE(),
    border: `${colors.BLUE()} 1px solid`,
    color: "#fff",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  actions: {
    display: "flex",
    alignItems: "center",
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
