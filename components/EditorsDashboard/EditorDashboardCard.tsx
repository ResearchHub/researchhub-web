import { css, StyleSheet } from "aphrodite";
import AuthorAvatar from "../AuthorAvatar";
import colors from "~/config/themes/colors";
import Link from "next/link";
import numeral from "numeral";
import { ID } from "~/config/types/root_types";

type Props = {
  userID?: ID;
  authorID?: ID;
  authorProfile: any;
  reputation?: number;
};

export default function EditorDashboardUserCard({
  authorProfile,
  reputation,
  authorID,
}: Props) {
  return (
    <div className={css(styles.container)}>
      <Link
        href={"/user/[authorId]/[tabName]"}
        as={`/user/${authorID}/overview`}
      >
        <a className={css(styles.link)}>
          <div className={css(styles.nameRow)}>
            <AuthorAvatar author={authorProfile} disableLink={true} size={35} />
            <div className={css(styles.name) + " clamp1"}>
              {authorProfile?.name}
            </div>
            {reputation ? (
              <div className={css(styles.rep)}>
                {numeral(reputation).format("0,0")}
              </div>
            ) : null}
          </div>
        </a>
      </Link>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    width: "100%",
  },
  link: {
    width: "100%",
    color: colors.BLACK(1),
    textDecoration: "none",
  },
  name: {
    marginLeft: 6,
    fontWeight: 500,
  },
  rep: {
    marginLeft: "auto",
    fontWeight: 500,
  },
});
