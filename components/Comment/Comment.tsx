import CommentHeader from "./CommentHeader";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import { Comment as CommentType } from "./lib/types";
import { useContext, useState } from "react";
import CommentEditor from "./CommentEditor";
import { ID, parseUser, TopLevelDocument } from "~/config/types/root_types";
import colors from "./lib/colors";
import { hasOpenBounties } from "./lib/bounty";
import Button from "../Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import CommentList from "./CommentList";
import { createCommentAPI, fetchSingleCommentAPI, updateCommentAPI } from "./lib/api";
import { CommentTreeContext } from "./lib/contexts";
import config from "./lib/config";
import { MessageActions } from "~/redux/message";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
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
  const _hasOpenBounties = hasOpenBounties({ comment });
  const [currentChildOffset, setCurrentChildOffset] = useState<number>(0);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
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
        currentChildOffset,
        parentComment: comment.parent,
      });

      commentTreeState.onFetchMore({
        comment,
        fetchedComments: response.children,
      });
      setCurrentChildOffset(currentChildOffset + config.feed.repliesPageSize);
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
      // FIXME: Temporary fix until we add created_by as obj from BE
      // @ts-ignore
      currentUser,
    });

    commentTreeState.onUpdate({ comment });
  };
  

  return (
    <div>
      <div>
        <div
          className={css(
            styles.mainWrapper,
            _hasOpenBounties && styles.mainWrapperForBounty
          )}
        >
          <div className={css(styles.headerWrapper)}>
            <CommentHeader
              authorProfile={comment.createdBy.authorProfile}
              comment={comment}
              handleEdit={() => setIsEditMode(!isEditMode)}
            />
          </div>
          {isEditMode ? (
            <CommentEditor
              handleSubmit={async (args) => {
                await handleCommentUpdate(args);
                setIsEditMode(false);
              }}
              content={comment.content}
              commentId={comment.id}
              author={currentUser?.authorProfile}
              editorId={`edit-${comment.id}`}
              handleClose={() => _handleCloseEdit()}
            />
          ) : (
            <div
              className={css(
                styles.commentReadOnlyWrapper,
                _hasOpenBounties && styles.commentReadOnlyWrapperForBounty
              )}
            >
              <CommentReadOnly content={comment.content} />
              {_hasOpenBounties && (
                <div className={css(styles.contributeWrapper)}>
                  <div>Contribute RSC to this bounty</div>
                  <CreateBountyBtn
                    onBountyAdd={(bounty) => {
                      const updated = Object.assign({}, comment)
                      updated.bounties.push(bounty); 
                      commentTreeState.onUpdate({ comment: updated });
                    }}
                    withPreview={false}
                    relatedItemId={comment.id}
                    relatedItemContentType={"rhcommentmodel"}
                    originalBounty={comment.bounties[0]}
                  >
                    <Button
                      label="Contribute"
                      customButtonStyle={styles.contributeBtn}
                      customLabelStyle={styles.contributeBtnLabel}
                      hideRipples={true}
                      size="small"
                    />
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
            isReplyOpen={isReplyOpen}
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
    marginBottom: 10,
  },
  editorWrapper: {
    marginTop: 15,
  },
  actionsWrapper: {},
  mainWrapper: {},
  mainWrapperForBounty: {
    boxShadow: "0px 0px 15px rgba(255, 148, 22, 0.5)",
    borderRadius: 10,
    padding: 10,
    background: "white",
    marginBottom: 5,
  },
  commentReadOnlyWrapper: {
    marginBottom: 15,
  },
  commentReadOnlyWrapperForBounty: {
    marginBottom: 0,
  },
  contributeWrapper: {
    background: colors.bounty.background,
    padding: "6px 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 500,
    fontSize: 14,
    borderRadius: "4px",
    marginTop: 5,
  },
  contributeBtn: {
    background: colors.bounty.btn,
    border: 0,
    marginLeft: "auto",
  },
  contributeBtnLabel: {
    fontWeight: 500,
    lineHeight: "22px",
  },
});

export default Comment;
