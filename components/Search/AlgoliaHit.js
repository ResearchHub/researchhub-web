import LegacySearchEntry from "~/components/Search/LegacySearchEntry";
import PropTypes from "prop-types";

const AlgoliaHit = ({
  hit,
  indexName,
  handleResultClick,
  firstOfItsType = false,
}) => {
  // FIXME: Kobe, 06/06, Building props is for backwards compatibility with SearchEntry.
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
      result._snippetResult.authors = result._snippetResult.authors_str;
    }

    return {
      result,
      indexName,
      firstOfItsType,
      onClickCallBack: handleResultClick,
    };
  };

  return <LegacySearchEntry {...buildPropsForSearchEntry()} />;
};

AlgoliaHit.propTypes = {
  hit: PropTypes.object,
  indexName: PropTypes.string.isRequired,
  handleResultClick: PropTypes.func,
  firstOfItsType: PropTypes.bool,
};

export default AlgoliaHit;
