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

const AuthorFeedItem = ({
  author,
  item,
  itemType, // UNIFIED_DOCUMENT | CONTRIBUTION
}) => {
  const formatTimestamp = (date_str) => {
    if (!date_str) {
      return;
    }
    date_str = date_str.trim();
    date_str = date_str.replace(/\.\d\d\d+/, ""); // remove the milliseconds
    date_str = date_str.replace(/-/, "/").replace(/-/, "/"); //substitute - with /
    date_str = date_str.replace(/T/, " ").replace(/Z/, " UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // +08:00 -> +0800
    const parsed_date = new Date(date_str);
    const relative_to = new Date();
    const delta = Math.max(
      2,
      parseInt((relative_to.getTime() - parsed_date) / 1000)
    );
    let r = "";
    if (delta < 60) {
      r = delta + " seconds ago";
    } else if (delta < 120) {
      r = "a minute ago";
    } else if (delta < 45 * 60) {
      r = parseInt(delta / 60, 10).toString() + " minutes ago";
    } else if (delta < 2 * 60 * 60) {
      r = "an hour ago";
    } else if (delta < 24 * 60 * 60) {
      r = "" + parseInt(delta / 3600, 10).toString() + " hours ago";
    } else if (delta < 48 * 60 * 60) {
      r = "a day ago";
    } else {
      r = parseInt(delta / 86400, 10).toString() + " days ago";
    }
    return r;
  };

  const getNewestCommentTimestamp = (discussionItem) => {
    let newest;
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

  const getDocFromUniDoc = ({ uniDoc }) => {
    return Array.isArray(item.unified_document.documents)
      ? item.unified_document.documents[0]
      : item.unified_document.documents;
  };

  const getCardType = ({ item, itemType }) => {
    let cardType;
    if (itemType === "CONTRIBUTION") {
      if (item.contribution_type === "COMMENTER") {
        cardType = "comment";
      } else if (item.contribution_type === "SUBMITTER") {
        const uniDoc = item.unified_document;
        cardType =
          uniDoc.document_type === "PAPER"
            ? "paper"
            : uniDoc.document_type === "DISCUSSION"
            ? "post"
            : uniDoc.document_type === "HYPOTHESIS"
            ? "hypothesis"
            : "";
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
        html = (
          <div className={css(styles.discussionEntryCard)}>
            <DiscussionEntry
              key={`thread-${doc.id}-${item.id}`}
              data={item.source}
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
              paper={item.source.paper}
              hypothesis={item.source.hypothesis}
              post={item.source.post}
            />
          </div>
        );
        break;
      default:
        throw new Error("Unrecognized card type");
    }

    return html;
  };

  const buildActivitySummary = ({ item, itemType, author }) => {
    const uniDoc = item.unified_document;
    const doc = getDocFromUniDoc({ uniDoc });

    let action;
    if (itemType === "CONTRIBUTION" && item.contribution_type === "COMMENTER") {
      action = "commented on";
    } else if (
      itemType === "CONTRIBUTION" &&
      item.contribution_type === "SUBMITTER"
    ) {
      action = "added";
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
            {action}
          </span>
          <Link
            href={"/paper/[paperId]/[paperName]"}
            as={`/paper/${doc.id}/${doc.slug}`}
          >
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
