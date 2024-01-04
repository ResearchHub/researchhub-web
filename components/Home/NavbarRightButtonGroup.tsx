import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/pro-duotone-svg-icons";
import {
  faAsterisk,
  faCog,
  faBookOpen,
  faPortrait,
  faShieldHalved,
} from "@fortawesome/pro-solid-svg-icons";

import { AuthActions } from "~/redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getCaseCounts } from "~/components/AuthorClaimCaseDashboard/api/AuthorClaimCaseGetCounts";
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import AuthorAvatar from "../AuthorAvatar";
import colors, { mainNavIcons } from "~/config/themes/colors";
import getFlagCountAPI from "../Flag/api/getFlagCountAPI";

import Link from "next/link";
import Notification from "~/components/Notifications/Notification";
import RscBalanceButton from "./RscBalanceButton";
import { faScrewdriverWrench } from "@fortawesome/pro-light-svg-icons";

type Props = {
  // intentionally accessing redux directly because functional call to redux is problematic at server level
  signout: any /* redux */;
  user: any /* redux */;
  walletLink: any /* redux */;
};

function NavbarRightButtonGroup({
  signout,
  user,
  walletLink,
}: Props): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openCaseCounts, setOpenCaseCounts] = useState(0);
  const avatarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = user?.id ?? null;
  const isUserModerator = Boolean(user?.moderator);
  const isUserHubEditor = Boolean(user?.author_profile?.is_hub_editor);

  useEffect((): (() => void) => {
    const handleOutsideClick = (event): void => {
      if (
        !dropdownRef.current?.contains(event.target) &&
        !avatarRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownRef, avatarRef]);

  useEffect((): void => {
    let [caseCount, flagCount] = [{}, 0];
    if (isUserModerator) {
      caseCount = getCaseCounts({ onSuccess: silentEmptyFnc }) ?? {};
    }
    if (isUserModerator || isUserHubEditor) {
      flagCount = getFlagCountAPI() ?? 0;
    }
    const totalCount = (caseCount["OPEN"] ?? 0) + flagCount;
    setOpenCaseCounts(totalCount);
  }, [isUserModerator, isUserHubEditor]);

  return (
    <div className={css(styles.userDropdown)}>
      <div className={css(styles.navbarButtonContainer)}>
        <div
          className={css(styles.buttonsGroup)}
          onClick={(event: SyntheticEvent): void => event.stopPropagation()}
        >
          <Notification
            // @ts-ignore legacy
            wsUrl={WS_ROUTES.NOTIFICATIONS(user?.id)}
            // @ts-ignore legacy
            wsAuth
          />
          {(isUserModerator || isUserHubEditor) && (
            <div className={css(styles.modBtnContainer)}>
              <Link
                href={"/moderators/audit/flagged"}
                className={css(styles.modBtn)}
              >
                {<FontAwesomeIcon icon={faScrewdriverWrench}></FontAwesomeIcon>}
                {openCaseCounts > 0 && (
                  <div className={css(styles.notifCount)}>{openCaseCounts}</div>
                )}
              </Link>
            </div>
          )}
        </div>
        <div
          className={css(
            styles.buttonsGroup,
            styles.borderNone,
            styles.avatarContainerGroup,
            styles.noPaddingLeft
          )}
        >
          <RscBalanceButton />
          <div
            className={css(styles.avatarContainer)}
            ref={avatarRef}
            onClick={(): void => setIsMenuOpen(!isMenuOpen)}
          >
            <AuthorAvatar
              author={user?.author_profile}
              showBadgeIfVerified={true}
              size={34}
              disableLink
              showModeratorBadge={user?.moderator}
            />
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={css(styles.avatarDropdown)}
          ref={dropdownRef}
          onClick={(): void => setIsMenuOpen(!isMenuOpen)}
        >
          <Link
            href={"/user/[authorId]/[tabName]"}
            as={`/user/${user?.author_profile.id}/overview`}
            legacyBehavior
          >
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon, styles.portraitIcon)}>
                {<FontAwesomeIcon icon={faPortrait}></FontAwesomeIcon>}
              </span>
              {"Profile"}
            </div>
          </Link>
          <Link href={`/${user?.organization_slug}/notebook`} legacyBehavior>
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon)}>
                {<FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>}
              </span>
              {"Notebook"}
            </div>
          </Link>
          <Link href={"/settings"} as={`/settings`} legacyBehavior>
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon)}>
                {<FontAwesomeIcon icon={faCog}></FontAwesomeIcon>}
              </span>
              {"Settings"}
            </div>
          </Link>
          {/* <Link
            href={{
              pathname: "/referral",
            }}
            legacyBehavior
          >
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon)}>
                {<FontAwesomeIcon icon={faAsterisk}></FontAwesomeIcon>}
              </span>
              {"Referral Program"}
            </div>
          </Link> */}
          <div
            className={css(styles.option, styles.lastOption)}
            onClick={() => {
              signout({ walletLink });
            }}
          >
            <span className={css(styles.profileIcon)}>
              {<FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>}
            </span>
            <span>{"Logout"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    margin: "0 8px 0 8px",
    padding: 4,
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingRight: 0,
      marginRight: 0,
      marginLeft: 6,
    }
  },
  avatarDropdown: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    boxShadow: "rgba(129,148,167,0.2) 0px 3px 10px 0px",
    boxSizing: "border-box",
    position: "absolute",
    right: 20,
    top: 32,
    width: 225,
    zIndex: 3,
  },
  lastOption: {
    borderBottom: 0,
  },
  modBtnContainer: {
    marginLeft: 20,
    position: "relative",
    fontSize: 18,
  },
  modBtn: {
    fontSize: 21,
    display: "inline-block",
    cursor: "pointer",
    color: mainNavIcons.color,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  navbarButtonContainer: {
    alignItems: "center",
    display: "flex",
    fontSize: 18,
  },
  notifCount: {
    alignItems: "center",
    backgroundColor: colors.BLUE(),
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    float: "left",
    fontSize: 8,
    height: 8,
    justifyContent: "center",
    maxHeight: 8,
    maxWidth: 8,
    minHeight: 8,
    minWidth: 8,
    padding: 3,
    position: "absolute",
    right: -6,
    top: 3,
    width: 8,
  },
  buttonsGroup: {
    alignItems: "center",
    borderRight: `1px solid ${colors.GREY(0.8)}`,
    boxSizing: "border-box",
    display: "flex",
    height: 21,
    fontSize: 18,
    justifyContent: "space-between",
    padding: "0 20px",
    borderLeft: `1px solid ${colors.GREY(0.8)}`,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      borderLeft: "none",
    },
  },
  avatarContainerGroup: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingRight: 0,
      marginRight: 0,
    }
  },
  option: {
    width: "100%",
    padding: 16,
    boxSizing: "border-box",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    letterSpacing: 0.7,
    color: colors.TEXT_GREY(1),
    fontWeight: 500,
    fontSize: 15,
    ":hover": {
      background: "#eee",
    },
  },
  profileIcon: {
    color: colors.TEXT_GREY(1),
    marginRight: 16,
  },
  portraitIcon: {
    fontSize: "1.2em",
  },
  userDropdown: {
    position: "relative",
    zIndex: 5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      // display: "none",
    },
  },
  borderNone: {
    borderLeft: "none !important",
    borderRight: "none !important",
    paddingRight: 8,
  },
  noPaddingLeft: {
    marginLeft: 0,
    "@media only screen and (max-width: 900px)": {
      marginLeft: 0,
      paddingLeft: 12,
    },
  },
});

const mapDispatchToProps = {
  signout: AuthActions.signout,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  walletLink: state.auth.walletLink,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavbarRightButtonGroup);
