import DiscussionEntry from "~/components/Threads/DiscussionEntry";
import CommentEntry from "~/components/Threads/CommentEntry";
import { StyleSheet, css } from "aphrodite";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import UserPostCard from "~/components/Author/Tabs/UserPostCard";
import ComponentWrapper from "~/components/ComponentWrapper";
import AuthorAvatar from "~/components/AuthorAvatar";

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
  return "about " + r;
};

const UserOverview = ({ activity, author }) => {
  return (
    <ComponentWrapper>
      {activity.map((item) => {
        if (item.source.discussion_type === "Thread") {
          const title = Array.isArray(item.unified_document.documents)
            ? item.unified_document.documents[0].title
            : item.unified_document.documents.title;

          return (
            <div>
              <div className={css(styles.activitySummary)}>
                <AuthorAvatar
                  author={author}
                  size={33}
                  textSizeRatio={2.5}
                  disableLink={true}
                />
                <div className={css(styles.activityText)}>
                  <span>{`${author?.first_name} ${author?.last_name}`}</span>
                  <span> commented on </span>
                  <span>{title}</span>
                  <span> in </span>
                  <span>{item.unified_document.hubs[0].name}</span>
                  <span>{formatTimestamp(item.created_date)}</span>
                </div>
              </div>
              <div className={css(styles.discussionEntryCard)}>
                <DiscussionEntry
                  key={`thread-${item.id}`}
                  data={item.source}
                  hostname={process.env.HOST}
                  // hoverEvents={true}
                  // path={t.path}
                  // newCard={transition && i === 0} //conditions when a new card is made
                  // mobileView={false}
                  // discussionCount={calculatedCount}
                  // setCount={setCount}
                  documentType={"paper"}
                  paper={item.source.paper}
                  hypothesis={item.source.hypothesis}
                  post={item.source.post}
                />
              </div>
            </div>
          );
        } else if (item.contribution_type === "SUBMITTER") {
          const doc = Array.isArray(item.unified_document.documents)
            ? item.unified_document.documents[0]
            : item.unified_document.documents;
          const title = Array.isArray(item.unified_document.documents)
            ? item.unified_document.documents[0].title
            : item.unified_document.documents.title;
          const type =
            item.unified_document.document_type === "PAPER"
              ? "paper"
              : item.unified_document.document_type === "DISCUSSION"
              ? "post"
              : "";
          return (
            <div>
              <div>
                <span>{`${author?.first_name} ${author?.last_name}`}</span>
                <span> added </span>
                <span>{type}</span>
                <span>{title}</span>
                <span> in </span>
                <span>{item.unified_document.hubs[0].name}</span>
                <span>{formatTimestamp(item.created_date)}</span>
              </div>
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
    </ComponentWrapper>
  );
};

var styles = StyleSheet.create({
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
  },
  activityText: {
    display: "flex",
    alignItems: "center",
  },
});

export default UserOverview;
