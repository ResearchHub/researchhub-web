import { Fragment, ReactElement } from "react";
import { useStore } from "react-redux";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";
import icons from "~/config/themes/icons";
import Link from "next/link";
import { filterNull } from "~/config/utils/nullchecks";
import Ripples from "react-ripples";
import { styles } from "~/pages/leaderboard/LeaderboardPage";
import { useRouter } from "next/router";
import { css } from "aphrodite";
import killswitch from "~/config/killswitch/killswitch";
import { getCurrentUser } from "~/config/utils/getCurrentUser";

type Props = {};

export default function ModeratorDashboardSidebar({}: Props) {
  const reduxStore = useStore();
  const router = useRouter();
  const currentPath = router.pathname;
  const reduxState = reduxStore?.getState();
  const currentUser = getCurrentUser();

  const isUserModerator = Boolean(currentUser?.moderator);
  const isUserHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);
  const userAllowedOnPermissionsDash = gateKeepCurrentUser({
    application: "PERMISSIONS_DASH",
    auth: reduxState?.auth ?? null,
    shouldRedirect: false,
  });
  const userAllowedSendRSC = gateKeepCurrentUser({
    application: "SEND_RSC",
    auth: reduxState?.auth ?? null,
    shouldRedirect: false,
  });

  const userAllowedToManagePeerReviews = killswitch("peerReview");

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
    userAllowedToManagePeerReviews
      ? {
          icon: icons.commentCheck,
          id: "review",
          name: "Peer Reviews",
          pathname: "/moderators/reviews",
        }
      : null,
    isUserHubEditor
      ? {
          icon: icons.commentCheck,
          id: "audit",
          name: "Audit Content",
          pathname: "/moderators/audit/all",
        }
      : null,
    isUserHubEditor
      ? {
          icon: icons.flag,
          id: "flag",
          name: "Flagged Content",
          pathname: "/moderators/audit/flagged",
        }
      : null,
  ]);

  const listItems = SIDE_BAR_ITEMS.map(
    ({ name, id, type, icon, pathname }, index) => (
      <Ripples
        className={css(
          styles.sidebarEntry,
          currentPath.includes(pathname) && styles.current,
          index === SIDE_BAR_ITEMS.length - 1 && styles.last
        )}
        key={`listItem-${id}`}
      >
        <Link href={{ pathname }} as={pathname}>
          <a className={css(styles.sidebarLink)}>
            <span className={css(styles.icon)}>{icon}</span>
            {name}
          </a>
        </Link>
      </Ripples>
    )
  );

  return <Fragment>{listItems}</Fragment>;
}
