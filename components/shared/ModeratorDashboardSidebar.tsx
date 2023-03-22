import { filterNull } from "~/config/utils/nullchecks";
import { Fragment, ReactElement, useContext, useEffect } from "react";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { styles } from "~/pages/leaderboard/LeaderboardPage";
import { useRouter } from "next/router";
import { useStore } from "react-redux";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";

import killswitch from "~/config/killswitch/killswitch";
import Link from "next/link";
import Ripples from "react-ripples";
import { NavbarContext } from "~/pages/Base";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

type Props = {};

export default function ModeratorDashboardSidebar({}: Props) {
  const router = useRouter();
  const currentPath = router.pathname;
  const currentUser = getCurrentUser();
  const { numNavInteractions } = useContext(NavbarContext);
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

  const SIDE_BAR_ITEMS = filterNull([
    isUserModerator
      ? {
          icon: icons.bookOpen,
          id: "author-claim-case-dashboard",
          name: "Author Claim",
          pathname: "/moderators/author-claim-case-dashboard",
        }
      : null,
    isUserModerator
      ? {
          icon: icons.subscribers,
          id: "editors",
          name: "Editors",
          pathname: "/moderators/editors",
        }
      : null,
    userAllowedOnPermissionsDash
      ? {
          icon: icons.userEdit,
          id: "permissions",
          name: "Update Editors",
          pathname: "/moderators/permissions",
        }
      : null,
    // TODO: kobe - take care of this
    // userAllowedToManagePeerReviews
    //   ? {
    //       icon: icons.commentCheck,
    //       id: "review",
    //       name: "Peer Reviews",
    //       pathname: "/moderators/reviews",
    //     }
    //   : null,
    userAllowedSendRSC
      ? {
          icon: icons.coin,
          id: "rsc",
          name: "Manage RSC",
          pathname: "/moderators/rsc",
        }
      : null,
    isUserHubEditor || isUserModerator
      ? {
          icon: icons.flag,
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
