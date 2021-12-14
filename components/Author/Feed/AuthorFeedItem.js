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

const AuthorFeedItem = ({
  author,
  item,
  itemType, // UNIFIED_DOCUMENT | CONTRIBUTION
}) => {
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

  const getDocFromUniDoc = ({ uniDoc }) => {
    return Array.isArray(item.unified_document.documents)
      ? item.unified_document.documents[0]
      : item.unified_document.documents;
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
    const uniDoc = item.unified_document;

    if (itemType === "CONTRIBUTION") {
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
    } else if (itemType === "UNIFIED_DOCUMENT") {
      // TODO: Implement
    } else {
      throw new Error(`Unrecognized itemType ${itemType}`);
    }

    return cardType;
  };

  const getCardHTML = ({ item, itemType }) => {
    const uniDoc = item.unified_document;
    const doc = getDocFromUniDoc({ uniDoc });
    const cardType = getCardType({ item, itemType });
    const key = `${cardType}-${item?.id}-${uniDoc?.id}`;

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
        console.log("data", data);
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
    const uniDoc = item.unified_document;
    const doc = getDocFromUniDoc({ uniDoc });
    const url = getUrlToUniDoc(uniDoc);

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
    }

    let timestamp;
    if (itemType === "CONTRIBUTION" && item.contribution_type === "COMMENTER") {
      timestamp = getNewestCommentTimestamp(item);
    } else {
      timestamp = item.created_date;
    }

    return (
      <div className={css(styles.activitySummary)}>
        <AuthorAvatar author={author} size={40} disableLink={true} />
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
          <span className={css(styles.activityTimestamp)}>
            {formatTimestamp(timestamp)}
          </span>
        </div>
      </div>
    );
  };

  const cardHTML = getCardHTML({ item, itemType });
  const activitySummaryHTML = buildActivitySummary({ item, itemType, author });

  return (
    <div className={css(styles.container)}>
      {activitySummaryHTML}
      {cardHTML}
    </div>
  );
};

var styles = StyleSheet.create({
  container: {
    marginBottom: 30,
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
    marginLeft: -52,
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
