import DiscussionEntry from "~/components/Threads/DiscussionEntry";
import CommentEntry from "~/components/Threads/CommentEntry";
import { StyleSheet, css } from "aphrodite";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserPostCard from "~/components/Author/Tabs/UserPostCard";
import ComponentWrapper from "~/components/ComponentWrapper";
import AuthorAvatar from "~/components/AuthorAvatar";
import Link from "next/link";
import colors, { genericCardColors } from "~/config/themes/colors";
import dayjs from "dayjs";
import LoadMoreButton from "~/components/LoadMoreButton";
import { useRouter } from "next/router";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { useEffect, useState } from "react";

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

const getDocFromActivityItem = (activityItem) => {
  return Array.isArray(activityItem.unified_document.documents)
    ? activityItem.unified_document.documents[0]
    : activityItem.unified_document.documents;
};

const buildActivitySummary = (activityItem, author) => {
  const type =
    activityItem.unified_document.document_type === "PAPER"
      ? "paper"
      : activityItem.unified_document.document_type === "DISCUSSION"
      ? "post"
      : "";

  const doc = Array.isArray(activityItem.unified_document.documents)
    ? activityItem.unified_document.documents[0]
    : activityItem.unified_document.documents;

  let action;
  switch (activityItem.contribution_type) {
    case "COMMENTER":
      action = "commented on";
      break;
    case "SUBMITTER":
      action = "added";
      break;
  }

  let timestamp;
  if (activityItem.contribution_type === "COMMENTER") {
    timestamp = getNewestCommentTimestamp(activityItem);
  } else {
    timestamp = activityItem.created_date;
  }

  return (
    <div className={css(styles.activitySummary)}>
      <AuthorAvatar author={author} size={40} disableLink={true} />
      <div className={css(styles.activityText)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/overview`}
        >
          <a className={css(styles.link)}>
            {`${author?.first_name} ${author?.last_name}`}
          </a>
        </Link>
        <span className={css(styles.activityTextItem, styles.activityItemText)}>
          {action}
        </span>
        <Link
          href={"/paper/[paperId]/[paperName]"}
          as={`/paper/${doc.id}/${doc.slug}`}
        >
          <a
            className={css(styles.link, styles.title, styles.activityItemText)}
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

const getNewestCommentTimestamp = (activityItem) => {
  let newest;

  activityItem.source.comments.forEach((comment) => {
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

const UserOverview = ({ author }) => {
  const router = useRouter();
  const [activity, setActivity] = useState([]);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const _fetchAuthorActivity = () => {
      return fetch(
        API.AUTHOR_ACTIVITY({ authorId: router.query.authorId }),
        API.GET_CONFIG()
      )
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          setNextResultsUrl(res.next);
          setActivity(res.results);
        })
        .catch((e) => {
          // TODO: log in sentry
        });
    };

    _fetchAuthorActivity().finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <ComponentWrapper>
      {activity.map((item) => {
        const type =
          item.unified_document.document_type === "PAPER"
            ? "paper"
            : item.unified_document.document_type === "DISCUSSION"
            ? "post"
            : "";

        const doc = Array.isArray(item.unified_document.documents)
          ? item.unified_document.documents[0]
          : item.unified_document.documents;

        const key = `activity-${item.contribution_type}-${item.id}`;
        const summaryHTML = buildActivitySummary(item, author);

        if (item.contribution_type === "COMMENTER") {
          return (
            <div className={css(styles.activityItem)} key={key}>
              {summaryHTML}
              <div className={css(styles.discussionEntryCard)}>
                <DiscussionEntry
                  key={`thread-${doc.id}-${item.id}`}
                  data={item.source}
                  hostname={process.env.HOST}
                  currentAuthor={author}
                  // hoverEvents={true}
                  // path={t.path}
                  // newCard={transition && i === 0} //conditions when a new card is made
                  // mobileView={false}
                  // discussionCount={calculatedCount}
                  // setCount={setCount}
                  documentType={type}
                  paper={item.source.paper}
                  hypothesis={item.source.hypothesis}
                  post={item.source.post}
                />
              </div>
            </div>
          );
        } else if (item.contribution_type === "SUBMITTER") {
          return (
            <div className={css(styles.activityItem)} key={key}>
              {summaryHTML}
              {type === "paper" ? (
                <PaperEntryCard paper={doc} index={doc.id} key={doc.id} />
              ) : type === "post" ? (
                <UserPostCard
                  {...doc}
                  formattedDocType={type}
                  key={doc.id}
                  user_vote={doc?.user_vote}
                />
              ) : null}
            </div>
          );
        }
      })}
      {nextResultsUrl && (
        <LoadMoreButton onClick={loadNext} isLoading={isLoading} />
      )}
    </ComponentWrapper>
  );
};

var styles = StyleSheet.create({
  // TODO: Move into own component
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
  activityItem: {
    marginBottom: 20,
    whiteSpace: "nowrap",
  },
  activityItemText: {
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

export default UserOverview;
