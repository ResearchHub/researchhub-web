import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import CommentFilters from "./CommentFilters";
import { css, StyleSheet } from "aphrodite";
import { filterOpts, sortOpts } from "./lib/options";
import CommentSort from "./CommentSort";
import CommentPlaceholder from "./CommentPlaceholder";
import config from "./lib/config";
import colors from "./lib/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import { MessageActions } from "~/redux/message";
import IconButton from "../Icons/IconButton";
const { setMessage, showMessage } = MessageActions;

type Args = {
  document: TopLevelDocument;
  WrapperEl?: any;
};

const CommentFeed = ({ document, WrapperEl = React.Fragment }: Args) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<any>(sortOpts[0]);
  const [selectedFilter, setSelectedFilter] = useState<any>(filterOpts[0]);
  const [fetchUrls, setFetchUrls] = useState<any>({ next: null, prev: null });
  const [count, setCount] = useState<number>(0);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const dispatch = useDispatch();

  const handleFetch = useCallback(
    async ({ url }) => {
      setIsFetching(true);
      try {
        const response = await fetchCommentsAPI({
          url,
          documentId: document.id,
          documentType: document.documentType,
        });

        setComments(response.comments);
        setFetchUrls({ next: response.next, prev: response.prev });
        setCount(response.count);
      } catch (error) {
        console.log('error', error)
        // FIXME: Implement error handling
      } finally {
        // if (readyForInitialRender) {
          // }
        setIsFetching(false);
        setIsInitialFetchDone(true);
      }
    },
    [document, isInitialFetchDone, fetchUrls, count, comments]
  );

  const handleFetchNext = () => handleFetch({ url: fetchUrls.next });
  const handleFetchPrev = () => handleFetch({ url: fetchUrls.prev });

  useEffect(() => {
    if (document.id && !isInitialFetchDone) {
      handleFetch({});
    }
  }, [document.id, isInitialFetchDone]);

  const handleCommentCreate = async ({
    content,
    postType,
  }: {
    content: object;
    postType: COMMENT_TYPES;
  }) => {
    try {
      const comment: CommentType = await createCommentAPI({
        content,
        postType,
        documentId: document.id,
        documentType: document.documentType,
      });
      setComments([comment, ...comments]);
    }
    catch(error) {
      dispatch(setMessage("Could not create a comment at this time"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true })); 
      throw error;
    }
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
    return comments.map((c) => (
      <div key={c.id} className={css(styles.commentWrapper)}>
        <Comment
          handleCreate={handleCommentCreate}
          handleUpdate={handleCommentUpdate}
          comment={c}
          document={document}
        />
      </div>
    ));
  }, [comments]);

  return (
    <WrapperEl
      comments={comments}
      isInitialFetchDone={isInitialFetchDone}
    >
      {isInitialFetchDone && (
        <>
          <div className={css(styles.filtersWrapper)}>
            <CommentFilters
              selectedFilter={selectedFilter}
              handleSelect={(f) => setSelectedFilter(f)}
            />
            <div className={css(styles.sortWrapper)}>
              <CommentSort
                selectedSort={selectedSort}
                handleSelect={(s) => setSelectedSort(s)}
              />
            </div>
          </div>
          <div className={css(styles.editorWrapper)}>
            <CommentEditor
              editorId="new-thread"
              handleSubmit={handleCommentCreate}
              allowBounty={true}
              author={currentUser?.authorProfile}
              previewModeAsDefault={true}
            />
          </div>
          <div>{_commentsElems}</div>
        </>
      )}
      {isFetching &&
        Array.from(new Array(config.comment.placeholderCount)).map((_, idx) => (
          <div className={css(styles.placeholderWrapper)}>
            <CommentPlaceholder key={`placeholder-${idx}`} />
          </div>
        ))}
      {fetchUrls.next && !isFetching &&
        <IconButton onClick={() => handleFetchNext()}>
          <span style={{ color: colors.primary.btn, fontSize: 14, fontWeight: 500 }}>Load More <FontAwesomeIcon icon={faLongArrowDown} /></span>
        </IconButton>
      }        
    </WrapperEl>
  );
};

const styles = StyleSheet.create({
  filtersWrapper: {
    margin: "15px 0 30px 0",
    display: "flex",
  },
  sortWrapper: {
    marginLeft: "auto",
  },
  editorWrapper: {
    marginBottom: 25,
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
  placeholderWrapper: {
    marginBottom: 35,
  },
});

export default CommentFeed;
