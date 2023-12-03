import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/pro-regular-svg-icons";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import { AuthActions } from "../redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { ModalActions } from "../redux/modals";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import { useState, Fragment, useRef, useEffect } from "react";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import NavbarRightButtonGroup from "./Home/NavbarRightButtonGroup";
import NewPostButton from "./NewPostButton";
import PaperUploadStateNotifier from "~/components/Notifications/PaperUploadStateNotifier.tsx";
import RhSearchBar from "./SearchV2/RhSearchBar";
import RootLeftSidebarSlider from "~/components/Home/sidebar/RootLeftSidebarSlider";
import SlidingPane from "react-sliding-pane";
import UserStateBanner from "./Banner/UserStateBanner";
import RHLogo from "./Home/RHLogo";
import LoginModal from "./Login/LoginModal";
import Login from "./Login/Login";
import Button from "./Form/Button";
import BackBtn from "./shared/BackBtn";
import { navContext } from "./contexts/NavigationContext";

const DndModal = dynamic(() => import("~/components/Modals/DndModal"));
const FirstVoteModal = dynamic(() =>
  import("~/components/Modals/FirstVoteModal")
);
const NewPostModal = dynamic(() => import("./Modals/NewPostModal"));
const OrcidConnectModal = dynamic(() =>
  import("~/components/Modals/OrcidConnectModal")
);
const PromotionInfoModal = dynamic(() =>
  import("~/components/Modals/PromotionInfoModal")
);
const ReCaptchaPrompt = dynamic(() =>
  import("~/components/Modals/ReCaptchaPrompt")
);
const UploadPaperModal = dynamic(() =>
  import("~/components/Modals/UploadPaperModal")
);
const WithdrawalModal = dynamic(() =>
  import("~/components/Modals/WithdrawalModal")
);

export const NAVBAR_HEIGHT = 68;

const Navbar = (props) => {
  const { address, isConnected } = useAccount();

  const router = useRouter();
  const navbarRef = useRef(null);
  const { isLoggedIn, user, auth, updateUser } = props;
  const [shouldShowSlider, setShouldShowSlider] = useState(false);
  const [stickyNavbar, setStickyNavbar] = useState(true);
  const { open, close } = useWeb3Modal();

  const isPost = ["post"].includes(router.pathname.split("/")[1]);
  const isPaper = ["paper"].includes(router.pathname.split("/")[1]);
  const isQuestion = ["question"].includes(router.pathname.split("/")[1]);
  const isRefManager = router.pathname.includes("reference-manager");

  useEffect(() => {
    const isPost = ["post"].includes(router.pathname.split("/")[1]);
    const isPaper = ["paper"].includes(router.pathname.split("/")[1]);
    const unstickyNavbar = isPost || isPaper;

    setStickyNavbar(!unstickyNavbar);
  }, [router.pathname]);

  const { setIsRefManagerSidebarOpen, isRefManagerSidebarOpen } = navContext();
  const pathname = router?.pathname ?? "";
  const headerLabel = pathname.includes("notebook") ? (
    "Lab Notebook"
  ) : pathname.includes("leaderboard") ? (
    "Leaderboard"
  ) : isRefManager ? (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        onClick={() => {
          setIsRefManagerSidebarOpen(!isRefManagerSidebarOpen);
        }}
        className={css(styles.burgerIcon)}
      >
        <FontAwesomeIcon icon={faBars} />
      </div>
      {` Reference Manager`}
    </div>
  ) : isPaper ? (
    <div className={css(styles.backBtnWrapper)}>
      <BackBtn label={"Paper"} href="/" />
    </div>
  ) : isPost ? (
    <div className={css(styles.backBtnWrapper)}>
      <BackBtn label={"Post"} href="/" />
    </div>
  ) : isQuestion ? (
    <div className={css(styles.backBtnWrapper)}>
      <BackBtn label={"Question"} href="/" />
    </div>
  ) : (
    "Explore ResearchHub"
  );

  useEffect(() => {
    setShouldShowSlider(false);
  }, [pathname]);

  const researchhubTitle = (
    <Fragment>
      <div className={css(styles.xsmallUpTitle, styles.headerLabel)}>
        {headerLabel}
      </div>
      <div className={css(styles.xsmallDownTitle)}>
        <div
          className={css(styles.burgerIcon)}
          onClick={() => {
            if (isRefManager) {
              setIsRefManagerSidebarOpen(!isRefManagerSidebarOpen);
            } else {
              setShouldShowSlider(!shouldShowSlider);
            }
          }}
        >
          {<FontAwesomeIcon icon={faBars}></FontAwesomeIcon>}
        </div>
        <div
          onClick={(event) => {
            event.preventDefault();
            router.push("/");
          }}
          style={{ cursor: "pointer" }}
        >
          <RHLogo withText iconStyle={styles.rhLogoNav} />
        </div>
      </div>
    </Fragment>
  );

  const isProfilePage = router.pathname === "/user/[authorId]/[tabName]";
  return (
    <Fragment>
      <DndModal />
      <FirstVoteModal auth={auth} updateUser={updateUser} />
      {props.modals.openLoginModal && <LoginModal isOpen={true} />}
      <NewPostModal />
      <OrcidConnectModal />
      <PromotionInfoModal />
      <ReCaptchaPrompt />
      <UploadPaperModal />
      <WithdrawalModal
        openWeb3ReactModal={open}
        closeWeb3ReactModal={close}
        address={address}
        isConnected={isConnected}
      />
      <div
        ref={navbarRef}
        className={`${css(
          styles.navbarContainer,
          !stickyNavbar && styles.unstickyNavbar
        )} navbar`}
      >
        <div className={css(styles.logoContainer)}>
          {researchhubTitle}
          <div className={css(styles.slideLeftPaneOnXSmall)}>
            <SlidingPane
              children={<RootLeftSidebarSlider />}
              className={css(styles.slidingPaneBody)}
              from="left"
              hideHeader
              isOpen={shouldShowSlider}
              onRequestClose={() => setShouldShowSlider(false)}
              overlayClassName={css(styles.slidingPaneOverlay)}
            />
          </div>
          <div className={css(styles.searchWrapper)}>
            <RhSearchBar />
          </div>
        </div>
        <div
          className={css(styles.actions, isLoggedIn && styles.actionsLoggedIn)}
        >
          <div className={css(styles.buttonRight)}>
            {isLoggedIn ? (
              <NavbarRightButtonGroup />
            ) : (
              <div className={css(styles.oauthContainer)}>
                <Login>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "10px",
                    }}
                  >
                    <Button
                      size="small"
                      variant="text"
                      customButtonStyle={styles.signUpBtn}
                      label="Log in"
                      hideRipples
                    />
                    <Button
                      size="small"
                      customButtonStyle={styles.signUpBtn}
                      label="Sign up"
                      hideRipples
                    />
                  </div>
                </Login>
                <div className={css(styles.divider)}></div>
              </div>
            )}
          </div>
          {isLoggedIn && <NewPostButton />}

          {Boolean(user.id) && (
            <PaperUploadStateNotifier
              wsAuth
              wsUrl={WS_ROUTES.PAPER_SUBMISSION(user.id)}
            />
          )}
        </div>
      </div>
      {/* 
        On profile page, we show <UserStateBanner /> based on the profile of the user.
        We do not want to show this on that page to avoid showing the banner twice.
      */}
      {user && !isProfilePage && (
        <UserStateBanner
          probable_spammer={user.probable_spammer}
          is_suspended={user.is_suspended}
        />
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  backBtnWrapper: {
    fontSize: 20,
    [`@media (max-width: ${breakpoints.medium.str})`]: {
      fontSize: 20,
    },
  },
  headerLabel: {
    fontSize: 22,
  },
  signUpBtn: {
    width: 90,
    fontSize: 16,
  },
  navbarContainer: {
    alignItems: "center",
    background: "#fff",
    backgroundColor: "#FFF",
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
    zIndex: 5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "10px 15px 10px 30px",
      justifyContent: "space-between",
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      padding: "10px 15px 10px 15px",
    },
  },
  unstickyNavbar: {
    position: "initial",
  },
  buttonRight: {
    marginRight: 16,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 20,
    },
  },
  banner: {
    textDecoration: "none",
  },
  divider: {
    width: 5,
  },
  searchWrapper: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: 340,
    position: "relative",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      marginBottom: 4,
      maxWidth: "unset",
      width: "unset",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      margin: "0 16px 4px 0",
      maxWidth: "unset",
      width: "unset",
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      margin: 0,
      maxWidth: "unset",
      width: "unset",
    },
  },
  button: {
    alignItems: "center",
    borderRadius: 4,
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: 45,
    justifyContent: "center",
    marginLeft: 16,
    marginRight: 16,
    outline: "none",
    width: 141,
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
  icon: {
    marginRight: 20,
    fontSize: 18,
    width: 40,
    color: "#FFF",
    textAlign: "center",
  },
  burgerIcon: {
    cursor: "pointer",
    fontSize: 20,
    height: "100%",
    marginRight: 16,
    lineHeight: "16px",
    textAlign: "center",
  },
  oauthContainer: {
    position: "relative",
    alignItems: "center",
    minWidth: 160,
  },
  xsmallDownTitle: {
    display: "none",
    width: 0,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "flex",
      marginLeft: 0,
      justifyContent: "space-between",
      alignItems: "center",
    },
  },
  xsmallUpTitle: {
    display: "block",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
      width: 0,
    },
  },
  slidingPaneBody: {
    display: "none",
    width: 0,
    padding: 0,
    zIndex: 30,
    overflow: "auto",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      background: colors.GREY_ICY_BLUE_HUE,
      display: "block",
      width: 240,
    },
  },
  slidingPaneOverlay: {
    display: "none",
    zIndex: 4,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "block",
      width: "100%",
    },
  },
  slideLeftPaneOnXSmall: {
    display: "none",
    width: 0,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "block",
    },
  },
  rhLogoNav: {
    width: 140,
    position: "absolute",
    width: "auto",
    transform: "translateX(-50%)",
    left: "50%",
    top: 15,
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
  getUser: AuthActions.getUser,
  signout: AuthActions.signout,
  openUploadPaperModal: ModalActions.openUploadPaperModal,
  openSignUpModal: ModalActions.openSignUpModal,
  updateUser: AuthActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
