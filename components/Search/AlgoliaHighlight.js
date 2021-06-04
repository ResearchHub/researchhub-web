import { connectHighlight } from "react-instantsearch-dom";
import { css, StyleSheet } from "aphrodite";

const AlgoliaHighlight = ({ result, highlight, attribute, hit, styles }) => {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit: result,
  });

  return (
    <span className={css(styles && styles)}>
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
