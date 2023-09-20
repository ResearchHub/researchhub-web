import { GenericDocument } from "../Document/lib/types";
import { COMMENT_CONTEXTS, Comment as CommentType } from "./lib/types";
import Comment from "./Comment";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";
import CommentPlaceholder from "./CommentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { CommentTreeContext } from "./lib/contexts";
import { useContext } from "react";

type Args = {
  parentComment?: CommentType;
  comments?: Array<CommentType>;
  document?: GenericDocument;
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
  const commentTreeState = useContext(CommentTreeContext);
  const _commentElems = comments.map((c) => (
    <div
      key={c.id}
      className={css(
        styles.commentWrapper,
        !c.parent && styles.rootCommentWrapper
      )}
    >
      <Comment comment={c} document={document} />
    </div>
  ));

  const loadedComments = comments;
  const loadMoreCount = totalCount - loadedComments.length;

  return (
    <div>
      <div
        className={css(
          styles.commentListWrapper,
          !isRootList &&
            comments.length > 0 &&
            ![
              COMMENT_CONTEXTS.ANNOTATION,
              COMMENT_CONTEXTS.REF_MANAGER,
            ].includes(commentTreeState.context) &&
            styles.childrenList
        )}
      >
        {_commentElems.length > 0 && _commentElems}
        {isFetching && (
          <div className={css(styles.placeholderWrapper)}>
            <CommentPlaceholder />
          </div>
        )}
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
                Load {loadMoreCount}{" "}
                {parentComment
                  ? `${loadMoreCount > 1 ? "Replies" : "Reply"}`
                  : "More"}{" "}
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
    marginLeft: -7,
  },
  loadMoreWrapper: {
    marginTop: 15,
  },
  placeholderWrapper: {
    marginTop: 15,
  },
  commentWrapper: {
    paddingTop: 10,
    ":last-child": {
      borderBottom: 0,
      paddingBottom: 0,
      marginBottom: 0,
    },
  },
  rootCommentWrapper: {
    paddingBottom: 10,
  },
});

export default CommentList;
