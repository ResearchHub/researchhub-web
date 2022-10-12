import { AuthActions } from "~/redux/auth";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { Helpers } from "@quantfive/js-web-config";
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
import api from "~/config/api";
import AuthorAvatar from "../AuthorAvatar";
import colors from "~/config/themes/colors";
import getFlagCountAPI from "../Flag/api/getFlagCountAPI";
import icons from "~/config/themes/icons";
import Link from "next/link";
import Notification from "~/components/Notifications/Notification";
import RscBalanceButton from "./RscBalanceButton";

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
  const [showReferral, setShowReferral] = useState(false);
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

  useEffect(() => {
    function fetchReferrals() {
      return fetch(api.SHOW_REFERRALS(), api.GET_CONFIG())
        .then(Helpers.checKStatus)
        .then(Helpers.parseJSON)
        .then((res: any) => {
          setShowReferral(res.show_referral);
        });
    }
    isLoggedIn && fetchReferrals();
  }, [isLoggedIn]);

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
              <Link href={"/moderators/audit/flagged"}>
                <a className={css(styles.modBtn)}>
                  {icons.shield}
                  {openCaseCounts > 0 && (
                    <div className={css(styles.notifCount)}>
                      {openCaseCounts}
                    </div>
                  )}
                </a>
              </Link>
            </div>
          )}
        </div>
        <div className={css(styles.buttonsGroup, styles.borderNone)}>
          <div className={css(styles.rscBalanceButton)}>
            <RscBalanceButton />
          </div>
          <div
            className={css(styles.avatarContainer)}
            ref={avatarRef}
            onClick={(): void => setIsMenuOpen(!isMenuOpen)}
          >
            <AuthorAvatar
              author={user?.author_profile}
              size={32}
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
          >
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon, styles.portraitIcon)}>
                {icons.portrait}
              </span>
              {"Profile"}
            </div>
          </Link>
          <Link href={`/${user?.organization_slug}/notebook`}>
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon)}>{icons.bookOpen}</span>
              {"Notebook"}
            </div>
          </Link>
          <Link href={"/settings"} as={`/settings`}>
            <div className={css(styles.option)}>
              <span className={css(styles.profileIcon)}>{icons.cog}</span>
              {"Settings"}
            </div>
          </Link>
          {showReferral && (
            <Link
              href={{
                pathname: "/referral",
              }}
            >
              <div className={css(styles.option)}>
                <span className={css(styles.profileIcon)}>
                  {icons.asterisk}
                </span>
                {"Referral Program"}
              </div>
            </Link>
          )}
          <div
            className={css(styles.option, styles.lastOption)}
            onClick={() => {
              signout({ walletLink });
            }}
          >
            <span className={css(styles.profileIcon)}>{icons.signOut}</span>
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
    ":hover": {
      background: colors.GREY(0.14),
    },
  },
  avatarDropdown: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    boxShadow: "rgba(129,148,167,0.2) 0px 3px 10px 0px",
    boxSizing: "border-box",
    position: "absolute",
    right: 0,
    top: 45,
    width: 225,
    zIndex: 3,
  },
  lastOption: {
    borderBottom: 0,
  },
  modBtnContainer: {
    marginBottom: 6,
    marginLeft: 24,
    position: "relative",
  },
  modBtn: {
    fontSize: 15,
    display: "inline-block",
    cursor: "pointer",
    color: colors.GREY(),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  navbarButtonContainer: {
    alignItems: "center",
    display: "flex",
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
    borderLeft: `1px solid ${colors.GREY(0.8)}`,
    borderRight: `1px solid ${colors.GREY(0.8)}`,
    boxSizing: "border-box",
    display: "flex",
    height: 24,
    justifyContent: "space-between",
    padding: "0 20px",
    "@media only screen and (max-width: 900px)": {
      marginLeft: 10,
    },
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
  rscBalanceButton: {
    cursor: "pointer",
    margin: "0 6px 0 0",
    padding: 8,
    borderRadius: 8,
    ":hover": {
      background: colors.GREY(0.14),
    },
  },
  userDropdown: {
    position: "relative",
    zIndex: 5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  borderNone: {
    borderLeft: "none !important",
    borderRight: "none !important",
    paddingRight: 8,
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
