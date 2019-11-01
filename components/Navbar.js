import { useEffect, useState, useRef } from "react";

// NPM Components
import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import { connect, useDispatch, useStore } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

// Redux
import { ModalActions } from "../redux/modals";
import { AuthActions } from "../redux/auth";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import InviteToHubModal from "../components/modal/InviteToHubModal";
import LoginModal from "../components/modal/LoginModal";
import UploadPaperModal from "../components/modal/UploadPaperModal";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

import { RHLogo } from "~/config/themes/icons";
import { getCurrentUserReputation, getNestedValue } from "~/config/utils";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Styles
import colors from "~/config/themes/colors";
import GoogleLoginButton from "./GoogleLoginButton";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";
import ResearchHubLogo from "./ResearchHubLogo";

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

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);

  let dropdown;
  let avatar;
  let searchbar;
  let searchDropdown;

  const searchTimeout = useRef(false);

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
      searchbar &&
      !searchbar.contains(e.target) &&
      searchDropdown &&
      !searchDropdown.contains(e.target)
    ) {
      setShowSearch(false);
    }

    if (searchbar && searchbar.contains(e.target) && searchResults.length > 0) {
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

  function onSearchChange(searchEvent) {
    clearTimeout(searchTimeout.current);

    let value = searchEvent.target.value;
    setShowSearch(true);
    setSearchFinished(false);
    searchTimeout.current = setTimeout(() => {
      let config = {
        route: "all",
      };
      // TODO: add pagination
      // Params to the search for pagination would be page
      fetch(API.SEARCH({ search: value, config }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          setSearchResults(resp.results);
          setSearchFinished(true);
        });
    }, 1500);

    setSearch(searchEvent.target.value);
  }

  let renderSearchResults = () => {
    let results = searchResults.map((result, index) => {
      // TODO: render differrent cards for different search results
      console.log(result);
      return (
        <div
          className={css(styles.searchResult)}
          onClick={() => setTimeout(setShowSearch(false), 500)}
        >
          {result.meta.index === "papers" ? (
            <PaperEntryCard
              paper={result}
              index={index}
              discussionCount={result["discussion_count"]}
            />
          ) : null}
        </div>
      );
    });

    if (results.length === 0) {
      results = (
        <div className={css(styles.emptyResults)}>
          <h2 className={css(styles.emptyTitle)}>
            We can't find what you're looking for! Please try another search.
          </h2>

          <RHLogo iconStyle={styles.logo} />
        </div>
      );
    }

    return results;
  };
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
        <input
          className={css(styles.searchbar)}
          placeholder={"Search..."}
          onChange={onSearchChange}
          ref={(ref) => (searchbar = ref)}
        />
        <i className={css(styles.searchIcon) + " far fa-search"}></i>
        {showSearch && (
          <div
            className={css(styles.searchDropdown)}
            ref={(ref) => (searchDropdown = ref)}
          >
            <ReactPlaceholder
              ready={searchFinished}
              showLoadingAnimation
              type="media"
              rows={4}
              color="#efefef"
            >
              {renderSearchResults()}
            </ReactPlaceholder>
          </div>
        )}
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
  emptyResults: {
    textAlign: "center",
    letterSpacing: 0.7,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyTitle: {
    fontWeight: 400,
    fontSize: 22,
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
