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
import { formatDateStandard } from "~/config/utils";
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
      activeFields: 1,
    };
  }

  configureLink() {
    // create link
  }

  /**
   * We want to take the user to the appropriate page when they click a search result
   */
  handleClick = () => {
    let { indexName, result, clearSearch } = this.props;
    let { id } = result;
    clearSearch && clearSearch();
    if (indexName === "author") {
      return Router.push(
        "/user/[authorId]/[tabName]",
        `/user/${id}/contributions`
      );
    } else if (indexName === "paper") {
      return Router.push("/paper/[paperId]/[tabName]", `/paper/${id}/summary`);
    } else if (indexName === "discussion_thread") {
      let { paper } = result;
      return Router.push(
        "/paper/[paperId]/[tabName]/[discussionThreadId]",
        `/paper/${paper}/discussion/${id}`
      );
    }
  };

  parseHighlightField = (highlight, key) => {
    let { indexName, result } = this.props;
    let textArr = highlight[key][0].split(" ");
    let highlightedIndex = {};

    textArr.forEach((text, i, arr) => {
      if (text[0] === "<") {
        if (text.split("</em>").length > 1) {
          let splitArr = text
            .slice(4)
            .split("</em>")
            .filter((el) => el !== "");
          let highlighted = splitArr[0];
          arr[i] = highlighted;

          if (splitArr.length > 1) {
            let normal = splitArr[1].slice(4);
            textArr.splice(i + 1, 0, normal);
            highlightedIndex[i + 1] = true;
          }
        } else {
          arr[i] = text.slice(4, text.length - 5);
        }
        highlightedIndex[i] = true;
      }
    });

    let transformedText = textArr.map((text, i) => {
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

    if (key === "tagline") {
      transformedText.push("...");
    }
    return transformedText;
  };

  convertDate = (date) => {
    return formatDateStandard(transformDate(date));
  };

  transformAuthors = () => {
    let { result } = this.props;
    let { authors, meta } = result;
    if (result.meta.highlight.authors) {
      return (
        <div className={css(styles.authors)}>
          {"by "}
          {this.parseHighlightField(result.meta.highlight, "authors")}
        </div>
      );
    } else {
      return (
        <div className={css(styles.authors)}>
          {"by "}
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
    } else if (indexName === "paper") {
      let { meta, title, authors } = result;
      let highlight = meta.highlight;
      return (
        <span className={css(styles.paperTitle)}>
          {highlight && highlight.title
            ? this.parseHighlightField(highlight, "title")
            : title}
          {authors && authors.length > 0 ? (
            this.transformAuthors()
          ) : (
            <div className={css(styles.authors)}>No attributed author</div>
          )}
        </span>
      );
    } else if (indexName === "discussion_thread") {
      let { meta, title, paperTitle } = result;
      let highlight = meta.highlight;
      return (
        <span className={css(styles.discTitle)}>
          {highlight && highlight.title
            ? this.parseHighlightField(highlight, "title")
            : title}
          {paperTitle && (
            <div className={css(styles.publishDate, styles.paddedContainer)}>
              <span className={css(styles.icon, styles.paperIcon)}>
                {icons.file}
              </span>{" "}
              {paperTitle}
            </div>
          )}
        </span>
      );
    }
  };

  renderMetaDataOne = () => {
    let { indexName, result } = this.props;
    if (indexName === "author") {
      let { university } = result;
      if (Object.keys(university).length) {
        return (
          <span className={css(styles.paddedContainer)}>
            <University university={university} />
          </span>
        );
      }
    } else if (indexName === "paper") {
      let { tagline } = result;
      let highlight = result.meta.highlight;
      if (tagline) {
        return (
          <div className={css(styles.tagline)}>
            {highlight && highlight.tagline
              ? this.parseHighlightField(highlight, "tagline")
              : tagline}
          </div>
        );
      }
    } else if (indexName === "discussion_thread") {
      let highlight = result.meta.highlight;
      let { plainText } = result;
      return (
        <div className={css(styles.discText)}>
          {highlight && highlight.plain_text
            ? this.parseHighlightField(highlight, "plain_text")
            : plainText}
        </div>
      );
    }
  };

  renderMetaDataTwo = () => {
    let { indexName, result } = this.props;
    if (indexName === "author") {
      return;
    } else if (indexName === "paper") {
    } else if (indexName === "discussion_thread") {
    }
  };

  renderCount = () => {
    let { indexName, result } = this.props;
    if (indexName === "paper" || indexName === "discussion_thread") {
      let count =
        indexName === "paper" ? result.discussion_count : result.commentCount;
      return (
        <div className={css(styles.discussion)}>
          <span className={css(styles.icon)}>{icons.chat}</span>
          <span className={css(styles.discussionCount)}>
            {indexName === "paper" ? (
              <Fragment>
                <span className={css(styles.count)}>
                  {result.discussion_count}{" "}
                </span>
                {count > 1
                  ? "discussions"
                  : count === 0
                  ? "discussions"
                  : "discussion"}
              </Fragment>
            ) : (
              <Fragment>
                <span className={css(styles.count)}>
                  {result.commentCount}{" "}
                </span>
                {count > 1 ? "comments" : count === 0 ? "comments" : "comment"}
              </Fragment>
            )}
          </span>
        </div>
      );
    } else {
      return;
    }
  };

  renderBulletPoints = () => {
    let { indexName, result } = this.props;
    if (indexName === "paper") {
      let { hubs, paper_publish_date } = result;
      return (
        <Fragment>
          <div className={css(styles.bullet)}>{this.renderCount()}</div>
          <div className={css(styles.bullet)}>
            <div className={css(styles.discussion)}>
              <span className={css(styles.icon)}>{icons.hub}</span>
              <span className={css(styles.discussionCount)}>
                <span className={css(styles.count)}>
                  {hubs && hubs.length}{" "}
                </span>
                hub{(hubs.length > 1 || hubs.length === 0) && "s"}
              </span>
            </div>
          </div>
          <div className={css(styles.bullet)}>
            <div className={css(styles.discussion)}>
              <span className={css(styles.icon)}>
                <i className={"fad fa-clock"} />
              </span>
              <span className={css(styles.discussionCount)}>
                {paper_publish_date
                  ? this.convertDate(paper_publish_date)
                  : "No publish date"}
              </span>
            </div>
          </div>
        </Fragment>
      );
    } else if (indexName === "discussion_thread") {
      let { createdBy, createdDate } = result;
      let { firstName, lastName } = createdBy;
      return (
        <Fragment>
          <div className={css(styles.bullet)}>{this.renderCount()}</div>
          <div className={css(styles.bullet)}>
            <div className={css(styles.discussion)}>
              <span className={css(styles.icon)}>{icons.simpleUser}</span>
              <span className={css(styles.discussionCount)}>
                {`${firstName} ${lastName}`}
              </span>
            </div>
          </div>
          <div className={css(styles.bullet)}>
            <div className={css(styles.discussion)}>
              <span className={css(styles.icon)}>
                <i className={"fad fa-clock"} />
              </span>
              <span className={css(styles.discussionCount)}>
                {createdDate && this.convertDate(createdDate)}
              </span>
            </div>
          </div>
        </Fragment>
      );
    }
  };

  render() {
    let { indexName, result } = this.props;
    let { score, tagline, plainText } = result;
    let isPaper = indexName === "paper";
    let isDisc = indexName === "discussion_thread";
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
        <div
          className={css(
            styles.column,
            styles.mid,
            isPaper && tagline && styles.spaced,
            isDisc && plainText && styles.spaced
          )}
        >
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
        <div className={css(styles.column, styles.right)}>
          {this.renderBulletPoints()}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  searchEntryCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 130,
    width: "calc(100% - 40px)",
    padding: "15px 20px",
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
    height: "calc(100% - 30px)",
  },
  left: {
    marginRight: 20,
  },
  mid: {
    justifyContent: "center",
    width: "calc(calc(100% - 50px) * 0.7)",
    marginRight: 20,
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      margin: 0,
    },
  },
  right: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "calc(calc(100% - 50px) * 0.3)",
    "@media only screen and (max-width: 1200px)": {
      display: "none",
    },
  },
  spaced: {
    justifyContent: "space-between",
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      margin: 0,
      paddingBottom: 25,
    },
  },
  avatarDisplay: {},
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
    backgroundColor: "#f6e653",
    padding: "2px 1px 2px 1px",
  },
  mainText: {
    fontSize: 20,
    color: "rgb(35, 32, 56)",
    fontWeight: "500",
    flexWrap: "wrap",
    lineHeight: 1.6,
    "@media only screen and (max-width: 1080px)": {
      fontSize: 16,
    },
  },
  metaDataOne: {
    fontSize: 16,
    flexWrap: "wrap",
    display: "flex",
  },
  paddedContainer: {},
  metaDataTwo: {
    fontSize: 16,
    flexWrap: "wrap",
    display: "flex",
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
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
    bottom: 10,
    color: colors.BLUE(1),
    fontSize: 14,
    "@media only screen and (max-width: 1080px)": {
      fontSize: 12,
    },
  },
  publishDate: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
  },
  authors: {
    fontSize: 13,
    fontWeight: 400,
    color: "#918F9B",
  },
  discText: {
    fontSize: 12,
  },
  tagline: {
    fontSize: 12,
  },
  icon: {
    minWidth: 20,
    maxWidth: 20,
    color: "#C1C1C1",
    fontSize: 14,
  },
  paperIcon: {
    color: colors.BLUE(1),
    marginRight: 5,
  },
  bullet: {},
  discussion: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 5,
  },
  discussionCount: {
    color: colors.BLACK(1),
    marginLeft: 7,
    fontSize: 14,
    paddingBottom: 2,
  },
  count: {
    color: colors.BLACK(1),
    fontWeight: "bold",
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
