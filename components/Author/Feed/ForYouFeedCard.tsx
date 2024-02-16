import React, { useMemo } from "react";
import {
  ForYouFeedCommentItem,
  ForYouFeedItem,
  ForYouFeedPaperItem,
} from "./types/forYouFeedTypes";
import { AuthorProfile, RHUser } from "~/config/types/root_types";
import AuthorAvatar from "~/components/AuthorAvatar";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import ALink from "~/components/ALink";
import { timeSince } from "~/config/utils/dates";
import VoteWidget from "~/components/VoteWidget";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import DocumentHubs from "~/components/Document/lib/DocumentHubs";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";

const FeedCardHeader = ({
  users,
  authors,
  actionText,
  actionNoun,
  createdDate,
}: {
  users?: RHUser[];
  authors?: AuthorProfile[];

  actionText?: string;
  actionNoun?: string;

  createdDate?: string;
}) => {
  const firstAuthor = useMemo(() => {
    if (!authors || authors.length === 0) return null;
    const first = authors.find((a) => a.sequence === "first");
    if (first) return first;
    return authors[0];
  }, [authors]);

  return (
    <div className={css(headerStyles.container)}>
      <div className={css(headerStyles.leftContent)}>
        {firstAuthor ? (
          <>
            <AuthorAvatar author={firstAuthor} size={24} />
            <UserTooltip
              createdBy={null}
              targetContent={
                <ALink
                  href={`/user/${firstAuthor?.id}/overview`}
                  key={`/user/${firstAuthor?.id}/overview-key`}
                >
                  {firstAuthor?.firstName}
                  {firstAuthor?.lastName && " "}
                  {firstAuthor?.lastName}
                  {authors && authors.length > 1 && " et al."}
                </ALink>
              }
            />
          </>
        ) : users && users.length > 0 ? (
          <>
            <CommentAvatars people={users} />
            <UserTooltip
              createdBy={users[0]}
              targetContent={
                <ALink
                  href={`/user/${users[0]?.authorProfile?.id}/overview`}
                  key={`/user/${users[0]?.authorProfile?.id}/overview-key`}
                >
                  {users[0]?.authorProfile?.firstName}
                  {users[0]?.authorProfile?.lastName && " "}
                  {users[0]?.authorProfile?.lastName}
                </ALink>
              }
            />
            {users.length > 1 && " and others"}
          </>
        ) : null}
        {actionText && (
          <span className={css(headerStyles.actionText)}>{actionText}</span>
        )}
        {actionNoun && (
          <span className={css(headerStyles.actionNoun)}>{actionNoun}</span>
        )}
      </div>
      <div className={css(headerStyles.timeSince)}>
        {createdDate && <span>{timeSince(createdDate)}</span>}
      </div>
    </div>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  leftContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
  },
  actionNoun: {
    fontSize: 16,
    color: colors.BLACK_TEXT(),
  },
  timeSince: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
  },
});

const FeedCardFooter = ({ item }: { item: ForYouFeedItem }) => {
  return (
    <div className={css(footerStyles.container)}>
      <VoteWidget
        horizontalView={true}
        // TODO: Implement these
        onDownvote={() => {}}
        onUpvote={() => {}}
        score={item.score}
        upvoteStyleClass={footerStyles.voteIcon}
        downvoteStyleClass={footerStyles.voteIcon}
      />
    </div>
  );
};

const footerStyles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  voteIcon: {
    fontSize: 14,
  },
});

const FeedCardPaper = ({ item }: { item: ForYouFeedPaperItem }) => {
  return (
    <div className={css(paperStyles.container)}>
      <FeedCardHeader
        users={[item.createdBy]}
        authors={item.item.authors}
        actionText="published paper"
        createdDate={item.createdDate}
      />
      <div className={css(paperStyles.title)}>
        {item.item.title || "This is a test title"}
      </div>
      <div className={css(paperStyles.abstract) + " clamp2"}>
        {item.item.abstract}
      </div>
      {item.hubs && (
        <DocumentHubs
          hubs={item.hubs}
          withShowMore={false}
          hideOnSmallerResolution={true}
        />
      )}
      <FeedCardFooter item={item} />
    </div>
  );
};

const paperStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 8,
  },
  abstract: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    lineHeight: "18px",
    marginBottom: 12,
  },
});

const FeedCardComment = ({ item }: { item: ForYouFeedCommentItem }) => {
  return (
    <div className={css(commentStyles.container)}>
      <FeedCardHeader
        users={[item.createdBy]}
        createdDate={item.createdDate}
        actionText="commented on"
        actionNoun={
          item.unifiedDocument?.document?.title || "Test Title of Paper"
        }
      />
      <CommentReadOnly comment={item.item as any} content={item.item.content} />
      {item.hubs && (
        <DocumentHubs
          hubs={item.hubs}
          withShowMore={false}
          hideOnSmallerResolution={true}
        />
      )}
      <FeedCardFooter item={item} />
    </div>
  );
};

const commentStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  content: {
    fontSize: 16,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    lineHeight: "18px",
    marginBottom: 12,
  },
});

const ForYouFeedCard = ({ item }: { item: ForYouFeedItem }) => {
  const mapped = {
    // TODO: Account for all types
    paper: FeedCardPaper,
    post: FeedCardPaper,
    comment: FeedCardComment,
    bounty: FeedCardPaper,
  };

  const Component = mapped[item.contentType] || null;
  if (!Component) return null;

  return <Component item={item} />;
};

export default ForYouFeedCard;
