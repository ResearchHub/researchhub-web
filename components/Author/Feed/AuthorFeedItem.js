import DiscussionEntry from "~/components/Threads/DiscussionEntry";
import CommentEntry from "~/components/Threads/CommentEntry";
import { StyleSheet, css } from "aphrodite";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserPostCard from "~/components/Author/Tabs/UserPostCard";
import AuthorAvatar from "~/components/AuthorAvatar";
import Link from "next/link";
import colors, { genericCardColors } from "~/config/themes/colors";
import dayjs from "dayjs";
import HypothesisCard from "~/components/UnifiedDocFeed/document_cards/HypothesisCard";
import { timeAgo } from "~/config/utils/dates";
import { getUrlToUniDoc } from "~/config/utils/routing";

const AuthorFeedItem = ({ author, item, itemType }) => {
  const getDocFromItem = (item, itemType) => {
    let doc;
    if (itemType === "AUTHORED_PAPER") {
      doc = item;
    } else if (itemType === "CONTRIBUTION") {
      const uniDoc = item.unified_document;

      doc = Array.isArray(uniDoc.documents)
        ? uniDoc.documents[0]
        : uniDoc.documents;
    } else {
      throw new Error("Unrecognized item type");
    }

    return doc;
  };

  const getUrlFromItem = (item, itemType) => {
    if (itemType === "AUTHORED_PAPER") {
      return `/paper/${item.id}/${item.slug}`;
    } else {
      return getUrlToUniDoc(item.unified_document);
    }
  };

  const getNewestCommentTimestamp = (discussionItem) => {
    let newest = discussionItem.created_date;
    discussionItem.source.comments.forEach((comment) => {
      if (!newest || dayjs(comment.created_date) > dayjs(newest)) {
        newest = comment.created_date;
      }

      comment.replies.forEach((reply) => {
        if (dayjs(reply.created_date) > dayjs(newest)) {
          newest = reply.created_date;
        }
      });
    });

    return newest;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return timeAgo.format(date);
  };

  const getDocType = ({ uniDoc }) => {
    return uniDoc.document_type === "PAPER"
      ? "paper"
      : uniDoc.document_type === "DISCUSSION"
      ? "post"
      : uniDoc.document_type === "HYPOTHESIS"
      ? "hypothesis"
      : "";
  };

  const getCardType = ({ item, itemType }) => {
    let cardType;
    if (itemType === "AUTHORED_PAPER") {
      return "paper";
    } else if (itemType === "CONTRIBUTION") {
      const uniDoc = item.unified_document;
      if (item.contribution_type === "COMMENTER") {
        cardType = "comment";
      } else if (item.contribution_type === "SUBMITTER") {
        cardType = getDocType({ uniDoc });
      } else if (item.contribution_type === "SUPPORTER") {
        if (item.source?.content_type?.app_label === "discussion") {
          cardType = "comment";
        } else {
          cardType = getDocType({ uniDoc });
        }
      }
    } else {
      throw new Error(`Unrecognized itemType ${itemType}`);
    }

    return cardType;
  };

  const getCardHTML = ({ item, itemType }) => {
    const doc = getDocFromItem(item, itemType);
    const cardType = getCardType({ item, itemType });
    const key = `${itemType}-${cardType}-${doc.id}`;

    let html;
    switch (cardType) {
      case "paper":
        html = <PaperEntryCard paper={doc} index={doc.id} key={key} />;
        break;
      case "post":
        html = (
          <UserPostCard
            {...doc}
            formattedDocType="post"
            key={key}
            // TODO: Probably need to do this?
            user_vote={doc?.user_vote}
          />
        );
        break;
      case "hypothesis":
        html = (
          <HypothesisCard {...doc} formattedDocType={"hypothesis"} key={key} />
        );
        break;
      case "comment":
        const data =
          item.contribution_type === "SUPPORTER"
            ? item.source.source
            : item.source;
        html = (
          <div className={css(styles.discussionEntryCard)}>
            <DiscussionEntry
              key={`thread-${doc.id}-${item.id}`}
              data={data}
              hostname={process.env.HOST}
              currentAuthor={author}
              // TODO Figure out which are needed
              // hoverEvents={true}
              // path={t.path}
              // newCard={transition && i === 0} //conditions when a new card is made
              // mobileView={false}
              // discussionCount={calculatedCount}
              // setCount={setCount}
              documentType={cardType}
              paper={data.paper}
              hypothesis={data.hypothesis}
              post={data.post}
            />
          </div>
        );
        break;
      default:
      // TODO: Log error in sentry
      // throw new Error("Unrecognized card type");
    }

    return html;
  };

  const buildActivitySummary = ({ item, itemType, author }) => {
    const uniDoc =
      itemType === "UNIFIED_DOCUMENT" ? item : item.unified_document;
    const doc = getDocFromItem(item, itemType);
    const url = getUrlFromItem(item, itemType);

    let actionText = "";
    let endText = "";
    if (itemType === "CONTRIBUTION" && item.contribution_type === "COMMENTER") {
      actionText = "commented on";
    } else if (
      itemType === "CONTRIBUTION" &&
      item.contribution_type === "SUBMITTER"
    ) {
      actionText = "submitted";
    } else if (
      itemType === "CONTRIBUTION" &&
      item.contribution_type === "SUPPORTER"
    ) {
      actionText = <span>{`supported content on `}</span>;
      endText = (
        <span>
          <span>{`with ${item.source.amount} RSC`}</span>
          <img
            src="/static/icons/coin-filled.png"
            className={css(styles.coinImage)}
            alt="researchhub-coin-icon"
          />
        </span>
      );
    } else if (itemType === "AUTHORED_PAPER") {
      actionText = "authored";
    }

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

    return (
      <div className={css(styles.activitySummary)}>
        <div className={css(styles.activityText)}>
          <Link
            href={"/user/[authorId]/[tabName]"}
            as={`/user/${author.id}/overview`}
          >
            <a className={css(styles.link, styles.activityItemText)}>
              {`${author?.first_name} ${author?.last_name}`}
            </a>
          </Link>
          <span
            className={css(styles.activityTextItem, styles.activityItemText)}
          >
            {actionText}
          </span>
          <Link href={url}>
            <a
              className={css(
                styles.link,
                styles.title,
                styles.activityItemText
              )}
            >
              {doc.title}
            </a>
          </Link>
          <span
            className={css(styles.activityTextItem, styles.activityItemText)}
          >
            {endText}
          </span>
          <div className={css(styles.timestampDivider)}>•</div>
          <span className={css(styles.activityTimestamp)}>{timeText}</span>
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
      <div class={css(styles.contentWrapper)}>
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
  },
  contentWrapper: {
    width: "calc(100% - 50px)",
    marginLeft: 15,
  },
  coinImage: {
    verticalAlign: -4,
    width: 20,
    marginLeft: 5,
  },
  // TODO: Clean hard coded hex values
  discussionEntryCard: {
    padding: 15,
    boxSizing: "border-box",
    border: "1px solid #EDEDED",
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 3,
    background: "#FFFFFF",
  },
  activitySummary: {
    display: "flex",
    color: colors.BLACK(0.8),
  },
  title: {
    textOverflow: "ellipsis",
    flexBasis: 600,
    overflow: "hidden",
  },
  activityItem: {},
  activityItemText: {
    // marginBottom: 20,
    whiteSpace: "nowrap",
    marginLeft: 5,
  },
  activityText: {
    display: "flex",
    alignItems: "center",
    marginLeft: 15,
    ":first-child": {
      marginLeft: 0,
    },
  },
  activityTimestamp: {
    whiteSpace: "nowrap",
    color: colors.BLACK(0.8),
    fontSize: 14,
  },
  timestampDivider: {
    fontSize: 18,
    padding: "0px 10px",
    color: colors.GREY(),
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
