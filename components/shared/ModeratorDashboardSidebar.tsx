import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faFlag,
  faUserEdit,
  faUser,
  faBookOpen,
} from "@fortawesome/pro-solid-svg-icons";
import { faCoin } from "@fortawesome/pro-duotone-svg-icons";
import { filterNull } from "~/config/utils/nullchecks";
import { Fragment, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { styles } from "~/pages/leaderboard/LeaderboardPage";
import { useRouter } from "next/router";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";

import Link from "next/link";
import Ripples from "react-ripples";
import { NavbarContext } from "~/pages/Base";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import api, { generateApiUrl } from "~/config/api";
import { getCaseCounts } from "../AuthorClaimCaseDashboard/api/AuthorClaimCaseGetCounts";

type Props = {};

export default function ModeratorDashboardSidebar({}: Props) {
  const router = useRouter();
  const currentPath = router.pathname;
  const currentUser = getCurrentUser();
  const [authorClaimCount, setAuthorClaimCount] = useState(0);
  const { numNavInteractions, numProfileDeletes, setNumProfileDeletes } =
    useContext(NavbarContext);
  const isUserModerator = Boolean(currentUser?.moderator);
  const isUserHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);
  const userAllowedOnPermissionsDash = gateKeepCurrentUser({
    application: "PERMISSIONS_DASH",
    shouldRedirect: false,
  });
  const userAllowedSendRSC = gateKeepCurrentUser({
    application: "SEND_RSC",
    shouldRedirect: false,
  });

  useEffect(() => {
    getCaseCounts({
      onSuccess: (counts) => {
        setAuthorClaimCount(counts.OPEN);
      },
    });
  }, []);

  const SIDE_BAR_ITEMS = filterNull([
    isUserModerator
      ? {
          icon: <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>,
          id: "author-claim-case-dashboard",
          name: "Author Claim",
          pathname: "/moderators/author-claim-case-dashboard",
          extraHTML:
            authorClaimCount > 0 ? (
              <span className={css(style.count)}>{authorClaimCount}</span>
            ) : null,
        }
      : null,
    isUserModerator
      ? {
          icon: <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>,
          id: "editors",
          name: "Editors",
          pathname: "/moderators/editors",
        }
      : null,
    userAllowedOnPermissionsDash
      ? {
          icon: <FontAwesomeIcon icon={faUserEdit}></FontAwesomeIcon>,
          id: "permissions",
          name: "Update Editors",
          pathname: "/moderators/permissions",
        }
      : null,
    userAllowedSendRSC
      ? {
          icon: <FontAwesomeIcon icon={faCoin}></FontAwesomeIcon>,
          id: "rsc",
          name: "Manage RSC",
          pathname: "/moderators/rsc",
        }
      : null,
    isUserHubEditor || isUserModerator
      ? {
          icon: <FontAwesomeIcon icon={faFlag}></FontAwesomeIcon>,
          id: "flag",
          name: "Flagged Content",
          pathname: "/moderators/audit/flagged",
          extraHTML:
            numNavInteractions > 0 ? (
              <span className={css(style.count)}>{numNavInteractions}</span>
            ) : null,
        }
      : null,
  ]);

  const listItems = SIDE_BAR_ITEMS.map(
    ({ name, id, type, icon, pathname, extraHTML }, index) => (
      <Ripples
        className={css(
          styles.sidebarEntry,
          currentPath.includes(pathname) && styles.current,
          index === SIDE_BAR_ITEMS.length - 1 && styles.last
        )}
        key={`listItem-${id}`}
      >
        <Link
          href={{ pathname }}
          as={pathname}
          className={css(styles.sidebarLink)}
        >
          <span className={css(styles.icon)}>{icon}</span>
          {name} {extraHTML}
        </Link>
      </Ripples>
    )
  );

  return <Fragment>{listItems}</Fragment>;
}

const style = StyleSheet.create({
  count: {
    backgroundColor: colors.RED(),
    color: "white",
    fontSize: 10,
    padding: 3,
    borderRadius: "50%",
    marginLeft: 5,
    width: 12,
    height: 12,
    textAlign: "center",
  },
});
