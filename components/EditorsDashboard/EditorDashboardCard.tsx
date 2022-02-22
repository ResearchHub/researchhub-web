import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { timeAgo } from "~/config/utils/dates";
import { toTitleCase } from "~/config/utils/string";
import AuthorAvatar from "../AuthorAvatar";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import Link from "next/link";
import UserRoleTag from "../shared/UserRoleTag";

type Props = {
  authorProfile: any;
  commentCount: number;
  editorAddedDate: string;
  index: number;
  lastCommentDate: string;
  lastSubmissionDate: string;
  submissionCount: number;
  supportCount: number;
  activeHubContributorCount: number;
  previousActiveHubContributorCount: number;
  userID?: ID;
};

export default function EditorDashboardUserCard({
  authorProfile,
  commentCount,
  editorAddedDate,
  index,
  lastCommentDate,
  lastSubmissionDate,
  activeHubContributorCount,
  previousActiveHubContributorCount,
  submissionCount,
  supportCount,
}: Props) {
  const calcPercentDiff = (current, previous): number => {
    if (current === 0) {
      if (previous > 0) {
        return -100;
      } else if (previous === 0) {
        return 0;
      }
    }

    const val = (current - previous) / Math.max(current, previous);
    const percent = (val * 100).toFixed(1);
    return parseFloat(percent);
  };

  const getHubActiveContributorsHTML = () => {
    const contributorPctDiff = calcPercentDiff(
      activeHubContributorCount,
      previousActiveHubContributorCount
    );

    return (
      <span
        className={css(
          styles.contributorPercentDiff,
          contributorPctDiff > 0
            ? styles.contributorUpChange
            : contributorPctDiff < 0
            ? styles.contributorDownChange
            : styles.contributorNoChange
        )}
      >
        <span>
          {contributorPctDiff > 0 ? (
            <span>{icons.caretUp}</span>
          ) : contributorPctDiff < 0 ? (
            <span>{icons.caretDown}</span>
          ) : null}
        </span>
        &nbsp;
        {Math.abs(contributorPctDiff)}%
      </span>
    );
  };

  const hubActiveContributorsHTML = getHubActiveContributorsHTML();
  const {
    id: authorID,
    first_name,
    last_name,
    is_hub_editor_of: isHubEditorOf,
  } = authorProfile;
  const hubNameTags = (isHubEditorOf ?? [])
    .map((hub: any): string => toTitleCase(hub?.name ?? ""))
    .map((hubName: string, index: number) => (
      <UserRoleTag
        backgroundColor={colors.EDITOR_TAG_BACKGROUND}
        color={colors.EDITOR_TAG_TEXT}
        fontSize="12px"
        key={`${hubName}-${index}`}
        label={hubName}
        margin="0 8px 0 0"
        padding="2px 10px"
      />
    ));
  return (
    <Link href={"/user/[authorId]/[tabName]"} as={`/user/${authorID}/overview`}>
      <a className={css(styles.link)}>
        <div className={css(styles.container, index === 0 && styles.borderTop)}>
          <div className={css(styles.row)}>
            <div className={css(styles.nameSection)}>
              <AuthorAvatar
                author={authorProfile}
                disableLink={true}
                size={35}
              />
              <div>
                <div className={css(styles.name) + " clamp1"}>
                  {`${first_name ?? ""} ${last_name ?? ""}`}
                </div>
                <div className={css(styles.added)}>
                  <span className={css(styles.countResponse)}>
                    added {timeAgo.format(new Date(editorAddedDate ?? null))}
                  </span>
                </div>
                {activeHubContributorCount !== null && (
                  <div className={css(styles.contributorCountWrapper)}>
                    <span className={css(styles.contributorCount)}>
                      active hub contributors: {activeHubContributorCount}
                    </span>
                    {hubActiveContributorsHTML}
                  </div>
                )}
              </div>
            </div>
            <div className={css(styles.contributionSection)}>
              {activeHubContributorCount !== null && (
                <div
                  className={css(
                    styles.countLabel,
                    styles.contributorCountLabel
                  )}
                >
                  <span className={css(styles.mobileLabel)}>
                    Hub Active Contributors
                  </span>
                  <span className={css(styles.countResponse)}>
                    <span className={css(styles.contributorCount)}>
                      {activeHubContributorCount}
                    </span>
                    {hubActiveContributorsHTML}
                  </span>
                </div>
              )}
              <div className={css(styles.countLabel, styles.submissionLabel)}>
                <span className={css(styles.mobileLabel)}>Last Submission</span>
                <span className={css(styles.countResponse)}>
                  {lastSubmissionDate
                    ? timeAgo.format(new Date(lastSubmissionDate))
                    : "never"}
                </span>
              </div>
              <div className={css(styles.countLabel, styles.submissionLabel)}>
                <span className={css(styles.mobileLabel)}>Last Comment</span>
                <span className={css(styles.countResponse)}>
                  {lastCommentDate
                    ? timeAgo.format(new Date(lastCommentDate))
                    : "never"}
                </span>
              </div>
              <div className={css(styles.countLabel)}>
                <span className={css(styles.mobileLabel)}>Submissions</span>
                <span className={css(styles.countResponse)}>
                  {submissionCount}
                </span>
              </div>
              <div className={css(styles.countLabel, styles.supportLabel)}>
                <span className={css(styles.mobileLabel)}>Supports</span>
                <span className={css(styles.countResponse)}>
                  {supportCount}
                </span>
              </div>
              <div className={css(styles.countLabel)}>
                <span className={css(styles.mobileLabel)}>Comments</span>
                <span className={css(styles.countResponse)}>
                  {commentCount}
                </span>
              </div>
            </div>
          </div>
          <div className={css(styles.hubName) + " clamp1"}>{hubNameTags}</div>
        </div>
      </a>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.GREY(0.5)}`,
    borderTop: 0,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    minHeight: 72,
    padding: "8px 16px",
    [`@media only screen and (max-width: 1023px)`]: {
      boxSizing: "border-box",
      display: "inline-flex",
      overflow: "auto",
      padding: 16,
      width: "100%",
    },
  },
  row: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    [`@media only screen and (max-width: 1023px)`]: {
      display: "inline-flex",
      flexDirection: "column",
      width: "100%",
      boxSizing: "border-box",
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
    [`@media only screen and (max-width: 1023px)`]: {
      flexDirection: "column",
      height: "unset",
      alignItems: "flex-end",
      justifyContent: "unset",
    },
  },
  added: {
    marginLeft: 16,
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.8,
    marginTop: 4,
  },
  contributorPercentDiff: {
    marginLeft: 10,
  },
  contributorCountWrapper: {
    marginLeft: 16,
    fontSize: 14,
    marginTop: 4,
    fontWeight: 500,
    color: colors.TEXT_GREY(0.8),
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      display: "none",
    },
  },
  contributorCount: {},
  contributorUpChange: {
    color: `rgb(25 160 40)`,
  },
  contributorNoChange: {
    color: `${colors.ORANGE()}`,
  },
  contributorDownChange: {
    color: `${colors.RED()}`,
  },
  countLabel: {
    fontSize: 16,
    fontWeight: 500,
    paddingRight: 50,
    width: 100,
    textAlign: "center",
    [`@media only screen and (max-width: ${breakpoints.bigDesktop.str})`]: {
      width: 50,
      paddingRight: 50,
      // fontSize: 14,
    },
    [`@media only screen and (max-width: ${breakpoints.desktop.int - 1}px)`]: {
      paddingRight: 0,
      textAlign: "right",
      width: "100%",
      marginTop: 8,
      display: "flex",
    },
  },
  mobileLabel: {
    marginRight: "auto",
    color: "rgb(36, 31, 58)",
    opacity: 0.5,

    [`@media only screen and (min-width: ${breakpoints.desktop.int}px)`]: {
      display: "none",
    },
  },
  supportLabel: {},
  contributorCountLabel: {
    [`@media only screen and (min-width: ${breakpoints.desktop.str})`]: {
      display: "none",
    },
  },
  submissionLabel: {
    [`@media only screen and (max-width: ${breakpoints.bigDesktop.str})`]: {
      width: 100,
      paddingright: 0,
      // fontSize: 14,
    },
    [`@media only screen and (max-width: ${breakpoints.desktop.int - 1}px)`]: {
      width: "100%",
      paddingRight: 0,
    },
  },
  countResponse: { color: colors.TEXT_GREY(1) },
  nameSection: {
    display: "flex",
    alignItems: "center",
    fontSize: 20,
    width: "100%",

    [`@media only screen and (max-width: ${breakpoints.mobile.str})`]: {
      justifyContent: "center",
      marginBottom: 4,
    },
  },
  link: {
    width: "100%",
    color: colors.BLACK(1),
    textDecoration: "none",

    [`@media only screen and (max-width: 1023px)`]: {
      maxWidth: 500,
    },
  },
  name: {
    marginLeft: 16,
    fontWeight: 500,
  },
  hubName: {
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.8,
    marginTop: 4,
  },
  rep: {
    marginLeft: "auto",
    fontWeight: 500,
  },
});
