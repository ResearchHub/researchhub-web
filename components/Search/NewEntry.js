import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Router from "next/router";
import "./algolia.css";

// Redux
import { MessageActions } from "~/redux/message";

// Components
import University from "~/components/University";
import AuthorAvatar from "~/components/AuthorAvatar";
// import { Highlight } from "react-instantsearch-dom";
import Highlight from "./AlgoliaHighlight";
// Config
import colors, { bannerColor } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import {
  formatDateStandard,
  formatPaperSlug,
  createUserSummary,
} from "~/config/utils";
import { transformDate } from "~/redux/utils";

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
    let { indexName, result, clearSearch, onClickCallBack } = this.props;
    let { id, slug } = result;
    let paperSlug = slug ? slug : formatPaperSlug(result.title);
    clearSearch && clearSearch();
    if (indexName === "author") {
      Router.push("/user/[authorId]/[tabName]", `/user/${id}/contributions`);
    } else if (indexName === "paper") {
      Router.push("/paper/[paperId]/[paperName]", `/paper/${id}/${paperSlug}`);
    } else if (indexName === "discussion_thread") {
      let { paper } = result;
      Router.push(
        "/paper/[paperId]/[paperName]/[discussionThreadId]",
        `/paper/${paper}/${paperSlug}/${id}`
      );
    }
    setTimeout(() => onClickCallBack && onClickCallBack(), 400);
  };

  parseTitleHighlight = (highlight, key) => {
    const text = highlight[key][0];
    const parts = text.split(/(<em>[^<]+<\/em>)/);
    return parts.map((part) => {
      if (part.includes("<em>")) {
        let replaced = part.replace("<em>", "");
        replaced = replaced.replace("</em>", "");
        return <span className={css(styles.highlight)}>{replaced}</span>;
      }
      return <span>{part}</span>;
    });
  };

  convertDate = (date) => {
    return formatDateStandard(transformDate(date));
  };

  transformAuthors = () => {
    const { result } = this.props;
    const { authors, meta } = result;

    if (result.meta.highlight && result.meta.highlight.authors) {
      return (
        <div className={css(styles.authors)}>
          {"by "}
          {this.parseTitleHighlight(result.meta.highlight, "authors")}
        </div>
      );
    } else {
      return (
        <div className={css(styles.authors) + " clamp1"}>
          {"by "}
          {authors.map((author, i) => {
            if (i !== authors.length - 1) {
              return (
                <span>
                  <Highlight
                    attribute={`authors[${i}]`}
                    tagName={"span"}
                    hit={result}
                  />
                  {", "}
                </span>
              );
            } else {
              return (
                <Highlight
                  attribute={`authors[${i}]`}
                  tagName={"span"}
                  hit={result}
                />
              );
            }
          })}
        </div>
      );
    }
  };

  renderMainText = () => {
    const { indexName, result } = this.props;
    const { authors } = result;

    if (indexName === "author") {
      return (
        <Fragment>
          <span className={css(styles.first_name)}>
            <Highlight tagName={"span"} attribute={"first_name"} hit={result} />
          </span>
          <Highlight tagName={"span"} attribute={"last_name"} hit={result} />
        </Fragment>
      );
    } else if (indexName === "paper") {
      return (
        <span>
          <span className={css(styles.paperTitle) + " clamp2"}>
            <Highlight tagName={"span"} attribute={"title"} hit={result} />
          </span>
          {authors && authors.length > 0 ? (
            this.transformAuthors()
          ) : (
            <div className={css(styles.authors)}>No attributed author</div>
          )}
        </span>
      );
    }
  };

  renderMetaDataOne = () => {
    const { indexName, result } = this.props;

    if (indexName === "author") {
      const userSummary = createUserSummary(result);

      if (userSummary) {
        return (
          <span className={css(styles.userHeadline) + " clamp1"}>
            {createUserSummary(result)}
          </span>
        );
      }
    } else if (indexName === "paper") {
      return (
        <span className={css(styles.abstract) + " clamp2"}>
          <Highlight tagName={"span"} attribute={"abstract"} hit={result} />
          {/* {result.abstract} */}
        </span>
      );
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
                {count > 1 ? "comments" : count === 0 ? "comments" : "comment"}
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
      let { hubs, paper_publish_date, uploaded_date } = result;
      return (
        <Fragment>
          <div className={css(styles.bullet)}>{this.renderCount()}</div>
          <div className={css(styles.bullet)}>
            <div className={css(styles.discussion)}>
              <span className={css(styles.icon)}>{icons.hub}</span>
              <span className={css(styles.discussionCount)}>
                {hubs && (
                  <Fragment>
                    <span className={css(styles.count)}>{hubs.length} </span>
                    hub{(hubs.length > 1 || hubs.length === 0) && "s"}
                  </Fragment>
                )}
              </span>
            </div>
          </div>
          <div className={css(styles.bullet)}>
            <div className={css(styles.discussion)}>
              <span className={css(styles.icon)}>{icons.date}</span>
              <span className={css(styles.discussionCount)}>
                {uploaded_date
                  ? this.convertDate(uploaded_date)
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
              <span className={css(styles.icon)}>{icons.date}</span>
              <span className={css(styles.discussionCount)}>
                {createdDate && this.convertDate(createdDate)}
              </span>
            </div>
          </div>
        </Fragment>
      );
    }
  };

  renderHeader = () => {
    const { indexName } = this.props;
    return <div className={css(styles.section)}>{indexName + "s"}</div>;
  };

  renderScore = () => {
    const { indexName, result, hideBullets, score } = this.props;

    switch (indexName) {
      case "author":
        return (
          <div className={css(styles.avatarDisplay)}>
            {result.profile_image ? (
              <img src={result.profile_image} className={css(styles.avatar)} />
            ) : (
              <i
                className={
                  css(styles.avatar, styles.defaultAvatar) +
                  " fas fa-user-circle"
                }
              />
            )}
          </div>
        );
      case "paper":
        return (
          <div
            className={css(
              styles.voteDisplay,
              hideBullets && styles.smallVoteDisplay
            )}
          >
            {(score && score) || 0}
          </div>
        );
      default:
        return;
    }
  };

  render() {
    const { indexName, result, hideBullets, firstOfItsType } = this.props;
    const { score, tagline, plainText } = result;
    let isPaper = indexName === "paper";
    let isDisc = indexName === "discussion_thread";

    return (
      <Fragment>
        {firstOfItsType && this.renderHeader()}
        <div
          key={`${indexName}-${result.id}`}
          className={css(
            styles.searchEntryCard,
            hideBullets && styles.customStyles
          )}
          onClick={this.handleClick}
        >
          <div
            className={css(
              styles.column,
              styles.left,
              indexName === "author" && styles.isAuthor
            )}
          >
            {this.renderScore()}
          </div>
          <div
            className={css(
              styles.column,
              styles.mid,
              isPaper && tagline
                ? tagline.length >= 100
                  ? styles.mobilePadding
                  : styles.spaced
                : null,
              isDisc && plainText
                ? plainText.length >= 100
                  ? styles.mobilePadding
                  : styles.spaced
                : null,
              hideBullets && styles.fullWidth
            )}
          >
            <div className={css(styles.mainText)}>{this.renderMainText()}</div>
            <div className={css(styles.metaDataOne)}>
              {this.renderMetaDataOne()}
            </div>
          </div>
          {/* <div className={css(styles.indexTag)}>
            {indexName === "discussion_thread" ? "disc." : indexName}
          </div> */}
          {!hideBullets && (
            <div className={css(styles.column, styles.right)}>
              {this.renderBulletPoints()}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  searchEntryCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 130,
    width: "calc(100%)",
    padding: "15px 20px",
    position: "relative",
    boxSizing: "border-box",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  customStyles: {
    border: "1px solid #EDEDED",
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
  fullWidth: {
    width: "calc(100% - 50px)",
    paddingBottom: 20,
  },
  mid: {
    justifyContent: "center",
    width: "calc(100% * 0.7)",
    marginRight: 20,
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      margin: 0,
    },
  },
  right: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    "@media only screen and (max-width: 1200px)": {
      display: "none",
    },
  },
  spaced: {
    justifyContent: "space-between",
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      margin: 0,
    },
  },
  mobilePadding: {
    justifyContent: "space-between",
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      margin: 0,
      paddingBottom: 25,
    },
  },
  avatarDisplay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  voteDisplay: {
    color: "rgb(100, 196, 143)",
    fontWeight: "bold",
    background: "rgb(233, 250, 234)",
    borderRadius: "50%",
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  smallVoteDisplay: {
    height: 40,
    width: 40,
    borderRadius: "50%",
  },
  highlight: {
    backgroundColor: "#f6e653",
    padding: "2px 1px 2px 1px",
  },
  mainText: {
    fontSize: 16,
    color: "rgb(35, 32, 56)",
    fontWeight: "500",
    flexWrap: "wrap",
    wordBreak: "break-word",
    lineHeight: 1.2,
    marginBottom: 8,
    textOverflow: "ellipsis",
    "@media only screen and (max-width: 1080px)": {
      fontSize: 16,
    },
  },
  metaDataOne: {
    flexWrap: "wrap",
    display: "flex",
    "@media only screen and (max-width: 1200px)": {
      width: "100%",
    },
  },
  userHeadline: {
    fontSize: 13,
    fontWeight: 400,
    color: "#918F9B",
  },
  metaDataTwo: {
    fontSize: 16,
    flexWrap: "wrap",
    display: "flex",
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 27.5,
    objectFit: "contain",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 12,
    fontWeight: 400,
    color: "#918F9B",
    marginTop: 5,
  },
  abstract: {
    fontSize: 13,
    fontWeight: 400,
    color: colors.BLACK(0.9),
  },
  discText: {
    fontSize: 12,
    wordBreak: "break-word",
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  },
  tagline: {
    fontSize: 12,
    wordBreak: "break-word",
    "@media only screen and (max-width: 1200px)": {
      width: "calc(100% - 50px)",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  },
  icon: {
    minWidth: 20,
    maxWidth: 20,
    // color: "#918F9B",
    color: colors.YELLOW(),
    fontSize: 14,
  },
  paperIcon: {
    color: colors.BLUE(),
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
  section: {
    width: "100%",
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 1.2,
    borderBottom: "1px solid #DAE0E6",
    padding: "10px 0",
  },
  first_name: {
    marginRight: 3,
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
