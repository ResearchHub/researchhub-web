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
import { FeedStateContext } from "./lib/contexts";
import CommentEmptyState from "./CommentEmptyState";


type Args = {
  document: TopLevelDocument;
  WrapperEl?: any;
  previewModeAsDefault?: boolean;
  context: "sidebar" | null;
};

const CommentFeed = ({ document, previewModeAsDefault = false, context = null }: Args) => {
  const WrapperEl = context === "sidebar" ? CommentSidebar : React.Fragment;
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);
  const [selectedSortValue, setSelectedSortValue] = useState<string|null>(sortOpts[0].value);
  const [selectedFilterValue, setSelectedFilterValue] = useState<string|null>(filterOpts[0].value);

  const handleFetch =
    async ({ sort, filter }: { sort?: NullableString, filter?: NullableString }) => {
      setIsFetching(true);
      try {
        const response = await fetchCommentsAPI({
          documentId: document.id,
          documentType: document.documentType,
          sort,
          filter,
        });

        setComments(response.comments);
      } catch (error) {
        console.log('error', error)
        // FIXME: Implement error handling
      } finally {
        setIsFetching(false);
        setIsInitialFetchDone(true);
      }
    }

  useEffect(() => {
    if (document.id && !isInitialFetchDone) {
      handleFetch({});
    }
  }, [document.id, isInitialFetchDone]);

  const noResults = (document.isReady && document.discussionCount === 0) || (selectedFilterValue !== null && comments.length === 0)

  return (
    <WrapperEl
      comments={comments}
      isInitialFetchDone={isInitialFetchDone}
    >

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
                setSelectedFilterValue(fval)
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

          {noResults ?
            <CommentEmptyState height={context === "sidebar" ? "60%" : "200px"} forSection={selectedFilterValue} documentType={document.documentType} />          
          : (
          <FeedStateContext.Provider value={{ sort: selectedSortValue, filter: selectedFilterValue }}>
            <CommentList setComments={setComments} comments={comments} isRootList={true} isFetchingList={isFetching} document={document} />
          </FeedStateContext.Provider>
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
