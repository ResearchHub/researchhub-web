import { css, StyleSheet } from "aphrodite";
import { connectInfiniteHits } from "react-instantsearch-dom";
import AlgoliaHit from "~/components/Search/AlgoliaHit";
import PropTypes from "prop-types";

const AlgoliaInfiniteResults = ({
  hits,
  hasMore,
  refineNext,
  handleResultClick,
}) => {
  const renderResults = () => {
    if (!hits.length) {
      return renderEmptyState();
    }

    return (
      <div className={css(styles.searchResults)}>
        {hits.map((hit, i) => (
          <AlgoliaHit
            hit={hit}
            indexName={`paper`}
            firstOfItsType={hit.__position === 1}
            handleResultClick={handleResultClick}
            key={hit.objectID}
          />
        ))}
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className={css(styles.emptyResults)}>
        <h3 className={css(styles.emptyTitle)}>
          We can't find what you're looking for! Please try another search.
        </h3>
        <img
          src={"/static/icons/search-empty.png"}
          className={css(styles.emptyImg)}
        />
      </div>
    );
  };

  return (
    <div>
      {renderResults()}
      {hasMore && (
        <button
          className={css(styles.loadMoreBtn)}
          disabled={!hasMore}
          onClick={refineNext}
        >
          Load More Results
        </button>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  searchResults: {
    borderBottom: "1.5px solid #EDEDED",
    top: 40,
    width: "100%",
    minWidth: "unset",
  },
  loadMoreBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    color: "#FFF",
    fontSize: 15,
    backgroundColor: "#4E53FF",
    height: 45,
    borderRadius: 4,
    cursor: "pointer",
    border: "none",
    outline: "none",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  emptyResults: {
    padding: "15px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontWeight: 400,
    fontSize: 18,
  },
  emptyImg: {
    height: 60,
  },
});

AlgoliaInfiniteResults.propTypes = {
  hits: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  refineNext: PropTypes.func.isRequired,
  handleResultClick: PropTypes.func,
};

export default connectInfiniteHits(AlgoliaInfiniteResults);
