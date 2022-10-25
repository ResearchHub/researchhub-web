import "react-sliding-pane/dist/react-sliding-pane.css";
import { AuthActions } from "../redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { deSlug } from "~/config/utils/deSlug";
import { formatMainHeader } from "./UnifiedDocFeed/UnifiedDocFeedUtil";
import { ModalActions } from "../redux/modals";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import { useState, Fragment, useRef, useEffect } from "react";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import GoogleLoginButton from "../components/GoogleLoginButton";
import icons from "~/config/themes/icons";
import NavbarRightButtonGroup from "./Home/NavbarRightButtonGroup";
import NewPostButton from "./NewPostButton";
import PaperUploadStateNotifier from "~/components/Notifications/PaperUploadStateNotifier.tsx";
import RhSearchBar from "./SearchV2/RhSearchBar";
import RootLeftSidebarSlider from "~/components/Home/sidebar/RootLeftSidebarSlider";
import SlidingPane from "react-sliding-pane";
import UserStateBanner from "./Banner/UserStateBanner";
import RHLogo from "./Home/RHLogo";

const DndModal = dynamic(() => import("~/components/Modals/DndModal"));
const FirstVoteModal = dynamic(() =>
  import("~/components/Modals/FirstVoteModal")
);
const LoginModal = dynamic(() => import("~/components/Modals/LoginModal"));
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
  const router = useRouter();
  const navbarRef = useRef(null);
  const { isLoggedIn, user, authChecked, auth, updateUser } = props;
  const [shouldShowSlider, setShouldShowSlider] = useState(false);

  const pathname = router?.pathname ?? "";
  const headerLabel = pathname.includes("notebook")
    ? "Lab Notebook"
    : pathname.includes("leaderboard")
    ? "Leaderboard"
    : deSlug(router?.query?.slug ?? "");

  useEffect(() => {
    setShouldShowSlider(false);
  }, [pathname]);

  const researchhubTitle = (
    <Fragment>
      <div className={css(styles.xsmallUpTitle)}>
        {formatMainHeader({
          label: headerLabel,
          isHomePage: !Boolean(headerLabel),
        })}
      </div>
      <div className={css(styles.xsmallDownTitle)}>
        <div
          className={css(styles.burgerIcon)}
          onClick={() => setShouldShowSlider(!shouldShowSlider)}
        >
          {icons.burgerMenu}
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
            {!isLoggedIn ? (
              <div className={css(styles.oauthContainer)}>
                <GoogleLoginButton
                  styles={[
                    styles.button,
                    styles.googleLoginButton,
                    styles.login,
                  ]}
                  iconStyle={styles.googleIcon}
                  customLabelStyle={[styles.googleLabel]}
                  isLoggedIn={isLoggedIn}
                  disabled={!authChecked}
                />
                <div className={css(styles.divider)}></div>
              </div>
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
      </div>
      <UserStateBanner />
    </Fragment>
  );
};

const styles = StyleSheet.create({
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
    zIndex: 4,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 20,
      justifyContent: "space-between",
    },
  },
  unstickyNavbar: {
    position: "initial",
  },
  buttonRight: {
    marginRight: 8,
    "@media only screen and (min-width: 1024px)": {
      marginLeft: 20,
    },
  },
  googleLoginButton: {
    margin: 0,
    marginLeft: 16,
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
  banner: {
    textDecoration: "none",
  },
  divider: {
    width: 5,
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
    marginTop: 4, // arbitrary to match nav visual
    textAlign: "center",
  },
  oauthContainer: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    minWidth: 160,
  },
  xsmallDownTitle: {
    display: "none",
    width: 0,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "flex",
      marginLeft: 0,
      width: "62%",
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
  rhLogoNav: { width: 140 },
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
