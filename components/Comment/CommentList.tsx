import { TopLevelDocument } from "~/config/types/root_types";
import { Comment as CommentType } from "./lib/types";
import Comment from "./Comment";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";
import CommentPlaceholder from "./CommentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";

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
          !isRootList && comments.length > 0 && styles.childrenList
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
    marginLeft: 9,
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
    paddingTop: 25,
    ":last-child": {
      borderBottom: 0,
      paddingBottom: 0,
      marginBottom: 0,
    },
  },
  rootCommentWrapper: {
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 25,
  },
});

export default CommentList;
