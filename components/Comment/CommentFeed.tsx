import { useEffect, useState } from "react";
import Comment from "./Comment";
import { Comment as CommentType, COMMENT_TYPES } from "./lib/types";
import CommentEditor from "~/components/Comment/CommentEditor";
import {
  createCommentAPI,
  updateCommentAPI,
  fetchCommentsAPI,
} from "./lib/api";
import { parseUser, TopLevelDocument } from "~/config/types/root_types";
import replaceComment from "./lib/replaceComment";
import findComment from "./lib/findComment";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import CommentFilters from "./CommentFilters";
import { css, StyleSheet } from "aphrodite";
import { filterOpts, sortOpts } from "./lib/options";
import CommentSort from "./CommentSort";
import CommentPlaceholder from "./CommentPlaceholder";
import config from "./lib/config";


type Args = {
  document: TopLevelDocument;
};

const CommentFeed = ({ document }: Args) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [selectedSort, setSelectedSort] = useState<any>(sortOpts[0]);
  const [selectedFilter, setSelectedFilter] = useState<any>(filterOpts[0]);
  const user = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  useEffect(() => {
    const _fetchComments = async () => {
      setIsFetching(true);
      const comments: CommentType[] = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.documentType,
      });
      setComments(comments);
      setIsFetching(false);
    };

    _fetchComments();
  }, [document]);

  const handleCommentCreate = async ({
    content,
    postType,
  }: {
    content: object;
    postType: COMMENT_TYPES;
  }) => {
    const comment: CommentType = await createCommentAPI({
      content,
      postType,
      documentId: document.id,
      documentType: document.documentType,      
    });
    setComments([comment, ...comments]);
  };

  const handleCommentUpdate = async ({
    comment,
    content,
  }: {
    comment: CommentType;
    content: any;
  }) => {
    const _comment: CommentType = await updateCommentAPI({
      id: comment.id,
      content,
      documentId: document.id,
      documentType: document.documentType,
    });
    const found = findComment({ id: comment.id, comments });
    if (found) {
      replaceComment({
        prev: found.comment,
        next: _comment,
        list: comments,
      });
      const updatedComments = [...comments];
      setComments(updatedComments);
    }
  };

  if (true) {
    return (
      Array.from(new Array(config.comment.placeholderCount)).map((_, idx) => (
        <div className={css(styles.placeholderWrapper)}>
          <CommentPlaceholder key={`placeholder-${idx}`}/>
        </div>
      ))
    )
  }


  return (
    <div>
      <CommentEditor
        editorId="new-thread"
        handleSubmit={handleCommentCreate}
        allowBounty={true}
        author={user?.authorProfile}
      />
      <div className={css(styles.filtersWrapper)}>
        <CommentFilters selectedFilter={selectedFilter} handleSelect={(f) => setSelectedFilter(f)} />
        <div className={css(styles.sortWrapper)}>
          <CommentSort selectedSort={selectedSort} handleSelect={(s) => setSelectedSort(s)} />
        </div>
      </div>
      {comments.map((c) => (
        <div key={c.id} className={css(styles.commentWrapper)}>
          <Comment
            handleCreate={handleCommentCreate}
            handleUpdate={handleCommentUpdate}
            comment={c}
            document={document}
          />
        </div>
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  filtersWrapper: {
    margin: "25px 0",
    display: "flex",
  },
  sortWrapper: {
    marginLeft: "auto",
  },
  commentWrapper: {
    marginTop: 30,
  },
  placeholderWrapper: {
    marginBottom: 35,
  }
});

export default CommentFeed;
