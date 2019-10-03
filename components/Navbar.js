import Link from "next/link";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Redux
import { ModalActions } from "../redux/modals";

// Components
import ResearchHubLogo from "./ResearchHubLogo";
import LoginModal from "../components/modal/LoginModal";
import UploadPaperModal from "../components/modal/UploadPaperModal";

const Navbar = (props) => {
  const tabData = [
    { label: "About", route: "/about" },
    { label: "Hubs", route: "/hubs" },
    { label: "Help", route: "/help" },
  ];

  function renderTabs() {
    let tabs = tabData.map((tab, index) => {
      return (
        <Link href={tab.route}>
          <div className={css(styles.tab)} key={`navbar_tab_${index}`}>
            {tab.label}
          </div>
        </Link>
      );
    });
    return tabs;
  }

  return (
    <div className={css(styles.navbarContainer)}>
      <UploadPaperModal />
      <LoginModal isOpen={props.modals.openLoginModal} />
      <div className={css(styles.logo)}>
        <ResearchHubLogo />
      </div>
      <div className={css(styles.tabs)}>{renderTabs()}</div>
      <div className={css(styles.search)}>
        <input className={css(styles.searchbar)} placeholder={"Search..."} />
        <i className={css(styles.searchIcon) + " far fa-search"}></i>
      </div>
      <div className={css(styles.actions)}>
        <button
          className={css(styles.button, styles.login)}
          onClick={() => props.modalActions.openLoginModal(true)}
        >
          Log In
        </button>
        <button
          className={css(styles.button, styles.addPaper)}
          onClick={() => props.modalActions.openUploadPaperModal(true)}
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
    padding: 20,
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
    width: 690,
    height: 45,
    boxSizing: "border-box",
    background: "#FBFBFD",
    border: "#E8E8F2 1px solid",
    display: "flex",
    alignItems: "center",
    position: "relative",
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
    borderRadius: 8,
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
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
  logo: {
    width: 200,
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
