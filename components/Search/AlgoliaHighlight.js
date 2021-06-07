import { connectHighlight } from "react-instantsearch-dom";
import { get } from "lodash";
import PropTypes from "prop-types";

const AlgoliaHighlight = ({ result, highlight, attribute, className }) => {
  const snippet = get(result, `_snippetResult[${attribute}]`);

  const highlightProperty =
    snippet && snippet.matchLevel !== "none"
      ? "_snippetResult"
      : "_highlightResult";

  const parsedHit = highlight({
    highlightProperty,
    attribute,
    hit: result,
  });

  return (
    <span className={className}>
      {parsedHit.map((part, index) =>
        part.isHighlighted ? (
          <mark key={index}>{part.value}</mark>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
};

AlgoliaHighlight.propTypes = {
  result: PropTypes.object.isRequired,
  highlight: PropTypes.func.isRequired,
  attribute: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default connectHighlight(AlgoliaHighlight);
