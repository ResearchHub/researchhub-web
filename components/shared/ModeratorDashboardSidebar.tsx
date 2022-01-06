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

type Props = {};

export default function ModeratorDashboardSidebar({}: Props) {
  const reduxStore = useStore();
  const router = useRouter();
  const currentPath = router.pathname;

  const userAllowedOnPermissionsDash = gateKeepCurrentUser({
    application: "PERMISSIONS_DASH",
    auth: reduxStore?.getState()?.auth ?? null,
    shouldRedirect: false,
  });

  console.warn("currentPath: ", currentPath);
  const items = filterNull([
    {
      icon: icons.userEdit,
      id: "author-claim-case-dashboard",
      name: "Author Claim",
      pathname: "/moderators/author-claim-case-dashboard",
    },
    {
      icon: icons.subscribers,
      id: "editors",
      name: "Editors",
      pathname: "/moderators/editors",
    },
    userAllowedOnPermissionsDash
      ? {
          icon: icons.bookOpen,
          id: "permissions",
          name: "Update Editors",
          pathname: "/moderators/permissions",
        }
      : null,
  ]).map(({ name, id, type, icon, pathname }, index) => (
    <Ripples
      className={css(
        styles.sidebarEntry,
        type === id && styles.current
        // index === SIDE_BAR_ITEMS.length - 1 && styles.last
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
  ));
  return <Fragment>{items}</Fragment>;
}
