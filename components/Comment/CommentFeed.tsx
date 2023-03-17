import { useCallback, useEffect, useState, useMemo } from "react";
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
import React from "react";

type Args = {
  document: TopLevelDocument;
  WrapperEl: any;
};

const CommentFeed = ({ document, WrapperEl = React.Fragment }: Args) => {

  const [comments, setComments] = useState<CommentType[]>([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);
  const [readyForInitialRender, setReadyForInitialRender] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<any>(sortOpts[0]);
  const [selectedFilter, setSelectedFilter] = useState<any>(filterOpts[0]);
  const [fetchUrls, setFetchUrls] = useState<any>({ next: null, prev: null });
  const user = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const handleFetch = useCallback(async ({ url }) => {
    setIsFetching(true);
    try {
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.documentType,
      });
      setComments(response.comments);
      setFetchUrls({ next: response.next, prev: response.prev });
    }
    catch (error) {
      // FIXME: Implement error handling
    }
    finally {
      setIsInitialFetchDone(true);
    }
  }, [document, isInitialFetchDone, fetchUrls]);

  const handleFetchNext = () => handleFetch({ url: fetchUrls.next });
  const handleFetchPrev = () => handleFetch({ url: fetchUrls.prev });

  useEffect(() => {
    if (document.id) {
      handleFetch({});
    }
  }, [document.id]);

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

  const _commentsElems = useMemo(() => {
    return (
      comments.map((c) => (
        <div key={c.id} className={css(styles.commentWrapper)}>
          <Comment
            handleCreate={handleCommentCreate}
            handleUpdate={handleCommentUpdate}
            comment={c}
            document={document}
          />
        </div>
      ))
    )
  }, [comments]);


  return (
    <WrapperEl
      comments={comments}
      isInitialFetchDone={isInitialFetchDone}
      setReadyForInitialRender={() => {
        setIsFetching(true);
        setTimeout(() => {
          setIsFetching(false);
          setReadyForInitialRender(true);
        }, 1000);
      }}
    >
      {readyForInitialRender &&
        <>
          <CommentEditor
            editorId="new-thread"
            handleSubmit={handleCommentCreate}
            allowBounty={true}
            author={user?.authorProfile}
            previewWhenInactive={true}
          />
          <div className={css(styles.filtersWrapper)}>
            <CommentFilters selectedFilter={selectedFilter} handleSelect={(f) => setSelectedFilter(f)} />
            <div className={css(styles.sortWrapper)}>
              <CommentSort selectedSort={selectedSort} handleSelect={(s) => setSelectedSort(s)} />
            </div>
          </div>
          {_commentsElems}
        </>
      }
      {isFetching &&
        Array.from(new Array(config.comment.placeholderCount)).map((_, idx) => (
          <div className={css(styles.placeholderWrapper)}>
            <CommentPlaceholder key={`placeholder-${idx}`} />
          </div>
        ))
      }
    </WrapperEl>
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
