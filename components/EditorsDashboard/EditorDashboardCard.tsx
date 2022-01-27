import { css, StyleSheet } from "aphrodite";
import AuthorAvatar from "../AuthorAvatar";
import colors from "~/config/themes/colors";
import Link from "next/link";
import numeral from "numeral";
import { ID } from "~/config/types/root_types";
import { breakpoints } from "~/config/themes/screen";
import { timeAgo } from "~/config/utils/dates";

type Props = {
  authorProfile: any;
  commentCount: number;
  editorAddedDate: string;
  index: number;
  lastCommentDate: string;
  lastSubmissionDate: string;
  submissionCount: number;
  supportCount: number;
  userID?: ID;
};

export default function EditorDashboardUserCard({
  authorProfile,
  commentCount,
  editorAddedDate,
  index,
  lastCommentDate,
  lastSubmissionDate,
  submissionCount,
  supportCount,
}: Props) {
  const { id: authorID, first_name, last_name } = authorProfile;
  return (
    <Link href={"/user/[authorId]/[tabName]"} as={`/user/${authorID}/overview`}>
      <a className={css(styles.link)}>
        <div className={css(styles.container, index === 0 && styles.borderTop)}>
          <div className={css(styles.nameSection)}>
            <AuthorAvatar author={authorProfile} disableLink={true} size={35} />
            <div>
              <div className={css(styles.name) + " clamp1"}>
                {`${first_name ?? ""} ${last_name ?? ""}`}
              </div>
              <div className={css(styles.added)}>
                <span className={css(styles.countResponse)}>
                  added {timeAgo.format(new Date(editorAddedDate ?? null))}
                </span>
              </div>
            </div>
          </div>
          <div className={css(styles.contributionSection)}>
            <div className={css(styles.countLabel, styles.submissionLabel)}>
            <span className={css(styles.mobileLabel)}>
                Last Submission
              </span>
              <span className={css(styles.countResponse)}>
                {lastSubmissionDate
                  ? timeAgo.format(new Date(lastSubmissionDate))
                  : "never"}
              </span>
            </div>
            <div className={css(styles.countLabel, styles.submissionLabel)}>
            <span className={css(styles.mobileLabel)}>
                Last Comment
              </span>
              <span className={css(styles.countResponse)}>
                {lastCommentDate
                  ? timeAgo.format(new Date(lastCommentDate))
                  : "never"}
              </span>
            </div>
            <div className={css(styles.countLabel, styles.submissionLabel)}>
              <span className={css(styles.mobileLabel)}>
                Submissions
              </span>
              <span className={css(styles.countResponse)}>
                {submissionCount}
              </span>
            </div>
            <div className={css(styles.countLabel, styles.supportLabel)}>
            <span className={css(styles.mobileLabel)}>
                Supports
              </span>
              <span className={css(styles.countResponse)}>{supportCount}</span>
            </div>
            <div className={css(styles.countLabel)}>
            <span className={css(styles.mobileLabel)}>
                Comments
              </span>
              <span className={css(styles.countResponse)}>{commentCount}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFF",
    border: `1px solid ${colors.GREY(0.5)}`,
    cursor: "pointer",
    display: "flex",
    borderTop: 0,
    justifyContent: "space-between",
    minHeight: 72,
    padding: "0px 16px",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      maxWidth: "unset",
      overflow: 'auto',
      display: 'inline-flex',
      flexDirection: 'column',
      padding: 16,
    },
  },
  borderTop: {
    borderTop: `1px solid ${colors.GREY(0.5)}`,
  },
  contributionSection: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: 16,
    height: 40,
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      flexDirection: 'column',
      height: 'unset',
      alignItems: 'flex-end',
      justifyContent: 'unset',
    },
  },
  added: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: 500,
    opacity: .8,
    marginTop: 4,
  },
  countLabel: {
    fontSize: 16,
    fontWeight: 500,
    paddingRight: 50,
    width: 100,
    textAlign: "center",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      paddingRight: 0,
      textAlign: 'right',
      width: '100%',
      marginTop: 8,
      display: 'flex',
    },
  },
  mobileLabel: {
    marginRight: 'auto',
    color: 'rgb(36, 31, 58)',
    opacity: .5,

    "@media only screen and (min-width: 768px)": {
      display: 'none',
    }
  },
  supportLabel: {},
  submissionLabel: {},
  countResponse: { color: colors.TEXT_GREY(1) },
  nameSection: {
    display: "flex",
    alignItems: "center",
    fontSize: 20,
    width: "100%",
  },
  link: {
    width: "100%",
    color: colors.BLACK(1),
    textDecoration: "none",
  },
  name: {
    marginLeft: 16,
    fontWeight: 500,
  },
  rep: {
    marginLeft: "auto",
    fontWeight: 500,
  },
});
