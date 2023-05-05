import {
  Comment as CommentType,
  COMMENT_TYPES,
  parseComment,
} from "./lib/types";
import { CommentTreeContext } from "./lib/contexts";
import { createCommentAPI, fetchCommentsAPI } from "./lib/api";
import { css, StyleSheet } from "aphrodite";
import { filterOpts, sortOpts } from "./lib/options";
import { ID, parseUser, TopLevelDocument } from "~/config/types/root_types";
import { isEmpty, localWarn } from "~/config/utils/nullchecks";
import { MessageActions } from "~/redux/message";
import { Purchase } from "~/config/types/purchase";
import { RootState } from "~/redux";
import { useDispatch, useSelector } from "react-redux";
import colors from "./lib/colors";
import CommentDrawer from "./CommentDrawer";
import CommentEditor from "./CommentEditor";
import CommentEmptyState from "./CommentEmptyState";
import CommentFilters from "./CommentFilters";
import CommentList from "./CommentList";
import CommentPlaceholder from "./CommentPlaceholder";
import CommentSidebar from "./CommentSidebar";
import CommentSort from "./CommentSort";
import ContentSupportModal from "../Modals/ContentSupportModal";
import findComment from "./lib/findComment";
import React, { useEffect, useState } from "react";
import removeComment from "./lib/removeComment";
import replaceComment from "./lib/replaceComment";
const { setMessage, showMessage } = MessageActions;

type Args = {
  document: TopLevelDocument;
  context?: "sidebar" | "drawer" | null;
  onCommentCreate?: Function;
  onCommentRemove?: Function;
  totalCommentCount: number;
  initialComments?: CommentType[] | undefined;
};

const CommentFeed = ({
  document,
  onCommentCreate,
  onCommentRemove,
  totalCommentCount,
  initialComments = undefined,
  context = null,
}: Args) => {
  const hasInitialComments = initialComments !== undefined;
  const [comments, setComments] = useState<CommentType[]>(
    initialComments || []
  );
  const [isFetching, setIsFetching] = useState<boolean>(
    hasInitialComments ? false : true
  );
  const [rootLevelCommentCount, setRootLevelCommentCount] = useState<number>(
    initialComments?.length || 0
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(
    hasInitialComments ? true : false
  );
  const [selectedSortValue, setSelectedSortValue] = useState<string | null>(
    sortOpts[0].value
  );
  const [selectedFilterValue, setSelectedFilterValue] = useState<string | null>(
    filterOpts[0].value
  );
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [currentDocumentId, setCurrentDocumentId] = useState<ID | null>(null);
  const dispatch = useDispatch();

  const handleFetch = async ({
    sort,
    filter,
  }: {
    sort?: string | null;
    filter?: string | null;
  }) => {
    setIsFetching(true);
    try {
      const { comments, count } = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
        sort: sort || sort === null ? sort : selectedSortValue,
        filter: filter || filter === null ? filter : selectedFilterValue,
      });

      const parsedComments = comments.map((raw: any) => parseComment({ raw }));

      setComments(parsedComments);
      setRootLevelCommentCount(count);
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

    typeof onCommentCreate === "function" && onCommentCreate(comment);
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
      localWarn(
        `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
      );
    }
  };

  const onRemove = ({ comment }: { comment: CommentType }) => {
    const found = findComment({ id: comment.id, comments });
    if (found) {
      removeComment({
        comment: found.comment,
        list: comments,
      });
      const isRootComment = !comment.parent;
      if (isRootComment) {
        setRootLevelCommentCount(rootLevelCommentCount - 1);
      } else {
        comment!.parent!.childrenCount -= 1;
      }
      const updatedComments = [...comments];

      setComments(updatedComments);
      onCommentRemove && onCommentRemove(comment);
    } else {
      localWarn(
        `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
      );
    }
  };

  const handleCommentCreate = async ({
    content,
    commentType,
    parentId,
    bountyAmount,
    mentions,
  }: {
    content: object;
    commentType: COMMENT_TYPES;
    parentId: ID;
    bountyAmount?: number;
    mentions?: Array<string>;
  }) => {
    try {
      const isRootComment = !parentId;
      let parentComment: CommentType | undefined;
      if (parentId) {
        parentComment = findComment({
          id: parentId,
          comments: comments,
        })?.comment;

        if (!parentComment) {
          localWarn(
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
        mentions,
      });

      onCreate({ comment, parent: parentComment });
      if (isRootComment) {
        setRootLevelCommentCount(rootLevelCommentCount + 1);
      }
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
        localWarn(
          `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
        );
      }
    } else {
      setComments([...comments, ...fetchedComments]);
    }
  };

  const onSupport = (data: any) => {
    const found = findComment({ id: data.object_id, comments });
    if (found) {
      console.log(found);
      const updatedComment = { ...found.comment };
      const tip: Purchase = {
        amount: data.amount,
        // @ts-ignore
        createdBy: currentUser,
      };
      updatedComment.tips.push(tip);
      onUpdate({ comment: updatedComment });
    }
  };

  const fetchMore = async () => {
    setIsFetching(true);
    try {
      const nextPage = currentPage + 1;
      const { comments } = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
        sort: selectedSortValue,
        filter: selectedFilterValue,
        page: nextPage,
      });

      const parsedComments = comments.map((raw: any) => parseComment({ raw }));

      setCurrentPage(nextPage);
      onFetchMore({
        fetchedComments: parsedComments,
      });
    } catch (error) {
      console.log("error", error);
      // FIXME: Implement error handling
    } finally {
      setIsFetching(false);
    }
  };

  const resetFeed = async () => {
    setComments([]);
    setCurrentPage(1);
    setSelectedSortValue(sortOpts[0].value);
    setSelectedFilterValue(filterOpts[0].value);
    setRootLevelCommentCount(0);
  };

  useEffect(() => {
    const documentHasChanged = document.id && document.id !== currentDocumentId;
    if (documentHasChanged && !hasInitialComments) {
      resetFeed();
      handleFetch({});
      setCurrentDocumentId(document.id);
    }
  }, [document.id, currentDocumentId, hasInitialComments]);

  const isQuestion = document?.unifiedDocument?.documentType === "question";
  const noResults =
    (document.isReady && rootLevelCommentCount === 0) ||
    (selectedFilterValue !== null && comments.length === 0);
  const WrapperEl =
    context === "sidebar"
      ? CommentSidebar
      : context === "drawer"
      ? CommentDrawer
      : React.Fragment;
  const isNarrowWidthContext = context === "sidebar" || context === "drawer";

  return (
    <CommentTreeContext.Provider
      value={{
        sort: selectedSortValue,
        filter: selectedFilterValue,
        comments,
        context,
        onCreate,
        onUpdate,
        onRemove,
        onFetchMore,
      }}
    >
      {/* @ts-ignore */}
      <WrapperEl
        {...(context ? { isInitialFetchDone } : {})}
        {...(context ? { totalCommentCount } : {})}
      >
        <ContentSupportModal
          // @ts-ignore
          onSupport={(data: any) => {
            onSupport(data);
          }}
        />
        {!isInitialFetchDone ? (
          <div
            className={css(
              isNarrowWidthContext && styles.sectionForNarrowWidthContexts
            )}
          >
            <CommentPlaceholder />
          </div>
        ) : (
          <>
            <div
              className={css(
                styles.editorWrapper,
                isNarrowWidthContext && styles.sectionForNarrowWidthContexts
              )}
            >
              <CommentEditor
                editorId="new-thread"
                handleSubmit={handleCommentCreate}
                allowBounty={true}
                author={currentUser?.authorProfile}
                previewModeAsDefault={context ? true : false}
                allowCommentTypeSelection={!isQuestion}
                editorStyleOverride={
                  context === "drawer" ? styles.roundedEditor : null
                }
              />
            </div>

            <div className={css(styles.filtersWrapper)}>
              <CommentFilters
                selectedFilterValue={selectedFilterValue}
                hideOptions={isQuestion ? [COMMENT_TYPES.REVIEW] : []}
                handleSelect={(fval) => {
                  resetFeed();
                  setIsFetching(true);
                  setSelectedFilterValue(fval);
                  handleFetch({ filter: fval, sort: selectedSortValue });
                }}
              />
              <div className={css(styles.sortWrapper)}>
                <CommentSort
                  selectedSortValue={selectedSortValue}
                  handleSelect={(sval) => {
                    setSelectedSortValue(sval);
                    setIsFetching(true);
                    setComments([]);
                    handleFetch({ sort: sval });
                  }}
                />
              </div>
            </div>

            <div
              className={css(
                isNarrowWidthContext && styles.sectionForNarrowWidthContexts
              )}
            >
              <CommentList
                isRootList={true}
                comments={comments}
                totalCount={rootLevelCommentCount}
                isFetching={isFetching}
                document={document}
                handleFetchMore={fetchMore}
              />
            </div>

            {noResults && (
              <CommentEmptyState
                height={context === "sidebar" ? "60%" : "300px"}
                forSection={selectedFilterValue}
                documentType={document.documentType}
              />
            )}
          </>
        )}
      </WrapperEl>
    </CommentTreeContext.Provider>
  );
};

const styles = StyleSheet.create({
  filtersWrapper: {
    margin: "45px 0 15px 0",
    display: "flex",
    paddingBottom: 15,
    borderBottom: `1px solid ${colors.filters.divider}`,
  },
  roundedEditor: {
    borderRadius: "14px",
  },
  sortWrapper: {
    marginLeft: "auto",
  },
  editorWrapper: {
    marginBottom: 25,
  },
  sectionForNarrowWidthContexts: {
    padding: "0px 25px",
  },
});

export default CommentFeed;
