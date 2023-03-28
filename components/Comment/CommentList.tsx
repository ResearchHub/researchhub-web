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
  comments: Array<CommentType>;
  document: TopLevelDocument;
  isRootList?: boolean;
  isFetchingList?: boolean;
}

const CommentList = ({ comments, parentComment, document, isRootList = false, isFetchingList = false }: Args) => {
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const dispatch = useDispatch();
  const commentTreeState = useContext(CommentTreeContext);

  const fetchMore = async ({ }) => {
    setIsFetchingMore(true);
    try {
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.documentType,
        sort: commentTreeState.sort,
        filter: commentTreeState.filter,
        parentId: parentComment?.id,
        page: currentPage + 1,
      });

      commentTreeState.onFetchMore({ comment: parentComment, fetchedChildren: response.comments });
    } catch (error) {
      console.log('error', error)
      // FIXME: Implement error handling
    } finally {
      setIsFetchingMore(false);
    }
  }

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
      let parentComment:CommentType | undefined;
      if (parentId) {
        parentComment = findComment({ id: parentId, comments: comments })?.comment;

        if (!parentComment) {
          console.warn(`Could not find parent comment ${parentId}. This should not happen. Aborting create.`);
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
    }
    catch(error) {
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
      currentUser
    });

    commentTreeState.onUpdate({ comment });
  };

  const _commentElems = 
    comments.map((c) => (
      <div key={c.id} className={css(styles.commentWrapper)}>
        <Comment
          handleCreate={handleCommentCreate}
          handleUpdate={handleCommentUpdate}
          comment={c}
          document={document}
        />
      </div>
    ));

  return (
    <div className={css(styles.commentListWrapper)}>
      {isRootList &&
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
      }

      <div className={css(styles.commentListWrapper)}>
        {_commentElems}
      </div>

      {(isFetchingMore || isFetchingList) &&
        <CommentPlaceholder />
      }
      {true &&
        <IconButton onClick={() => fetchMore({})}>
          <span style={{ color: colors.primary.btn, fontSize: 14, fontWeight: 500 }}>Load More <FontAwesomeIcon icon={faLongArrowDown} /></span>
        </IconButton>
      }
    </div>
  )
}

const styles = StyleSheet.create({
  commentListWrapper: {

  },
  commentWrapper: {
    borderBottom: `1px solid ${colors.border}`,
    paddingTop: 25,
    paddingBottom: 25,
    ":first-child": {
      paddingTop: 0,
    },
    ":last-child": {
      borderBottom: 0,
    },
  },
  editorWrapper: {
    marginBottom: 25,
  },  
});

export default CommentList;