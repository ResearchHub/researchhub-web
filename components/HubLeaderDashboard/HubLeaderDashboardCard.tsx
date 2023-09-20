import { breakpoints } from "~/config/themes/screen";
import { buildSlug } from "~/config/utils/buildSlug";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { timeAgo } from "~/config/utils/dates";
import { toTitleCase } from "~/config/utils/string";
import colors from "~/config/themes/colors";
import Image from "next/image";
import Link from "next/link";

type Props = {
  commentCount: number;
  hubImage: string | null;
  index: number;
  lastCommentDate: string;
  lastSubmissionDate: string;
  name: string;
  submissionCount: number;
  supportCount: number;
  userID?: ID;
};

export default function HubLeaderDashboardCard({
  commentCount,
  hubImage,
  index,
  lastCommentDate,
  lastSubmissionDate,
  name,
  submissionCount,
  supportCount,
}: Props) {
  return (
    <Link
      href={"/hubs/[slug]"}
      as={`/hubs/${buildSlug(name)}`}
      className={css(styles.link)}
    >
      <div className={css(styles.container, index === 0 && styles.borderTop)}>
        <div className={css(styles.row)}>
          <div className={css(styles.nameSection)}>
            <img
              width={28}
              height={28}
              style={{
                width: 28,
                height: 28,
              }}
              alt={`${name} Hub`}
              src={hubImage ?? "/static/beaker.svg"}
            />
            <div className={css(styles.name) + " clamp1"}>
              {`${toTitleCase(name)}`}
            </div>
          </div>
          <div className={css(styles.contributionSection)}>
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
              <span className={css(styles.countResponse)}>{supportCount}</span>
            </div>
            <div className={css(styles.countLabel)}>
              <span className={css(styles.mobileLabel)}>Comments</span>
              <span className={css(styles.countResponse)}>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
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
    padding: "8px 16px",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
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
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
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
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
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
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      maxWidth: 500,
    },
  },
  name: {
    marginLeft: 16,
    // fontWeight: 500,
  },
  hubName: {
    marginTop: 4,
    marginLeft: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 0,
      marginTop: 8,
    },
  },
  rep: {
    marginLeft: "auto",
    fontWeight: 500,
  },
});
