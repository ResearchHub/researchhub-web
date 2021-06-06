import { css, StyleSheet } from "aphrodite";
import { connectInfiniteHits } from "react-instantsearch-dom";
import SearchEntry from "~/components/Search/SearchEntry";

const AlgoliaInfiniteResults = ({
  hits,
  hasMore,
  refineNext,
  onClickCallBack,
}) => {
  const renderResults = () => {
    if (!hits.length) {
      return renderEmptyState();
    }

    let prevType;
    return hits.map((hit, i) => {
      return (
        <Hit
          hit={hit}
          indexName={`paper`}
          firstOfItsType={hit.__position === 1}
          onClickCallBack={onClickCallBack}
          key={hit.objectID}
        />
      );
    });
  };

  const renderEmptyState = () => {
    return (
      <div className={css(styles.emptyResults)}>
        <h3 className={css(styles.emptyTitle)}>
          We can't find what you're looking for! Please try another search.
        </h3>
        <img
          src={"/static/icons/search-empty.png"}
          className={css(styles.logo)}
        />
      </div>
    );
  };

  return (
    <div>
      {renderResults()}
      {hasMore && (
        <button
          className={css(styles.button)}
          disabled={!hasMore}
          onClick={refineNext}
        >
          Load More Results
        </button>
      )}
    </div>
  );
};

const Hit = (props) => {
  const { hit, indexName, firstOfItsType, onClickCallBack } = props;

  // FIXME: Kobe, 06/06, Building props is for backwards compatibility.
  // This can be removed once Algolia is a fully integrated solution.
  const buildPropsForSearchEntry = () => {
    const result = {
      ...hit,
      meta: { highlight: null },
      indexName: "paper",
      hubs: hit.paper_hubs,
      authors: hit.authors_str,
    };

    if (result._highlightResult) {
      result._highlightResult.authors = result._highlightResult.authors_str;
    }

    return { result, indexName, firstOfItsType, onClickCallBack };
  };

  return (
    <div className={css(styles.hit)}>
      <SearchEntry {...buildPropsForSearchEntry()} />
    </div>
  );
};

const styles = StyleSheet.create({
  hit: {
    borderBottom: "1.5px solid #EDEDED",
  },
  button: {
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
  logo: {
    height: 60,
  },
});

const AlgoliaSearchResults = connectInfiniteHits(AlgoliaInfiniteResults);

export default AlgoliaSearchResults;
