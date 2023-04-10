import React, { useEffect, useState } from "react";
import { Comment as CommentType, COMMENT_TYPES } from "./lib/types";
import { createCommentAPI, fetchCommentsAPI } from "./lib/api";
import { ID, parseUser, TopLevelDocument } from "~/config/types/root_types";
import CommentFilters from "./CommentFilters";
import { css, StyleSheet } from "aphrodite";
import { filterOpts, sortOpts } from "./lib/options";
import CommentSort from "./CommentSort";
import CommentSidebar from "./CommentSidebar";
import CommentList from "./CommentList";
import CommentPlaceholder from "./CommentPlaceholder";
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
import colors from "./lib/colors";
import { Purchase } from "~/config/types/purchase";
import { MessageActions } from "~/redux/message";
const { setMessage, showMessage } = MessageActions;

type Args = {
  document: TopLevelDocument;
  context: "sidebar" | "drawer" | null;
  onCommentCreate?: Function;
  totalCommentCount: number;
};

const CommentFeed = ({
  document,
  onCommentCreate,
  totalCommentCount,
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
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
        sort: sort || sort === null ? sort : selectedSortValue,
        filter: filter || filter === null ? filter : selectedFilterValue,
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
      const isRootComment = !parentId;
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
        console.warn(
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
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
        sort: selectedSortValue,
        filter: selectedFilterValue,
        page: nextPage,
      });

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

  const resetFeed = async () => {
    setComments([]);
    setCurrentPage(1);
    setSelectedSortValue(sortOpts[0].value);
    setSelectedFilterValue(filterOpts[0].value);
    setRootLevelCommentCount(0);
  };

  useEffect(() => {
    if (document.id && document.id !== currentDocumentId) {
      resetFeed();
      handleFetch({});
      setCurrentDocumentId(document.id);
    }
  }, [document.id, currentDocumentId]);

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
