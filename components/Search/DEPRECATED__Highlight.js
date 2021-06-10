import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import { doesNotExist } from "~/config/utils";

const Highlight = (props) => {
  const { result, attribute } = props;
  const { highlight } = result.meta;

  const highlightSpan = formatHighlightByAttribute();

  function formatHighlightByAttribute() {
    switch (attribute) {
      case "authors":
        return transformAuthors();
      case "abstract":
      case "first_name":
      case "last_name":
      case "title":
      default:
        return parseHighlight();
    }
  }

  function parseHighlight(_text) {
    if (doesNotExist(highlight) || doesNotExist(highlight[attribute])) {
      if (doesNotExist(_text)) {
        return result[attribute];
      }
    }

    const text = _text
      ? _text
      : highlight[attribute] && highlight[attribute][0];

    const parts = text.split(/(<em>[^<]+<\/em>)/);
    const parsedString = parts.map((part) => {
      if (part.includes("<em>")) {
        let replaced = part.replace("<em>", "");
        replaced = replaced.replace("</em>", "");
        return <span className={css(styles.highlight)}>{replaced}</span>;
      }
      return <span>{part}</span>;
    });

    return parsedString;
  }

  function transformAuthors() {
    const authors =
      highlight && highlight.authors ? highlight.authors : result.authors;

    return (
      <div className={css(styles.authors) + " clamp1"}>
        {"by "}
        {authors.map((author, i) => {
          let isLast = i === authors.length - 1;
          let result = parseHighlight(author);

          if (isLast) {
            return result;
          }

          return (
            <Fragment>
              {result}
              {", "}
            </Fragment>
          );
        })}
      </div>
    );
  }

  return highlightSpan ? highlightSpan : null;
};

const styles = StyleSheet.create({
  authors: {
    fontSize: 12,
    fontWeight: 400,
    color: "#918F9B",
    marginTop: 5,
  },
  highlight: {
    backgroundColor: "#f6e653",
    padding: "2px 1px 2px 1px",
    fontStyle: "italic",
  },
});

export default Highlight;
