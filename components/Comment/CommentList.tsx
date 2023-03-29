import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ID, parseUser, TopLevelDocument } from "~/config/types/root_types";
import { Comment as CommentType, COMMENT_TYPES } from "./lib/types";
import Comment from "./Comment";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import CommentEditor from "~/components/Comment/CommentEditor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux";
import findComment from "./lib/findComment";
import { isEmpty } from "~/config/utils/nullchecks";
import IconButton from "../Icons/IconButton";
import { MessageActions } from "~/redux/message";
import {
  createCommentAPI,
  updateCommentAPI,
  fetchCommentsAPI,
} from "./lib/api";
import CommentPlaceholder from "./CommentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { CommentTreeContext } from "./lib/contexts";
const { setMessage, showMessage } = MessageActions;

type Args = {
  parentComment?: CommentType;
  comments?: Array<CommentType>;
  document: TopLevelDocument;
  isRootList?: boolean;
  isFetchingList?: boolean;
  totalCount: number;
};

const CommentList = ({
  comments = [],
  totalCount,
  parentComment,
  document,
  isRootList = false,
  isFetchingList = false,
}: Args) => {
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const dispatch = useDispatch();
  const commentTreeState = useContext(CommentTreeContext);

  const fetchMore = async ({}) => {
    setIsFetchingMore(true);
    try {
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.documentType,
        sort: commentTreeState.sort,
        filter: commentTreeState.filter,
        page: currentPage,
      });

      commentTreeState.onFetchMore({
        comment: parentComment,
        fetchedComments: response.comments,
      });
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.log("error", error);
      // FIXME: Implement error handling
    } finally {
      setIsFetchingMore(false);
    }
  };

  // const fetchMore = async ({ }) => {
  //   setIsFetchingMore(true);
  //   try {
  //     const nextPage = currentPage + 1;
  //     const response = await fetchCommentsAPI({
  //       documentId: document.id,
  //       documentType: document.documentType,
  //       sort: commentTreeState.sort,
  //       filter: commentTreeState.filter,
  //       commentId: parentComment?.id,
  //       page: currentPage,
  //     });

  //     commentTreeState.onFetchMore({ comment: parentComment, fetchedChildren: response.comments });
  //     setCurrentPage(nextPage)
  //   } catch (error) {
  //     console.log('error', error)
  //     // FIXME: Implement error handling
  //   } finally {
  //     setIsFetchingMore(false);
  //   }
  // }

  const handleCommentCreate = async ({
    content,
    commentType,
    parentId,
  }: {
    content: object;
    commentType: COMMENT_TYPES;
    parentId: ID;
  }) => {
    try {
      let parentComment: CommentType | undefined;
      if (parentId) {
        parentComment = findComment({
          id: parentId,
          comments: comments,
        })?.comment;

        if (!parentComment) {
          console.warn(
            `Could not find parent comment ${parentId}. This should not happen. Aborting create.`
          );
          return false;
        }
      }

      const comment: CommentType = await createCommentAPI({
        content,
        commentType,
        documentId: document.id,
        documentType: document.documentType,
        parentComment,
      });

      commentTreeState.onCreate({ comment, parent: parentComment });
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
      documentType: document.documentType,
      // FIXME: Temporary fix until we add created_by as obj from BE
      // @ts-ignore
      currentUser,
    });

    commentTreeState.onUpdate({ comment });
  };

  const _commentElems = comments.map((c) => (
    <div
      key={c.id}
      className={css(
        styles.commentWrapper,
        c.children.length > 0 && styles.commentWrapperWithChildren
      )}
    >
      <Comment
        handleCreate={handleCommentCreate}
        handleUpdate={handleCommentUpdate}
        comment={c}
        document={document}
      />
    </div>
  ));

  const loadedComments = comments;
  const loadMoreCount = totalCount - loadedComments.length;

  return (
    <div>
      {isRootList && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            editorId="new-thread"
            handleSubmit={handleCommentCreate}
            allowBounty={true}
            author={currentUser?.authorProfile}
            previewModeAsDefault={false}
            allowCommentTypeSelection={true}
          />
        </div>
      )}

      <div
        className={css(
          styles.commentListWrapper,
          !isRootList && comments.length > 0 && styles.childrenList
        )}
      >
        {_commentElems.length > 0 && _commentElems}
        {(isFetchingMore || isFetchingList) && <CommentPlaceholder />}
        {loadMoreCount > 0 && (
          <IconButton onClick={() => fetchMore({})}>
            <span
              style={{
                color: colors.primary.btn,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Load {loadMoreCount} More{" "}
              <FontAwesomeIcon icon={faLongArrowDown} />
            </span>
          </IconButton>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentListWrapper: {},
  childrenList: {
    paddingTop: 15,
    marginLeft: 10,
    paddingLeft: 15,
    borderLeft: `3px solid ${colors.border}`,
  },
  commentWrapper: {
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 25,
    paddingTop: 25,
    ":first-child": {
      paddingTop: 0,
      paddingBottom: 25,
    },
    ":last-child": {
      borderBottom: 0,
      paddingBottom: 0,
      marginBottom: 25,
    },
  },
  commentWrapperWithChildren: {
    paddingBottom: 0,
  },
  editorWrapper: {
    marginBottom: 25,
  },
});

export default CommentList;
