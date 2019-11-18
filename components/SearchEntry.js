import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Router from "next/router";
import { Value } from "slate";
import Plain from "slate-plain-serializer";
// Redux
import { MessageActions } from "~/redux/message";

// Components
import University from "./University";
import AuthorAvatar from "~/components/AuthorAvatar";
import TextEditor from "./TextEditor/index";

// Config
import colors from "../config/themes/colors";
import icons from "~/config/themes/icons";
import { formatPublishedDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";
import { convertToEditorValue } from "~/config/utils";

const search_fields = [
  "title",
  "text",
  "first_name",
  "last_name",
  "authors",
  "name",
  "summary",
];

class SearchEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexName: false,
      hidden: false,
    };
  }

  configureLink() {
    // create link
  }

  /**
   * We want to take the user to the appropriate page when they click a search result
   */
  handleClick = () => {
    let { indexName, result } = this.props;
    if (indexName === "author") {
      let { id } = result;
      return Router.push(
        "/user/[authorId]/[tabName]",
        `/user/${id}/contributions`
      );
    }
  };

  parseHighlightField = (highlight, key) => {
    let { indexName, result } = this.props;
    let textArr = highlight[key][0].split(" ");
    console.log("textArr", textArr);
    let highlightedIndex = {};

    textArr.forEach((text, i, arr) => {
      if (text[0] === "<") {
        if (text.split("</em>").length > 1) {
          let splitArr = text.slice(4).split("</em>");
          console.log("splitArr", splitArr);
          let highlighted = splitArr[0];
          let normal = splitArr[1];
          arr[i] = highlighted;
          arr.splice(i + 1, 0, normal);
        } else {
          arr[i] = text.slice(4, text.length - 5);
        }
        highlightedIndex[i] = true;
      }
    });

    return textArr.map((text, i) => {
      if (highlightedIndex[i]) {
        return (
          <span className={css(styles.highlight)}>
            {highlightedIndex[i - 1] ? " " : ""}
            {text}
          </span>
        );
      } else {
        return `${highlightedIndex[i - 1] ? " " : ""}${text}${
          i !== textArr.length - 1 ? " " : ""
        }`;
      }
    });
  };

  convertDate = (date) => {
    return formatPublishedDate(transformDate(date));
  };

  transformAuthors = () => {
    let { result } = this.props;
    let { authors, meta } = result;
    if (result.meta.highlight.authors) {
      return (
        <div className={css(styles.authors)}>
          {authors.length < 2 ? "Author: " : "Authors: "}
          {this.parseHighlightField(result.meta.highlight, "authors")}
        </div>
      );
    } else {
      return (
        <div className={css(styles.authors)}>
          {authors.length < 2 ? "Author: " : "Authors: "}
          {authors.map((author, i) => {
            if (i !== authors.length - 1) {
              return `${author}, `;
            } else {
              return author;
            }
          })}
        </div>
      );
    }
  };

  renderMainText = () => {
    let { indexName, result } = this.props;
    if (indexName === "author") {
      let { first_name, last_name, meta } = result;
      let highlight = meta.highlight;
      return (
        <Fragment>
          <span
            className={css(
              styles.firstName,
              highlight.first_name && styles.highlight
            )}
          >
            {first_name && first_name}
          </span>
          <span
            className={css(
              styles.lasttName,
              highlight.last_name && styles.highlight
            )}
          >
            {last_name && ` ${last_name}`}
          </span>
        </Fragment>
      );
    } else if (indexName === "paper" || indexName === "discussion_thread") {
      let { meta, title } = result;
      let highlight = meta.highlight;
      if (highlight && highlight.title) {
        return this.parseHighlightField(highlight, "title");
      } else {
        return title;
      }
    } else if (indexName === "discussion_thread") {
      let { title, meta } = result;
      let highlight = meta.highlight;
      if (highlight.title) {
        return this.parseHighlightField(highlight, "title");
      } else {
        return title;
      }
    }
  };

  renderMetaDataOne = () => {
    let { indexName, result } = this.props;
    if (indexName === "author") {
      let { university } = result;
      return <University university={university} />;
    } else if (indexName === "paper") {
      let { paper_publish_date } = result;
      if (paper_publish_date) {
        return (
          <span className={css(styles.publishDate)}>
            {this.convertDate(paper_publish_date)}
          </span>
        );
      }
    } else if (indexName === "discussion_thread") {
      // debugger;
      // console.log(result);
      // JSON.parse(result.text);
      // TODO: convert the string returned in the backend to JSON
      // return (
      //   <div className={css(styles.discText)}>
      //     {highlight && highlight.text
      //       ? this.parseHighlightField(highlight, 'text')
      //       : text
      //     }
      //   </div>
      // )
    }
  };

  renderMetaDataTwo = () => {
    let { indexName, result } = this.props;
    if (indexName === "author") {
      return "";
    } else if (indexName === "paper") {
      let { authors } = result;
      return authors.length > 0 && this.transformAuthors();
    } else if (indexName === "discussion_thread") {
      return "";
    }
  };

  renderCount = () => {
    let { indexName, result } = this.props;
    console.log("called");
    if (indexName !== "paper" || indexName !== "discussion_thread") {
      return null;
    } else {
      let count =
        indexName === "paper" ? result.discussion_count : result.commentCount;
      return (
        <div className={css(styles.discussion)}>
          <span className={css(styles.icon)}>{icons.chat}</span>
          <span className={css(styles.dicussionCount)}>
            {indexName === "paper"
              ? `${result.discussion_count} ${
                  count > 1
                    ? "discussions"
                    : count === 0
                    ? "discussions"
                    : "discussion"
                }`
              : `${result.commentCount} ${
                  count > 1 ? "comments" : count === 0 ? "comments" : "comment"
                }`}
          </span>
        </div>
      );
    }
  };

  render() {
    let { indexName, result } = this.props;
    let {
      authors,
      discussion,
      doi,
      hubs, // array
      id,
      meta, // doc_type, highlight (title: array ), id, index, score
      paper_publish_date,
      publication_type,
      score,
      title,
      url,
    } = this.props.result;

    return (
      <div className={css(styles.searchEntryCard)} onClick={this.handleClick}>
        <div
          className={css(
            styles.column,
            styles.left,
            indexName === "author" && styles.isAuthor
          )}
        >
          {indexName === "author" ? (
            <div className={css(styles.avatarDisplay)}>
              {result.profile_image ? (
                <img
                  src={result.profile_image}
                  className={css(styles.avatar)}
                />
              ) : (
                <i
                  className={
                    css(styles.avatar, styles.defaultAvatar) +
                    " fas fa-user-circle"
                  }
                />
              )}
            </div>
          ) : (
            <div className={css(styles.voteDisplay)}>{score && score}</div>
          )}
        </div>
        <div className={css(styles.column, styles.right)}>
          <div className={css(styles.mainText)}>{this.renderMainText()}</div>
          <div className={css(styles.metaDataOne)}>
            {this.renderMetaDataOne()}
          </div>
          <div className={css(styles.metaDataTwo)}>
            {this.renderMetaDataTwo()}
          </div>
        </div>
        <div className={css(styles.indexTag)}>
          {indexName === "discussion_thread" ? "disc." : indexName}
        </div>
        <div className={css(styles.countTag)}>{this.renderCount()}</div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  searchEntryCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 100,
    width: "calc(100% - 40px)",
    padding: 20,
    position: "relative",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  left: {
    marginRight: 20,
  },
  right: {
    justifyContent: "space-between",
    height: "100%",
  },
  avatarDisplay: {
    height: "100%",
  },
  voteDisplay: {
    color: "rgb(100, 196, 143)",
    fontWeight: "bold",
    background: "rgb(233, 250, 234)",
    borderRadius: 25,
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  highlight: {
    // backgroundColor: colors.LIGHT_YELLOW(1),
    backgroundColor: "#f6e653",
    padding: "5px 1px 5px 1px",
  },
  mainText: {
    fontSize: 22,
    color: "rgb(35, 32, 56)",
    fontWeight: 400,
    padding: "15px 0 15px 0",
  },
  metaDataOne: {
    fontSize: 16,
    paddingBottom: 15,
  },
  metDateTwo: {
    paddingBottom: 15,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    objectFit: "contain",
  },
  defaultAvatar: {
    color: "#aaa",
    fontSize: 50,
  },
  indexTag: {
    position: "absolute",
    textTransform: "uppercase",
    right: 20,
    bottom: 20,
    color: colors.BLUE(1),
    fontSize: 14,
  },
  publishDate: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
  },
  authors: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
  },
  discText: {
    marginBottom: 15,
  },
  icon: {
    color: "#C1C1CF",
  },
  countTag: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  discussion: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dicussionCount: {
    color: "#918f9b",
    marginLeft: 7,
  },
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchEntry);
