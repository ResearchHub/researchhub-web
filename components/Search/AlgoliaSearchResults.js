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

  const _formatProps = () => {
    const result = {
      ...hit,
      meta: { highlight: null },
      indexName: "paper",
    };

    // const indexName = 'paper'
    // const props = {
    //   indexName,
    //   result: Object.assign({}, item, {meta: {}}),
    //   clearSearch: () => 'meow',
    //   firstOfItsType: false,
    //   query: query,
    // };

    if (indexName === "author") {
      result.score = hit.author_score;
    }

    return { result, indexName, firstOfItsType, onClickCallBack };
  };

  return (
    <div className={css(styles.hit)}>
      <SearchEntry {..._formatProps()} />
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
