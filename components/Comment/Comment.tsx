import CommentHeader from "./CommentHeader";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import { Comment as CommentType } from "./lib/types";
import { useContext, useState } from "react";
import CommentEditor from "./CommentEditor";
import { ID, parseUser, TopLevelDocument } from "~/config/types/root_types";
import colors from "./lib/colors";
import { getOpenBounties, getUserOpenBounties, hasOpenBounties } from "./lib/bounty";
import Button from "../Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import CommentList from "./CommentList";
import { createCommentAPI, fetchSingleCommentAPI, updateCommentAPI } from "./lib/api";
import { CommentTreeContext } from "./lib/contexts";
import { getConfigForContext } from "./lib/config";
import { MessageActions } from "~/redux/message";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import { timeTo } from "~/config/utils/dates";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
const { setMessage, showMessage } = MessageActions;

type CommentArgs = {
  comment: CommentType;
  document: TopLevelDocument;
};

const Comment = ({
  comment,
  document,
}: CommentArgs) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const openBounties = getOpenBounties({ comment });
  const [currentChildOffset, setCurrentChildOffset] = useState<number>(0);
  const currentUser = useSelector((state: RootState) =>
  isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const userOpenRootBounties = getUserOpenBounties({ comment, user: currentUser, rootBountyOnly: true });
  const commentTreeState = useContext(CommentTreeContext);
  const dispatch = useDispatch();

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
        documentId: document.id,
        documentType: document.apiDocumentType,
        commentId: comment.id,
        sort: commentTreeState.sort,
        filter: commentTreeState.filter,
        childOffset: comment.children.length,
        parentComment: comment.parent,
      });

      commentTreeState.onFetchMore({
        comment,
        fetchedComments: response.children,
      });
      setCurrentChildOffset(currentChildOffset + response.children.length);
    } catch (error) {
      console.log("error", error);
      // FIXME: Implement error handling
    } finally {
      setIsFetchingMore(false);
    }
  }; 
  
  const handleReplyCreate = async ({
    content,
  }: {
    content: object;
  }) => {
    try {
      const _comment: CommentType = await createCommentAPI({
        content,
        documentId: document.id,
        documentType: document.apiDocumentType,
        parentComment: comment,
      });

      commentTreeState.onCreate({ comment: _comment, parent: comment });
    } catch (error) {
      dispatch(setMessage("Could not create a comment at this time"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      throw error;
    }
  };  

  const handleCommentUpdate = async ({
    id,
    content,
  }: {
    id: ID;
    content: any;
  }) => {
    const comment: CommentType = await updateCommentAPI({
      id,
      content,
      documentId: document.id,
      documentType: document.apiDocumentType,
    });

    commentTreeState.onUpdate({ comment });
  };
  
  const hasOpenBounties = openBounties.length > 0;
  const currentUserIsOpenBountyCreator =  userOpenRootBounties.length > 0;
  const isQuestion = document?.unifiedDocument?.documentType === "question";
  const previewMaxChars = getConfigForContext(commentTreeState.context).previewMaxChars;
  const isNarrowWidthContext = commentTreeState.context === "sidebar" || commentTreeState.context === "drawer";
  return (
    <div>
      <div>
        <div
          className={css(
            styles.mainWrapper,
            hasOpenBounties && styles.mainWrapperForBounty,
          )}
        >
          <div className={css(styles.headerWrapper)}>
            <CommentHeader
              authorProfile={comment.createdBy.authorProfile}
              comment={comment}
              document={document}
              handleEdit={() => setIsEditMode(!isEditMode)}
            />
          </div>
          {isEditMode ? (
            <CommentEditor
              handleSubmit={async (args) => {
                await handleCommentUpdate(args);
                setIsEditMode(false);
              }}
              commentType={comment.commentType}
              content={comment.content}
              commentId={comment.id}
              author={currentUser?.authorProfile}
              editorId={`edit-${comment.id}`}
              allowCommentTypeSelection={!isQuestion}
              handleClose={() => _handleCloseEdit()}
            />
          ) : (
            <div
              className={css(
                styles.commentReadOnlyWrapper,
                hasOpenBounties && styles.commentReadOnlyWrapperForBounty
              )}
            >
              <CommentReadOnly content={comment.content} previewMaxCharLength={previewMaxChars} />
              {hasOpenBounties && (
                <div className={css(styles.contributeWrapper)}>
                  <div className={css(styles.contributeDetails)}>
                    <span style={{ fontWeight: 500 }}>
                      <FontAwesomeIcon style={{ fontSize: 13, marginRight: 5}} icon={faClock} />
                      {`Bounty expiring in ` + timeTo(openBounties[0].expiration_date) + `.  `}
                    </span>
                    <span>
                        <>{`Reply to this ${isQuestion ? "question" : "thread"} to be eligible for bounty award.`}</>
                    </span>
                  </div>
                  <CreateBountyBtn
                    onBountyAdd={(bounty) => {
                      const updatedComment = Object.assign({}, comment);
                      comment.bounties[0].appendChild(bounty);
                      updatedComment.bounties.push(bounty); 
                      commentTreeState.onUpdate({ comment: updatedComment });
                    }}
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
                        <FontAwesomeIcon icon={faPlus} />{` `}
                        {currentUserIsOpenBountyCreator
                          ? <>Add RSC<span className={css(styles.bountyBtnText, isNarrowWidthContext && styles.hideForNarrowWidthContexts)}> to bounty</span></>
                          : <>Contribute<span className={css(styles.bountyBtnText, isNarrowWidthContext && styles.hideForNarrowWidthContexts)}> to bounty</span></>
                        }
                      </div>
                      </Button>
                  </CreateBountyBtn>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={css(styles.actionsWrapper)}>
          <CommentActions
            toggleReply={() => _handleToggleReply()}
            document={document}
            comment={comment}
          />
        </div>
      </div>
      {isReplyOpen && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            focusOnMount={true}
            handleClose={() => _handleToggleReply()}
            handleSubmit={async ({ content, commentType }) => {
              await handleReplyCreate({ content });
              setIsReplyOpen(false);
            }}
            editorId={`reply-to-${comment.id}`}
            author={currentUser?.authorProfile}
            placeholder={`Enter reply to this comment`}
          />
        </div>
      )}

      <CommentList
        parentComment={comment}
        totalCount={comment.childrenCount}
        comments={comment.children}
        document={document}
        isFetching={isFetchingMore}
        handleFetchMore={handleFetchMoreReplies}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  commentWrapper: {
    marginTop: 5,
  },
  headerWrapper: {
    marginBottom: 15,
  },
  editorWrapper: {
    marginTop: 15,
  },
  actionsWrapper: {},
  mainWrapper: {},
  mainWrapperForBounty: {
    // boxShadow: "0px 0px 15px rgba(255, 148, 22, 0.5)",
    // borderRadius: 10,
    // padding: 10,
    // background: "white",
    // marginBottom: 5,
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
    }
  },
  hideForNarrowWidthContexts: {
    display: "none",
  },
  bountyBtnText: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    }
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
    marginBottom: 10,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      flexDirection: "column",
      alignItems: "flex-start",
      rowGap: "10px",
    }
  },
  contributeBtn: {
    background: colors.bounty.contributeBtn,
    fontWeight: 500,
    border: 0,
    marginLeft: "auto",
    borderRadius: "4px"
  },
  contributeBtnLabel: {
    fontWeight: 500,
    lineHeight: "22px",
  },
});

export default Comment;
