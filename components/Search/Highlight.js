import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";
import icons from "../../config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { doesNotExist } from "~/config/utils";

const Highlight = ({ result, attribute }) => {
  const { meta } = result;
  const { highlight } = meta;

  const highlightSpan = formatHighlightByAttribute();

  function formatHighlightByAttribute() {
    switch (attribute) {
      case "authors":
        return transformAuthors();
      case "first_name":
      case "last_name":
      case "title":
      case "abstract":
      default:
        return parseHighlight();
    }
  }

  function parseHighlight(_text) {
    if (
      doesNotExist(_text) &&
      (doesNotExist(highlight) || doesNotExist(highlight[attribute]))
    )
      return result[attribute];

    const text = _text ? _text : highlight[attribute][0];
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
