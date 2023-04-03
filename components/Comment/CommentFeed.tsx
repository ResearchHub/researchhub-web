import React, { useEffect, useState } from "react";
import { Comment as CommentType, COMMENT_TYPES } from "./lib/types";
import { createCommentAPI, fetchCommentsAPI } from "./lib/api";
import { ID, NullableString, parseUser, TopLevelDocument } from "~/config/types/root_types";
import CommentFilters from "./CommentFilters";
import { css, StyleSheet } from "aphrodite";
import { filterOpts, sortOpts } from "./lib/options";
import CommentSort from "./CommentSort";
import CommentSidebar from "./CommentSidebar";
import CommentList from "./CommentList";
import CommentPlaceholder from "./CommentPlaceholder";
import config from "./lib/config";
import { CommentTreeContext } from "./lib/contexts";
import CommentEmptyState from "./CommentEmptyState";
import replaceComment from "./lib/replaceComment";
import findComment from "./lib/findComment";
import CommentDrawer from "./CommentDrawer";
import ContentSupportModal from "../Modals/ContentSupportModal";
import CommentEditor from "./CommentEditor";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import { MessageActions } from "~/redux/message";
import colors from "./lib/colors";
const { setMessage, showMessage } = MessageActions;

type Args = {
  document: TopLevelDocument;
  previewModeAsDefault?: boolean;
  context: "sidebar" | "drawer" | null;
};

const CommentFeed = ({
  document,
  previewModeAsDefault = false,
  context = null,
}: Args) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [rootLevelCommentCount, setRootLevelCommentCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);
  const [selectedSortValue, setSelectedSortValue] = useState<string | null>(
    sortOpts[0].value
  );
  const [selectedFilterValue, setSelectedFilterValue] = useState<string | null>(
    filterOpts[0].value
  );
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const dispatch = useDispatch();

  
  const handleFetch = async ({ sort, filter } : { sort?: string|null, filter?: string|null}) => {
    setIsFetching(true);
    try {
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
        sort: sort || selectedSortValue,
        filter: filter || selectedFilterValue,
      });

      setComments(response.comments);
      setRootLevelCommentCount(response.count);
    } catch (error) {
      console.log("error", error);
      // FIXME: Implement error handling
      // FIXME: Log to sentry
    } finally {
      setIsFetching(false);
      setIsInitialFetchDone(true);
    }
  };

  const onCreate = ({
    comment,
    parent,
  }: {
    comment: CommentType;
    parent?: CommentType;
  }) => {
    if (parent) {
      parent.children = [comment, ...parent.children];

      replaceComment({
        prev: parent,
        next: parent,
        list: comments,
      });

      const updatedComments = [...comments];
      setComments(updatedComments);
    } else {
      setComments([comment, ...comments]);
    }
  };

  const onUpdate = ({ comment }: { comment: CommentType }) => {
    const found = findComment({ id: comment.id, comments });
    if (found) {
      replaceComment({
        prev: found.comment,
        next: comment,
        list: comments,
      });
      const updatedComments = [...comments];
      setComments(updatedComments);
    } else {
      console.warn(
        `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
      );
    }
  };

  const handleCommentCreate = async ({
    content,
    commentType,
    parentId,
    bountyAmount,
  }: {
    content: object;
    commentType: COMMENT_TYPES;
    parentId: ID;
    bountyAmount?: number;
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
        documentType: document.apiDocumentType,
        parentComment,
        bountyAmount,
      });

      onCreate({ comment, parent: parentComment });
    } catch (error) {
      dispatch(setMessage("Could not create a comment at this time"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      throw error;
    }
  };

  const onFetchMore = ({
    comment,
    fetchedComments,
  }: {
    comment?: CommentType;
    fetchedComments: CommentType[];
  }) => {
    if (comment) {
      const found = findComment({ id: comment.id, comments });
      if (found) {
        const updatedComment = found.comment;
        updatedComment.children = [
          ...updatedComment.children,
          ...fetchedComments,
        ];

        replaceComment({
          prev: found.comment,
          next: updatedComment,
          list: comments,
        });
        const updatedComments = [...comments];
        setComments(updatedComments);
      } else {
        console.warn(
          `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
        );
      }
    } else {
      setComments([...comments, ...fetchedComments]);
    }
  };

  const fetchMore = async () => {
    setIsFetching(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
        sort: selectedSortValue,
        filter: selectedFilterValue,
        page: nextPage,
      });
      console.log('nextPage', nextPage)
      setCurrentPage(nextPage);
      onFetchMore({
        fetchedComments: response.comments,
      });
    } catch (error) {
      console.log("error", error);
      // FIXME: Implement error handling
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (document.id && !isInitialFetchDone) {
      handleFetch({});
    }
  }, [document.id, isInitialFetchDone]);

  const noResults =
    (document.isReady && document.discussionCount === 0) ||
    (selectedFilterValue !== null && comments.length === 0);
  const WrapperEl =
    context === "sidebar"
      ? CommentSidebar
      : context === "drawer"
        ? CommentDrawer
        : React.Fragment;

  return (
    // @ts-ignore
    <WrapperEl {...(context ? { comments } : {})} {...(context ? { isInitialFetchDone } : {})}>
      <ContentSupportModal />
      {!isInitialFetchDone ? (
        <CommentPlaceholder />
      ) : (
        <>
          <div className={css(styles.editorWrapper)}>
            <CommentEditor
              editorId="new-thread"
              handleSubmit={handleCommentCreate}
              allowBounty={true}
              author={currentUser?.authorProfile}
              previewModeAsDefault={context ? true : false}
              allowCommentTypeSelection={true}
            />
          </div>

          <div className={css(styles.filtersWrapper)}>
            <CommentFilters
              selectedFilterValue={selectedFilterValue}
              handleSelect={(fval) => {
                setIsFetching(true);
                setComments([]);
                setSelectedFilterValue(fval);
                handleFetch({ filter: fval, sort: selectedSortValue });
              }}
            />
            <div className={css(styles.sortWrapper)}>
              <CommentSort
                selectedSortValue={selectedSortValue}
                handleSelect={(sval) => {
                  setSelectedSortValue(sval)
                  setIsFetching(true);
                  setComments([]);
                  handleFetch({ sort: sval });
                }}
              />
            </div>
          </div>

          <CommentTreeContext.Provider
            value={{
              sort: selectedSortValue,
              filter: selectedFilterValue,
              context,
              onCreate,
              onUpdate,
              onFetchMore,
            }}
          >
            <CommentList
              isRootList={true}
              comments={comments}
              totalCount={rootLevelCommentCount}
              isFetching={isFetching}
              document={document}
              handleFetchMore={fetchMore}
            />
          </CommentTreeContext.Provider>
          {noResults &&
            <CommentEmptyState
              height={context === "sidebar" ? "60%" : "300px"}
              forSection={selectedFilterValue}
              documentType={document.documentType}
            />
          }
        </>
      )}
    </WrapperEl>
  );
};

const styles = StyleSheet.create({
  filtersWrapper: {
    margin: "45px 0 30px 0",
    display: "flex",
    paddingBottom: 15,
    borderBottom: `1px solid ${colors.filters.divider}`
  },
  sortWrapper: {
    marginLeft: "auto",
  },
  editorWrapper: {
    marginBottom: 25,
  },  
});

export default CommentFeed;
