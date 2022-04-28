import AuthorAvatar from "~/components/AuthorAvatar";
import DiscussionEntry from "~/components/Threads/DiscussionEntry";
import FeedCard from "~/components/Author/Tabs/FeedCard";
import Link from "next/link";
import colors, { genericCardColors } from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { truncateText } from "~/config/utils/string";
import {
  getNewestCommentTimestamp,
  formatTimestamp,
  getDocType,
  getDocFromItem,
  getUrlFromItem,
  getCardType,
} from "./utils/AuthorFeedUtils";

const AuthorFeedItem = ({
  author,
  item,
  itemType,
  itemIndex,
  paperVoteCallback,
}) => {
  const getCardHTML = ({ item, itemType }) => {
    const doc = getDocFromItem(item, itemType);
    const cardType = getCardType({ item, itemType });
    const key = `${itemType}-${cardType}-${doc.id}`;
    const url = getUrlFromItem(item, itemType);

    let html;
    switch (cardType) {
      case "paper":
      case "post":
      case "hypothesis":
        html = (
          <FeedCard
            formattedDocType={cardType}
            index={itemIndex}
            key={key}
            paper={doc}
            singleCard
            user_vote={doc?.user_vote}
            voteCallback={paperVoteCallback}
            {...doc}
          />
        );
        break;
      case "comment":
        const data =
          item.contribution_type === "SUPPORTER"
            ? item.source.source
            : item.source;
        const uniDoc = item.unified_document;
        const docType = getDocType({ uniDoc });

        // If paper we need to shim things around
        // so that component works properly
        if (data?.paper?.id) {
          data.paper = data?.paper?.id;
        }

        html = (
          <div className={css(styles.discussionEntryCard)}>
            <DiscussionEntry
              key={`thread-${doc.id}-${item.id}`}
              data={data}
              hostname={process.env.HOST}
              currentAuthor={author}
              path={url}
              mobileView={false}
              documentType={docType}
              paper={doc.id}
              hypothesis={doc}
              post={doc}
              context="AUTHOR_PROFILE"
            />
          </div>
        );
        break;
      default:
      // TODO: Log error in sentry
    }

    return html;
  };

  const buildActionLineHTML = ({ item, itemType, author }) => {
    const cardType = getCardType({ item, itemType });
    let actionText = null;
    if (itemType === "CONTRIBUTION" && item.contribution_type === "COMMENTER") {
      if (item.source?.review?.id) {
        actionText = `reviewed`;
      } else {
        actionText = `commented`;
      }
    } else if (
      itemType === "CONTRIBUTION" &&
      item.contribution_type === "SUBMITTER"
    ) {
      actionText = `submitted ${cardType}`;
    } else if (
      itemType === "CONTRIBUTION" &&
      item.contribution_type === "SUPPORTER"
    ) {
      actionText = (
        <span>
          {`rewarded ${cardType} ${item.source.amount} RSC `}
          <img
            src="/static/icons/coin-filled.png"
            className={css(styles.coinImage)}
            alt="researchhub-coin-icon"
          />
        </span>
      );
    } else if (itemType === "AUTHORED_PAPER") {
      actionText = "authored paper";
    }

    return (
      <div className={css(styles.action)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/overview`}
        >
          <a className={css(styles.link)}>
            {`${author?.first_name} ${author?.last_name} `}
          </a>
        </Link>
        <span>{actionText}</span>
      </div>
    );
  };

  const buildActivitySummary = ({ item, itemType, author }) => {
    const uniDoc =
      itemType === "UNIFIED_DOCUMENT" ? item : item.unified_document;
    const doc = getDocFromItem(item, itemType);
    const url = getUrlFromItem(item, itemType);

    let timestamp;
    let timeText = "";
    if (itemType === "CONTRIBUTION" && item.contribution_type === "COMMENTER") {
      timestamp = getNewestCommentTimestamp(item);
      timeText = formatTimestamp(timestamp);
    } else if (itemType === "AUTHORED_PAPER") {
      if (item.paper_publish_date) {
        timestamp = item.paper_publish_date;
        timeText = `${formatTimestamp(timestamp)} (published)`;
      } else {
        timestamp = item.uploaded_date;
        timeText = `${formatTimestamp(timestamp)} (uploaded)`;
      }
    } else {
      timestamp = item.created_date;
      timeText = formatTimestamp(timestamp);
    }

    const actionLineHTML = buildActionLineHTML({ item, itemType, author });
    return (
      <div className={css(styles.activitySummary)}>
        <div className={css(styles.avatarWrapperSmall)}>
          <AuthorAvatar author={author} size={35} disableLink={true} />
        </div>
        <div>
          {actionLineHTML}
          <div>
            <Link href={url}>
              <a className={css(styles.link, styles.title)}>
                {truncateText(doc.title, 70)}
              </a>
            </Link>
          </div>
          <div>
            <span className={css(styles.activityTimestamp)}>{timeText}</span>
          </div>
        </div>
      </div>
    );
  };

  const cardHTML = getCardHTML({ item, itemType });
  const activitySummaryHTML = buildActivitySummary({ item, itemType, author });

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.avatarWrapper)}>
        <AuthorAvatar author={author} size={35} disableLink={true} />
      </div>
      <div className={css(styles.contentWrapper)}>
        {activitySummaryHTML}
        {cardHTML}
      </div>
    </div>
  );
};

var styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  avatarWrapper: {
    marginTop: -5,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  avatarWrapperSmall: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
      marginRight: 15,
    },
  },
  contentWrapper: {
    width: "100%",
    marginLeft: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 0,
    },
  },
  coinImage: {
    verticalAlign: -2,
    width: 15,
  },
  discussionEntryCard: {
    padding: 15,
    boxSizing: "border-box",
    border: `1px solid ${genericCardColors.BORDER}`,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 4,
    background: "white",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      padding: "8px 8px 4px 8px",
    },
  },
  activitySummary: {
    lineHeight: "22px",
    fontSize: 16,
    alignItems: "flex-start",
    color: colors.BLACK(0.8),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "flex",
    },
  },
  title: {
    textOverflow: "ellipsis",
    display: "inline",
  },
  activityTimestamp: {
    display: "block",
    color: colors.BLACK(0.5),
    fontSize: 12,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  timestampDivider: {
    fontSize: 18,
    display: "inline",
    padding: "0px 10px",
    color: colors.GREY(),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  link: {
    textDecoration: "unset",
    cursor: "pointer",
    color: "unset",
    fontWeight: 500,
    color: colors.BLACK(0.8),
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

export default AuthorFeedItem;
