import React, { useEffect, useMemo, useState } from "react";
import {
  FeedPostItem,
  FeedCommentItem,
  FeedItem,
  FeedPaperItem,
  FeedBountyItem,
} from "./types/forYouFeedTypes";
import { AuthorProfile, RHUser } from "~/config/types/root_types";
import AuthorAvatar from "~/components/AuthorAvatar";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import ALink from "~/components/ALink";
import { timeSince, timeTo } from "~/config/utils/dates";
import VoteWidget from "~/components/VoteWidget";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import DocumentHubs from "~/components/Document/lib/DocumentHubs";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";
import fetchDocumentMetadata from "~/components/Document/api/fetchDocumentMetadata";
import { isEmpty } from "~/config/utils/nullchecks";
import {
  DocumentMetadata,
  parseDocumentMetadata,
} from "~/components/Document/lib/types";
import FundraiseCard from "~/components/Fundraise/FundraiseCard";
import ContentBadge from "~/components/ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/pro-light-svg-icons";
import Button from "~/components/Form/Button";
import { faReply } from "@fortawesome/pro-solid-svg-icons";

const FeedCardHeader = ({
  users,
  authors,
  actionText,
  actionNoun,
  createdDate,
}: {
  users?: RHUser[];
  authors?: AuthorProfile[];

  actionText?: string | React.ReactNode;
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
                  href={`/author/${firstAuthor?.id}`}
                  key={`/author/${firstAuthor?.id}`}
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
                  href={`/author/${users[0]?.authorProfile?.id}`}
                  key={`/author/${users[0]?.authorProfile?.id}`}
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
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
  },
  actionNoun: {
    fontSize: 16,
    color: colors.BLACK_TEXT(),
    // limit to one line and truncate
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  timeSince: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
  },
});

const FeedCardFooter = ({ item }: { item: FeedItem }) => {
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

const FeedCardPaper = ({ item }: { item: FeedPaperItem }) => {
  return (
    <div className={css(paperStyles.container)}>
      <FeedCardHeader
        authors={item.item.authors}
        actionText="published paper"
        createdDate={item.createdDate}
      />
      <div className={css(paperStyles.title)}>
        {item.item.title || "Unknown Title"}
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
    fontSize: 20,
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

const FeedCardPost = ({ item }: { item: FeedPostItem }) => {
  return (
    <div className={css(postStyles.container)}>
      <FeedCardHeader
        users={[item.createdBy]}
        authors={item.item.authors}
        actionText={
          {
            post: "created a post",
            question: "asked a question",
            preregistration: "requested funding",
          }[item.contentType]
        }
        createdDate={item.createdDate}
      />
      <div className={css(postStyles.title)}>
        {item.item.title || "Unknown Title"}
      </div>
      {!isEmpty(item.item.postHtml) ? (
        <div
          id="postBody"
          className={css(postStyles.postBody) + " rh-post"}
          dangerouslySetInnerHTML={{ __html: item.item.postHtml }}
        />
      ) : !isEmpty(item.item.renderableText) ? (
        <div className={css(postStyles.postBody) + " clamp2"}>
          {item.item.renderableText}
        </div>
      ) : null}
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

const postStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    lineHeight: "18px",
    marginBottom: 12,
  },
});

const FeedCardPreregistration = ({ item }: { item: FeedPostItem }) => {
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);

  useEffect(() => {
    if (isEmpty(item.unifiedDocument.id)) return;
    const _fetchFreshData = async () => {
      const _metadata = await fetchDocumentMetadata({
        unifiedDocId: item.unifiedDocument.id,
      });

      setMetadata(parseDocumentMetadata(_metadata));
    };

    _fetchFreshData();
  }, []);

  return (
    <div className={css(preregStyles.container)}>
      <FeedCardHeader
        users={[item.createdBy]}
        authors={item.item.authors}
        actionText={
          {
            post: "created a post",
            question: "asked a question",
            preregistration: "requested funding",
          }[item.contentType]
        }
        createdDate={item.createdDate}
      />
      <div className={css(preregStyles.title)}>
        {item.item.title || "Unknown Title"}
      </div>
      {!isEmpty(item.item.postHtml) ? (
        <div
          id="postBody"
          className={css(preregStyles.postBody) + " rh-post"}
          dangerouslySetInnerHTML={{ __html: item.item.postHtml }}
        />
      ) : !isEmpty(item.item.renderableText) ? (
        <div className={css(preregStyles.postBody) + " clamp2"}>
          {item.item.renderableText}
        </div>
      ) : null}
      {metadata && metadata.fundraise && (
        <div className={css(preregStyles.fundraiseContainer)}>
          <FundraiseCard fundraise={metadata.fundraise} />
        </div>
      )}
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

const preregStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    lineHeight: "18px",
    marginBottom: 12,
  },
  fundraiseContainer: {
    marginBottom: 12,
  },
});

const FeedCardComment = ({ item }: { item: FeedCommentItem }) => {
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
      <div className={css(commentStyles.content)}>
        <CommentReadOnly
          comment={item.item as any}
          content={item.item.content}
        />
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

const commentStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  content: {
    marginBottom: 12,
  },
});

const FeedCardBounty = ({ item }: { item: FeedBountyItem }) => {
  const isQuestion = item?.unifiedDocument?.documentType === "question";

  return (
    <div className={css(bountyStyles.container)}>
      <FeedCardHeader
        users={[item.createdBy]}
        createdDate={item.createdDate}
        actionText={
          <>
            is offering{" "}
            <ContentBadge
              contentType="bounty"
              bountyAmount={item.item.amount}
              size={`small`}
              badgeContainerOverride={bountyStyles.badgeContainerOverride}
              label={
                <div style={{ display: "flex", whiteSpace: "pre" }}>
                  <div style={{ flex: 1 }}>
                    {formatBountyAmount({
                      amount: item.item.amount,
                      withPrecision: false,
                    })}{" "}
                    RSC
                  </div>
                </div>
              }
            />
            {" on "}
          </>
        }
        actionNoun={
          item.unifiedDocument?.document?.title || "Test Title of Paper"
        }
      />
      <div className={css(bountyStyles.content)}>
        <CommentReadOnly
          comment={item.item as any}
          content={item.item.content}
        />
      </div>
      <div className={css(bountyStyles.contributeWrapper)}>
        <div className={css(bountyStyles.contributeDetails)}>
          <span style={{ fontWeight: 500 }}>
            <FontAwesomeIcon
              style={{ fontSize: 13, marginRight: 5 }}
              icon={faClock}
            />
            {`Bounty expiring in ` + timeTo(item.item.expirationDate) + `.  `}
          </span>
          <span>
            <>{`Reply to this ${
              isQuestion ? "question" : "thread"
            } to be eligible for bounty award.`}</>
          </span>
        </div>
        {
          <Button
            customButtonStyle={bountyStyles.contributeBtn}
            customLabelStyle={bountyStyles.contributeBtnLabel}
            hideRipples={true}
            onClick={() => {}}
            size="small"
          >
            <div>
              <FontAwesomeIcon icon={faReply} />
              {` `}
              <span className={css(bountyStyles.bountyBtnText)}>
                Answer the Bounty
              </span>
            </div>
          </Button>
        }
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

const bountyStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
  },
  content: {
    marginBottom: 12,
  },
  badgeContainerOverride: {
    display: "inline",
    margin: "0 4px",
  },

  contributeDetails: {
    maxWidth: "70%",
    lineHeight: "22px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      maxWidth: "100%",
    },
  },
  bountyBtnText: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  contributeWrapper: {
    background: colors.ORANGE_LIGHTER(0.6),
    padding: "9px 11px 10px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    borderRadius: "4px",
    marginBottom: 12,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      flexDirection: "column",
      alignItems: "flex-start",
      rowGap: "10px",
    },
  },
  contributeBtn: {
    background: colors.ORANGE_LIGHT2(1.0),
    fontWeight: 500,
    border: 0,
    marginLeft: "auto",
    borderRadius: "4px",
  },
  contributeBtnLabel: {
    fontWeight: 500,
    lineHeight: "22px",
  },
});

const ForYouFeedCard = ({ item }: { item: FeedItem }) => {
  const mapped = {
    paper: FeedCardPaper,
    question: FeedCardPost,
    post: FeedCardPost,
    comment: FeedCardComment,
    bounty: FeedCardBounty,
    preregistration: FeedCardPreregistration,
  };

  const Component = mapped[item.contentType] || null;
  if (!Component) return null;

  return <Component item={item} />;
};

export default ForYouFeedCard;
