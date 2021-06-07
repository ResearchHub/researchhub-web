import { connectHighlight } from "react-instantsearch-dom";
import { css, StyleSheet } from "aphrodite";
import { get } from "lodash";

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

export default connectHighlight(AlgoliaHighlight);
