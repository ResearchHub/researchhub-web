import React, { useEffect, useState } from "react";
import { Comment as CommentType } from "./lib/types";
import { fetchCommentsAPI } from "./lib/api";
import { NullableString, TopLevelDocument } from "~/config/types/root_types";
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
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);
  const [selectedSortValue, setSelectedSortValue] = useState<string | null>(
    sortOpts[0].value
  );
  const [selectedFilterValue, setSelectedFilterValue] = useState<string | null>(
    filterOpts[0].value
  );

  const handleFetch = async ({
    sort,
    filter,
  }: {
    sort?: NullableString;
    filter?: NullableString;
  }) => {
    setIsFetching(true);
    try {
      const response = await fetchCommentsAPI({
        documentId: document.id,
        documentType: document.documentType,
        sort,
        filter,
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
    <WrapperEl comments={comments} isInitialFetchDone={isInitialFetchDone}>
      {!isInitialFetchDone ? (
        Array.from(new Array(config.comment.placeholderCount)).map((_, idx) => (
          <div>
            <CommentPlaceholder key={`placeholder-${idx}`} />
          </div>
        ))
      ) : (
        <>
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
                  setIsFetching(true);
                  setComments([]);
                  handleFetch({ filter: selectedFilterValue, sort: sval });
                  handleFetch({});
                }}
              />
            </div>
          </div>

          {noResults ? (
            <CommentEmptyState
              height={context === "sidebar" ? "60%" : "200px"}
              forSection={selectedFilterValue}
              documentType={document.documentType}
            />
          ) : (
            <CommentTreeContext.Provider
              value={{
                sort: selectedSortValue,
                filter: selectedFilterValue,
                onCreate,
                onUpdate,
                onFetchMore,
              }}
            >
              <CommentList
                isRootList={true}
                comments={comments}
                totalCount={rootLevelCommentCount}
                isFetchingList={isFetching}
                document={document}
              />
            </CommentTreeContext.Provider>
          )}
        </>
      )}
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
});

export default CommentFeed;
