import {
  Comment as CommentType,
  COMMENT_TYPES,
  parseComment,
  COMMENT_FILTERS,
  COMMENT_CONTEXTS,
} from "./lib/types";
import { CommentTreeContext } from "./lib/contexts";
import {
  createCommentAPI,
  createPeerReview,
  fetchCommentsAPI,
} from "./lib/api";
import { css, StyleSheet } from "aphrodite";
import { filterOpts, sortOpts } from "./lib/options";
import {
  ErrorWithCode,
  ID,
  Review,
  parseReview,
  parseUser,
} from "~/config/types/root_types";
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
import React, { Fragment, useEffect, useState } from "react";
import removeComment from "./lib/removeComment";
import replaceComment from "./lib/replaceComment";
import { GenericDocument } from "../Document/lib/types";
import { useRouter } from "next/router";
import getReviewCategoryScore from "./lib/quill/getReviewCategoryScore";
import { captureEvent } from "~/config/utils/events";
import getCommentFilterByTab from "../Document/lib/getCommentFilterByTab";
import { genClientId } from "~/config/utils/id";

const { setMessage, showMessage } = MessageActions;

type Args = {
  document: GenericDocument;
  context?: COMMENT_CONTEXTS;
  onCommentCreate?: Function;
  onCommentUpdate?: Function;
  onCommentRemove?: Function;
  totalCommentCount?: number;
  initialComments?: CommentType[] | undefined;
  initialFilter?: string | null;
  editorType?: COMMENT_TYPES;
  showFilters?: boolean;
  showSort?: boolean;
  allowCommentTypeSelection?: boolean;
  allowBounty?: boolean;
  tabName?: string;
};

const CommentFeed = ({
  document,
  tabName,
  onCommentCreate,
  onCommentRemove,
  onCommentUpdate,
  totalCommentCount,
  initialComments = undefined,
  initialFilter = undefined,
  context = COMMENT_CONTEXTS.GENERIC,
  showFilters = true,
  showSort = true,
  allowCommentTypeSelection = false,
  allowBounty = false,
  editorType = COMMENT_TYPES.DISCUSSION,
}: Args) => {
  const router = useRouter();
  const hasInitialComments = initialComments !== undefined;
  const [comments, setComments] = useState<CommentType[]>(
    initialComments || []
  );
  const [isFetching, setIsFetching] = useState<boolean>(
    hasInitialComments ? false : true
  );
  const [rootLevelCommentCount, setRootLevelCommentCount] = useState<number>(
    totalCommentCount > 0 ? totalCommentCount : 0
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(
    hasInitialComments ? true : false
  );
  const [selectedSortValue, setSelectedSortValue] = useState<string | null>(
    sortOpts[0].value
  );
  const [selectedFilterValue, setSelectedFilterValue] = useState<
    string | null | undefined
  >(initialFilter);

  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const [currentDocumentId, setCurrentDocumentId] = useState<ID | null>(null);
  const dispatch = useDispatch();
  const [editorId, setEditorId] = useState<string>(
    `${editorType}-new-thread-${genClientId()}`
  );

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
        tabName: tabName || router.query.tabName,
        sort: sort || sort === null ? sort : selectedSortValue,
        // @ts-ignore
        filter: filter || (filter === null ? filter : selectedFilterValue),
      });

      const parsedComments = comments.map((raw: any) => parseComment({ raw }));

      setComments(parsedComments);
      setRootLevelCommentCount(count);
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch comments",
        data: { document },
      });
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
      onCommentUpdate && onCommentUpdate({ old: found, new: comment });
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

  const handleReviewCreate = async ({
    content,
    commentId,
  }: {
    content: object;
    commentId: ID;
  }): Promise<Review | boolean> => {
    const reviewScore = getReviewCategoryScore({
      quillContents: content,
      category: "overall",
    });

    try {
      const reviewResponse = await createPeerReview({
        unifiedDocumentId: document.unifiedDocument.id,
        commentId,
        score: reviewScore,
      });

      return parseReview(reviewResponse);
    } catch (error: any) {
      captureEvent({
        error,
        msg: "Failed to create review",
        data: { reviewScore, commentId, document, content },
      });
      return false;
    }
  };

  const handleRootCommentCreate = async ({
    content,
    commentType,
    bountyAmount,
    bountyType,
    mentions,
  }: {
    content: any;
    commentType: COMMENT_TYPES;
    bountyAmount?: number;
    mentions?: Array<string>;
    bountyType: COMMENT_TYPES;
  }) => {
    let comment: CommentType;
    try {
      comment = await createCommentAPI({
        content,
        commentType,
        documentId: document.id,
        documentType: document.apiDocumentType,
        bountyAmount,
        bountyType,
        mentions,
      });

      setRootLevelCommentCount(rootLevelCommentCount + 1);
    } catch (error) {
      dispatch(setMessage("Could not create a comment at this time"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      throw error;
    }

    return comment;
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
        // @ts-ignore
        filter: selectedFilterValue,
        page: nextPage,
      });

      const parsedComments = comments.map((raw: any) => parseComment({ raw }));

      setCurrentPage(nextPage);
      onFetchMore({
        fetchedComments: parsedComments,
      });
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch more comments",
        data: { document },
      });
    } finally {
      setIsFetching(false);
    }
  };

  const resetFeed = async () => {
    setComments([]);
    setCurrentPage(1);
    setSelectedSortValue(sortOpts[0].value);
    setSelectedFilterValue(initialFilter);
    setRootLevelCommentCount(0);
  };

  useEffect(() => {
    const documentHasChanged = document.id && document.id !== currentDocumentId;
    if (documentHasChanged && !hasInitialComments) {
      resetFeed();
      handleFetch({ filter: selectedFilterValue });
      setCurrentDocumentId(document.id);
    }
  }, [document.id, currentDocumentId, hasInitialComments]);

  // This hook is used to reset the feed when tab changes.
  // In such a case, the comments will be loaded when the page is statically rendered.
  useEffect(() => {
    setCurrentPage(1);
    setRootLevelCommentCount(totalCommentCount || 0);
    setComments(initialComments || []);

    // @ts-ignore
    const filter = getCommentFilterByTab(router?.query?.tabName);
    setSelectedFilterValue(filter);
    handleFetch({ filter });
  }, [router?.query?.tabName]);

  const isQuestion = document?.unifiedDocument?.documentType === "question";
  const noResults =
    rootLevelCommentCount === 0 ||
    (selectedFilterValue !== null && comments.length === 0);
  const WrapperEl =
    context === COMMENT_CONTEXTS.SIDEBAR
      ? CommentSidebar
      : context === COMMENT_CONTEXTS.DRAWER
      ? CommentDrawer
      : Fragment;
  const isNarrowWidthContext =
    context === COMMENT_CONTEXTS.SIDEBAR || context === COMMENT_CONTEXTS.DRAWER;
  let wrapperProps = {};
  if (isNarrowWidthContext) {
    wrapperProps = { isInitialFetchDone, totalCommentCount };
  }

  return (
    <CommentTreeContext.Provider
      value={{
        sort: selectedSortValue,
        filter: selectedFilterValue,
        comments,
        context,
        document,
        onCreate,
        onUpdate,
        onRemove,
        onFetchMore,
      }}
    >
      {/* @ts-ignore */}
      <WrapperEl {...wrapperProps}>
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
                key={editorId}
                editorId={editorId}
                commentType={editorType}
                handleSubmit={async (props) => {
                  try {
                    if (props.commentType === COMMENT_TYPES.REVIEW) {
                      const reviewScore = getReviewCategoryScore({
                        quillContents: props.content,
                        category: "overall",
                      });

                      if (reviewScore === 0) {
                        throw new ErrorWithCode({
                          message:
                            "Please select a review score before submitting",
                          code: "NO_REVIEW_SCORE",
                        });
                      }
                    }

                    let comment = (await handleRootCommentCreate(
                      props
                    )) as CommentType;
                    if (comment.commentType === COMMENT_TYPES.REVIEW) {
                      const review = await handleReviewCreate({
                        commentId: comment.id,
                        content: comment.content,
                      });

                      comment = { ...comment, review: review as Review };
                    }
                    onCreate({ comment });
                    setEditorId(`${editorType}-new-thread-${genClientId()}`);
                  } catch (error: any) {
                    if (error instanceof ErrorWithCode) {
                      dispatch(setMessage(error.message));
                    } else {
                      dispatch(
                        setMessage("Could not create a comment at this time")
                      );
                      captureEvent({
                        error,
                        msg: `Failed to create ${props.commentType}`,
                        data: {
                          props,
                        },
                      });
                    }
                    // @ts-ignore
                    dispatch(showMessage({ show: true, error: true }));
                    throw error;
                  }
                }}
                allowBounty={allowBounty}
                author={currentUser?.authorProfile}
                allowCommentTypeSelection={allowCommentTypeSelection}
                editorStyleOverride={
                  context === COMMENT_CONTEXTS.DRAWER
                    ? styles.roundedEditor
                    : null
                }
              />
            </div>

            {(showSort || showFilters) && (
              <div className={css(styles.filtersWrapper)}>
                {showFilters && (
                  <CommentFilters
                    selectedFilterValue={selectedFilterValue}
                    hideOptions={isQuestion ? [COMMENT_TYPES.REVIEW] : []}
                    handleSelect={(fval) => {
                      resetFeed();
                      setIsFetching(true);
                      setSelectedFilterValue(fval);
                      handleFetch({
                        filter: fval,
                        sort: selectedSortValue,
                      });
                    }}
                  />
                )}
                {showSort && (
                  <div className={css(styles.sortWrapper)}>
                    <CommentSort
                      selectedSortValue={selectedSortValue}
                      dropdownDirection={
                        showFilters ? "bottom-right" : "bottom-left"
                      }
                      handleSelect={(sval) => {
                        setSelectedSortValue(sval);
                        setIsFetching(true);
                        setComments([]);
                        handleFetch({ sort: sval });
                      }}
                    />
                  </div>
                )}
              </div>
            )}

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
                height={context === COMMENT_CONTEXTS.SIDEBAR ? "60%" : "300px"}
                forSection={selectedFilterValue}
                documentType={document.type}
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
    justifyContent: "space-between",
  },
  roundedEditor: {
    borderRadius: "14px",
  },
  sortWrapper: {},
  editorWrapper: {
    marginBottom: 25,
  },
  sectionForNarrowWidthContexts: {
    padding: "0px 25px",
  },
});

export default CommentFeed;
