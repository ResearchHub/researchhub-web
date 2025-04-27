import { ContentInstance, GenericDocument } from "../Document/lib/types";
import CommentHeader from "./CommentHeader";
import CommentHeaderForAnnotation from "./CommentHeaderForAnnotation";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import {
  COMMENT_CONTEXTS,
  COMMENT_TYPES,
  CommentPrivacyFilter,
  Comment as CommentType,
} from "./lib/types";
import { useContext, useState } from "react";
import CommentEditor from "./CommentEditor";
import {
  ErrorWithCode,
  ID,
  parseReview,
  parseUser,
  Review,
} from "~/config/types/root_types";
import colors from "./lib/colors";
import { getOpenBounties, getUserOpenBounties } from "./lib/bounty";
import Button from "../Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import CommentList from "./CommentList";
import {
  createCommentAPI,
  createCommunityReview,
  fetchSingleCommentAPI,
  updateCommentAPI,
  updatePeerReview,
} from "./lib/api";
import { CommentTreeContext } from "./lib/contexts";
import { getConfigForContext } from "./lib/config";
import { MessageActions } from "~/redux/message";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import { timeTo } from "~/config/utils/dates";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import getReviewCategoryScore from "./lib/quill/getReviewCategoryScore";
import { captureEvent } from "~/config/utils/events";
import CommentPrivacyBadge from "./CommentPrivacyBadge";
import { faReply } from "@fortawesome/pro-solid-svg-icons";
import { CommentReadOnlyTiptap } from "./CommentReadOnlyTiptap";
import { NewCommentBanner } from "./NewCommentBanner";
const { setMessage, showMessage } = MessageActions;

type CommentArgs = {
  comment: CommentType;
  ignoreChildren?: boolean;
  document?: GenericDocument;
};
// TODO: Integrate with DocumentViewer Context so that we can determine whether or not to render visiblity modifiers and how
const Comment = ({ comment, document, ignoreChildren }: CommentArgs) => {
  const { relatedContent } = comment.thread;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const openBounties = getOpenBounties({ comment });
  const [currentChildOffset, setCurrentChildOffset] = useState<number>(0);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const userOpenRootBounties = getUserOpenBounties({
    comment,
    user: currentUser,
    rootBountyOnly: true,
  });
  const commentTreeState = useContext(CommentTreeContext);
  const dispatch = useDispatch();
  const annotationContext =
    commentTreeState.context === COMMENT_CONTEXTS.ANNOTATION;
  const refManagerContext =
    commentTreeState.context === COMMENT_CONTEXTS.REF_MANAGER;

  const _handleToggleReply = () => {
    if (isReplyOpen && confirm("Discard changes?")) {
      setIsReplyOpen(false);
    } else {
      setIsReplyOpen(true);
    }
  };

  const _handleCloseEdit = () => {
    if (isEditMode && confirm("Discard changes?")) {
      setIsEditMode(false);
    }
  };

  const handleFetchMoreReplies = async () => {
    setIsFetchingMore(true);

    try {
      const response = await fetchSingleCommentAPI({
        documentId: relatedContent.id,
        documentType: relatedContent.type,
        commentId: comment.id,
        sort: commentTreeState.sort,
        childOffset: comment.children.length,
        parentComment: comment.parent,
        ascending: true,
      });

      commentTreeState.onFetchMore({
        comment,
        fetchedComments: response.children,
      });
      setCurrentChildOffset(currentChildOffset + response.children.length);
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch more replied",
        data: { comment },
      });
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleReviewCreate = async ({
    content,
    commentId,
    unifiedDocumentId,
  }: {
    content: any;
    commentId: ID;
    unifiedDocumentId: ID;
  }): Promise<Review | boolean> => {
    const reviewScore = getReviewCategoryScore({
      quillContents: content,
      category: "overall",
    });

    try {
      const reviewResponse = await createCommunityReview({
        unifiedDocumentId: unifiedDocumentId,
        commentId,
        score: reviewScore,
      });

      return parseReview(reviewResponse);
    } catch (error: any) {
      captureEvent({
        error,
        msg: "Failed to create review",
        data: { reviewScore, commentId, document, content },
      });
      return false;
    }
  };

  const handleReplyCreate = async ({
    content,
    mentions,
    commentType,
  }: {
    content: object;
    mentions?: Array<string>;
    commentType: COMMENT_TYPES;
  }): Promise<{ success: boolean; comment?: CommentType }> => {
    try {
      const params = {
        content,
        documentId: relatedContent.id,
        documentType: relatedContent.type,
        parentComment: comment,
        mentions,
        commentType: COMMENT_TYPES.DISCUSSION,
      };

      if (commentType === COMMENT_TYPES.REVIEW) {
        const reviewScore = getReviewCategoryScore({
          quillContents: content,
          category: "overall",
        });

        if (reviewScore === 0) {
          throw new ErrorWithCode({
            message: "Please select a review score before submitting",
            code: "NO_REVIEW_SCORE",
          });
        }
      }

      if (commentType) {
        params["commentType"] = commentType;
      }

      const _comment: CommentType = await createCommentAPI(params);

      if (commentType === COMMENT_TYPES.REVIEW) {
        const review = await handleReviewCreate({
          commentId: _comment.id,
          content: content,
          unifiedDocumentId: document?.unifiedDocument.id,
        });

        comment = { ...comment, review: review as Review };
      }

      commentTreeState.onCreate({ comment: _comment, parent: comment });
      return { success: true, comment: _comment };
    } catch (error) {
      if (error instanceof ErrorWithCode) {
        dispatch(setMessage(error.message));
      } else {
        dispatch(setMessage("Could not create a comment at this time"));
      }
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));

      // Throwing this error is necessary to prevent downstream editor effects within CommentEditor
      throw error;
    }
  };

  const handleCommentUpdate = async ({
    id,
    content,
    mentions,
  }: {
    id: ID;
    content: any;
    mentions?: Array<string>;
  }) => {
    const nextComment: CommentType = await updateCommentAPI({
      id,
      content,
      documentId: relatedContent.id,
      documentType: relatedContent.type,
      mentions,
    });

    return nextComment;
  };

  const handleReviewUpdate = async ({
    content,
    commentId,
    reviewId,
  }: {
    content: object;
    commentId: ID;
    reviewId: ID;
  }): Promise<Review | boolean> => {
    const reviewScore = getReviewCategoryScore({
      quillContents: content,
      category: "overall",
    });

    try {
      const reviewResponse = await updatePeerReview({
        reviewId,
        unifiedDocumentId: relatedContent.unifiedDocumentId,
        score: reviewScore,
      });

      return parseReview(reviewResponse);
    } catch (error: any) {
      captureEvent({
        error,
        msg: "Failed to update review",
        data: { reviewScore, reviewId, commentId, document, content },
      });
      return false;
    }
  };
  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const onBountyAdd = (bounty) => {
    const updatedComment = Object.assign({}, comment);
    comment.bounties[0].appendChild(bounty);
    updatedComment.bounties.push(bounty);
    commentTreeState.onUpdate({
      comment: updatedComment,
    });
  };

  const hasOpenBounties = openBounties.length > 0;
  const currentUserIsOpenBountyCreator = userOpenRootBounties.length > 0;
  const isQuestion = document?.unifiedDocument?.documentType === "question";

  const previewMaxChars = getConfigForContext(
    commentTreeState.context
  ).previewMaxChars;
  const isNarrowWidthContext =
    commentTreeState.context === COMMENT_CONTEXTS.SIDEBAR ||
    commentTreeState.context === COMMENT_CONTEXTS.DRAWER;

  const isTiptap = comment.contentFormat === "TIPTAP";

  return (
    <div>
      <div>
        <div className={css(styles.mainWrapper)}>
          <div
            className={css(
              styles.headerWrapper,
              annotationContext && styles.headerWrapperAnnotationContext
            )}
          >
            {(annotationContext || refManagerContext) && (
              <CommentHeaderForAnnotation
                authorProfile={comment.createdBy.authorProfile}
                comment={comment}
                handleEdit={handleEdit}
              />
            )}
          </div>
          <div
            className={css(
              styles.contentWrapper,
              [
                COMMENT_CONTEXTS.ANNOTATION,
                COMMENT_CONTEXTS.REF_MANAGER,
              ].includes(commentTreeState.context) &&
                styles.contentWrapperForAnnotation
            )}
          >
            {commentTreeState.context === COMMENT_CONTEXTS.GENERIC && (
              <div className={css(styles.genericCommentWrapperHeader)}>
                <CommentHeader
                  authorProfile={comment.createdBy.authorProfile}
                  comment={comment}
                  handleEdit={handleEdit}
                />
              </div>
            )}
            {isTiptap ? (
              <>
                {isEditMode && document && (
                  <NewCommentBanner
                    onClose={() => setIsEditMode(false)}
                    document={document}
                    commentId={comment.id?.toString()}
                  />
                )}
                <div>
                  <CommentReadOnlyTiptap
                    content={comment.content}
                    contentFormat={comment.contentFormat}
                    initiallyExpanded={false}
                    showReadMoreButton={true}
                    debug={true} // TODO remove after compleating testing
                  />
                </div>
              </>
            ) : isEditMode ? (
              <CommentEditor
                displayCurrentUser={annotationContext ? false : true}
                editorStyleOverride={
                  annotationContext ? styles.annotationEditor : undefined
                }
                showAuthorLine={!(annotationContext || refManagerContext)}
                handleSubmit={async (props) => {
                  try {
                    let comment = (await handleCommentUpdate(
                      props
                    )) as CommentType;
                    if (comment.review) {
                      const review = await handleReviewUpdate({
                        commentId: comment.id,
                        content: comment.content,
                        reviewId: comment.review?.id as ID,
                      });
                      comment = { ...comment, review: review as Review };
                    }
                    commentTreeState.onUpdate({ comment });
                    setIsEditMode(false);
                  } catch (error: any) {
                    dispatch(setMessage("Failed to update comment."));
                    // @ts-ignore
                    dispatch(showMessage({ show: true, error: true }));
                    captureEvent({
                      error,
                      msg: `Failed to create ${props.commentType}`,
                      data: {
                        props,
                      },
                    });
                    throw new Error("Could not update comment");
                  }
                }}
                handleCancel={() => _handleCloseEdit()}
                commentType={comment.commentType}
                content={comment.content}
                commentId={comment.id}
                author={currentUser?.authorProfile}
                editorId={`edit-${comment.id}`}
                allowCommentTypeSelection={false}
              />
            ) : (
              <div
                className={css(
                  styles.commentReadOnlyWrapper,
                  hasOpenBounties && styles.commentReadOnlyWrapperForBounty
                )}
              >
                <CommentReadOnly
                  comment={comment}
                  content={comment.content}
                  previewMaxCharLength={previewMaxChars}
                />
                {hasOpenBounties && (
                  <div className={css(styles.contributeWrapper)}>
                    <div className={css(styles.contributeDetails)}>
                      <span style={{ fontWeight: 500 }}>
                        <FontAwesomeIcon
                          style={{ fontSize: 13, marginRight: 5 }}
                          icon={faClock}
                        />
                        {`Grant expiring in ` +
                          timeTo(openBounties[0].expiration_date) +
                          `.  `}
                      </span>
                      <span>
                        <>{`Reply to this ${
                          isQuestion ? "question" : "thread"
                        } to be eligible for grant award.`}</>
                      </span>
                    </div>
                    {currentUserIsOpenBountyCreator ? (
                      <CreateBountyBtn
                        onBountyAdd={onBountyAdd}
                        withPreview={false}
                        relatedItemId={comment.id}
                        relatedItemContentType={"rhcommentmodel"}
                        originalBounty={comment.bounties[0]}
                      >
                        <Button
                          customButtonStyle={styles.contributeBtn}
                          customLabelStyle={styles.contributeBtnLabel}
                          hideRipples={true}
                          size="small"
                        >
                          <div>
                            <FontAwesomeIcon icon={faPlus} />
                            {` `}

                            <>
                              Add RSC
                              <span
                                className={css(
                                  styles.bountyBtnText,
                                  isNarrowWidthContext &&
                                    styles.hideForNarrowWidthContexts
                                )}
                              >
                                {" "}
                                to grant
                              </span>
                            </>
                          </div>
                        </Button>
                      </CreateBountyBtn>
                    ) : (
                      <Button
                        customButtonStyle={styles.contributeBtn}
                        customLabelStyle={styles.contributeBtnLabel}
                        hideRipples={true}
                        onClick={_handleToggleReply}
                        size="small"
                      >
                        <div>
                          <FontAwesomeIcon icon={faReply} />
                          {` `}
                          <span
                            className={css(
                              styles.bountyBtnText,
                              isNarrowWidthContext &&
                                styles.hideForNarrowWidthContexts
                            )}
                          >
                            Answer
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className={css(styles.bottomActions)}>
              <div>
                <CommentActions
                  toggleReply={_handleToggleReply}
                  onBountyAdd={onBountyAdd}
                  comment={comment}
                />
              </div>

              <div className={css(styles.privacyBadgeWrapper)}>
                {refManagerContext && (
                  <CommentPrivacyBadge
                    iconOnly={true}
                    privacy={comment.thread.privacy}
                  />
                )}
              </div>
            </div>

            {isReplyOpen && (
              <div className={css(styles.editorWrapper)}>
                <CommentEditor
                  focusOnMount={true}
                  handleClose={() => _handleToggleReply()}
                  handleSubmit={async ({ content, mentions, commentType }) => {
                    let _commentType = COMMENT_TYPES.DISCUSSION;
                    if (commentType) {
                      _commentType = commentType;
                    }
                    await handleReplyCreate({
                      content,
                      mentions,
                      commentType: _commentType,
                    });
                    setIsReplyOpen(false);
                  }}
                  commentType={
                    hasOpenBounties
                      ? comment.bounties[0]._bountyType
                      : undefined
                  }
                  allowCommentTypeSelection={isQuestion ? false : true}
                  editorId={`reply-to-${comment.id}`}
                  author={currentUser?.authorProfile}
                  placeholder={`Enter reply to this comment`}
                />
              </div>
            )}
            {!ignoreChildren && (
              <CommentList
                parentComment={comment}
                totalCount={comment.childrenCount}
                comments={comment.children}
                isFetching={isFetchingMore}
                handleFetchMore={handleFetchMoreReplies}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  genericCommentWrapperHeader: {
    marginBottom: 15,
  },

  commentWrapper: {
    marginTop: 5,
  },
  headerWrapper: {
    marginBottom: 15,
  },
  headerWrapperAnnotationContext: {
    marginBottom: 5,
  },
  editorWrapper: {
    marginTop: 15,
  },
  bottomActions: {
    marginBottom: 5,
    display: "flex",
    justifyContent: "space-between",
    // paddingTop: `10px`,
  },
  privacyBadgeWrapper: {
    marginLeft: "auto",
  },
  mainWrapper: {},
  contentWrapper: {
    position: "relative",
    paddingLeft: 22,
    borderLeft: `3px solid ${colors.border}`,
    marginLeft: 15,
  },
  contentWrapperForAnnotation: {
    borderLeft: "none",
    paddingLeft: 0,
    marginLeft: 0,
  },
  commentReadOnlyWrapper: {
    marginBottom: 15,
  },
  commentReadOnlyWrapperForBounty: {
    marginBottom: 0,
  },
  contributeDetails: {
    maxWidth: "70%",
    lineHeight: "22px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      maxWidth: "100%",
    },
  },
  hideForNarrowWidthContexts: {
    display: "none",
  },
  bountyBtnText: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  contributeWrapper: {
    background: colors.bounty.background,
    padding: "9px 11px 10px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    borderRadius: "4px",
    marginTop: 10,
    marginBottom: 0,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      flexDirection: "column",
      alignItems: "flex-start",
      rowGap: "10px",
    },
  },
  contributeBtn: {
    background: colors.bounty.contributeBtn,
    fontWeight: 500,
    border: 0,
    marginLeft: "auto",
    borderRadius: "4px",
  },
  contributeBtnLabel: {
    fontWeight: 500,
    lineHeight: "22px",
  },
  annotationEditor: {
    border: `1px solid ${colors.border}`,
    boxShadow: "none",
    marginBottom: 15,
  },
});

export default Comment;
