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
  fetchSingleCommentAPI,
} from "./lib/api";
import CommentPlaceholder from "./CommentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { CommentTreeContext } from "./lib/contexts";
import config from "./lib/config";
const { setMessage, showMessage } = MessageActions;

type Args = {
  parentComment?: CommentType;
  comments?: Array<CommentType>;
  document: TopLevelDocument;
  isRootList?: boolean;
  isFetching?: boolean;
  totalCount: number;
  handleFetchMore: Function;
};

const CommentList = ({
  comments = [],
  totalCount,
  parentComment,
  document,
  handleFetchMore,
  isRootList = false,
  isFetching = false,
}: Args) => {
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const dispatch = useDispatch();
  const commentTreeState = useContext(CommentTreeContext);

  const _commentElems = comments.map((c) => (
    <div
      key={c.id}
      className={css(
        styles.commentWrapper,
        c.children.length > 0 && styles.commentWrapperWithChildren
      )}
    >
      <Comment
        comment={c}
        document={document}
      />
    </div>
  ));

  const loadedComments = comments;
  const loadMoreCount = totalCount - loadedComments.length;

  return (
    <div>
      <div
        className={css(
          styles.commentListWrapper,
          !isRootList && comments.length > 0 && styles.childrenList
        )}
      >
        {_commentElems.length > 0 && _commentElems}
        <div className={css(styles.placeholderWrapper)}>
          {isFetching && <CommentPlaceholder />}
        </div>
        {loadMoreCount > 0 && (
          <div className={css(styles.loadMoreWrapper)}>
            <IconButton onClick={handleFetchMore}>
              <span
                style={{
                  color: colors.primary.btn,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Load {loadMoreCount} {parentComment ? `${loadMoreCount > 1 ? "Replies" : "Reply"}` : "More"}{" "}
                <FontAwesomeIcon icon={faLongArrowDown} />
              </span>
            </IconButton>
          </div>
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
  loadMoreWrapper: {
    marginTop: 15,
  },
  placeholderWrapper: {
    marginTop: 15,
  },
  commentWrapper: {
    // borderBottom: `1px solid ${colors.border}`,
    // paddingBottom: 25,
    paddingTop: 25,
    ":first-child": {
      paddingTop: 0,
      // paddingBottom: 25,
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
});

export default CommentList;
