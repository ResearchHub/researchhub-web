import { useEffect, useState } from "react";

// NPM Components
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { connect, useStore } from "react-redux";
import Avatar from "react-avatar";

// Redux
import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import InviteToHubModal from "../components/modal/InviteToHubModal";
import LoginModal from "../components/modal/LoginModal";
import PermissionNotification from "../components/PermissionNotification";
import UploadPaperModal from "../components/modal/UploadPaperModal";

import { RHLogo } from "~/config/themes/icons";
import { getCurrentUserReputation, getNestedValue } from "~/config/utils";

// Styles
import colors from "~/config/themes/colors";

const Navbar = (props) => {
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

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationActionMessage] = useState("upload a paper");
  const userReputation = getCurrentUserReputation(store.getState());

  useEffect(() => {
    getUser();
  }, []);
  const [openMenu, setOpenMenu] = useState(false);

  const tabData = [
    { label: "About", route: "/about" },
    { label: "Hubs", route: "/hubs" },
    { label: "Help", route: "/help" },
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
    if (minimumReputation !== null) {
      if (userReputation < minimumReputation) {
        setNotificationOpen(true);
      } else {
        openUploadPaperModal(true);
      }
    } else {
      console.warn("minimumReputation is null");
    }
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
              <button
                className={css(styles.button, styles.login)}
                onClick={() => openLoginModal(true)}
              >
                Log In
              </button>
            ) : null
          ) : (
            <div className={css(styles.userDropdown)}>
              <div className={css(styles.avatarContainer)} onClick={toggleMenu}>
                <AuthorAvatar
                  author={user.author_profile}
                  size={34}
                  textSizeRatio={2.5}
                  disableLink={true}
                />
              </div>
              {openMenu && (
                <div className={css(styles.dropdown)} onClick={toggleMenu}>
                  <Link
                    href={"/user/[authorId]/[tabName]"}
                    as={`/user/${user.author_profile.id}/contributions`}
                  >
                    <div className={css(styles.option)}>Profile</div>
                  </Link>
                  <div className={css(styles.option)} onClick={signout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          className={css(styles.button, styles.addPaper)}
          onClick={onAddPaperClick}
        >
          Add Paper
        </button>
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
  firstTab: {
    marginLeft: 30,
  },
  lastTab: {
    marginRight: 30,
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
  userDropdown: {
    marginRight: 35,
    position: "relative",
    zIndex: 2,
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
  },
  addPaper: {
    background: colors.BLUE(),
    border: `${colors.BLUE()} 1px solid`,
    color: "#fff",
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
    bottom: -80,
    right: 0,
    height: 70,
    width: 150,
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
  },
  option: {
    width: "100%",
    height: 35,
    padding: 10,
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
