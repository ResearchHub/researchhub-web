import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "../VoteWidget";
import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import ThreadTextEditor from "./ThreadTextEditor";

// Config
import colors from "~/config/themes/colors";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { getNestedValue } from "~/config/utils";

// Redux
import DiscussionActions from "../../redux/discussion";

class ReplyEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elementHeight: 0,
      collapsed: false,
      highlight: false,
      score: 0,
      selectedVoteType: "",
    };
    this.replyRef = null;
  }

  componentDidMount() {
    const selectedVoteType = getNestedValue(this.props, [
      "reply",
      "userVote",
      "voteType",
    ]);
    const score = this.props.reply.score;

    this.setState(
      {
        score,
        selectedVoteType,
        highlight: this.props.reply.highlight && true,
      },
      () => {
        setTimeout(() => this.calculateThreadHeight(), 400);
        this.props.reply.highlight &&
          setTimeout(() => {
            this.setState({ highlight: false }, () => {
              this.props.reply.highlight = false;
            });
            this.calculateThreadHeight();
          }, 10000);
      }
    );
  }

  componentDidUpdate(prevProps) {
    this.calculateThreadHeight();
  }

  calculateThreadHeight = () => {
    if (this.replyRef) {
      if (this.replyRef.clientHeight !== this.state.elementHeight) {
        this.setState({
          elementHeight: this.replyRef.clientHeight,
        });
      }
    }
    this.props.calculateThreadHeight();
  };

  createUsername = ({ createdBy }) => {
    if (createdBy) {
      const { firstName, lastName } = createdBy;
      return `${firstName} ${lastName}`;
    }
    return null;
  };

  toggleCollapsed = (e) => {
    e && e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed });
  };

  upvote = async () => {
    let { data, comment, reply, postUpvote, postUpvotePending } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let commentId = comment.id;
    let replyId = reply.id;

    postUpvotePending();

    await postUpvote(paperId, discussionThreadId, commentId, replyId);

    this.updateWidgetUI();
  };

  downvote = async () => {
    let {
      data,
      comment,
      reply,
      postDownvote,
      postDownvotePending,
    } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let commentId = comment.id;
    let replyId = reply.id;

    postDownvotePending();

    await postDownvote(paperId, discussionThreadId, commentId, replyId);

    this.updateWidgetUI();
  };

  updateWidgetUI = () => {
    let voteResult = this.props.vote;
    const success = voteResult.success;
    const vote = getNestedValue(voteResult, ["vote"], false);

    if (success) {
      const voteType = vote.voteType;
      let score = this.state.score;
      if (voteType === UPVOTE) {
        if (voteType) {
          if (this.state.selectedVoteType === null) {
            score += 1;
          } else {
            score += 2;
          }
        } else {
          score += 1;
        }
        this.setState({
          selectedVoteType: UPVOTE,
          score,
        });
      } else if (voteType === DOWNVOTE) {
        if (voteType) {
          if (this.state.selectedVoteType === null) {
            score -= 1;
          } else {
            score -= 2;
          }
        } else {
          score -= 1;
        }
        this.setState({
          selectedVoteType: DOWNVOTE,
          score,
        });
      }
    }
  };

  render() {
    const { data, hostname, hoverEvents, path, mobileView, reply } = this.props;
    let threadId = reply.id;
    let dataCount = 0; // set to 0 for now; replies can't be replied to
    let date = reply.createdDate;
    // let title = reply.title;
    let body = reply.text;
    let username = this.createUsername(reply);

    const flexStyle = StyleSheet.create({
      threadline: {
        height: this.state.elementHeight - 58,
        width: 2,
        backgroundColor: "#EEEFF1",
        cursor: "pointer",
        ":hover": {
          backgroundColor: colors.BLUE(1),
        },
      },
    });

    return (
      <div
        className={css(styles.row, styles.replyCard)}
        ref={(element) => (this.replyRef = element)}
        onClick={() =>
          this.setState({ elementHeight: this.replyRef.clientHeight })
        }
      >
        <div className={css(styles.column, styles.left)}>
          <div>
            <VoteWidget
              styles={styles.voteWidget}
              score={this.state.score}
              onUpvote={this.upvote}
              onDownvote={this.downvote}
              selected={this.state.selectedVoteType}
              fontSize={"12px"}
              width={"40px"}
            />
          </div>
          {!this.state.collapsed && (
            <div className={css(flexStyle.threadline)}></div>
          )}
        </div>
        <div className={css(styles.column, styles.metaData)}>
          <span
            className={css(
              styles.highlight,
              this.state.highlight && styles.active
            )}
          >
            <div className={css(styles.row, styles.topbar)}>
              <DiscussionPostMetadata
                authorProfile={reply && reply.createdBy.authorProfile}
                username={username}
                date={date}
                smaller={true}
                onHideClick={this.toggleCollapsed}
                hideState={this.state.collapsed}
              />
            </div>
            {!this.state.collapsed && (
              <Fragment>
                <div className={css(styles.content)}>
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    body={true}
                  />
                </div>
                <div className={css(styles.row, styles.bottom)}>
                  <ThreadActionBar
                    hostname={hostname}
                    count={dataCount}
                    comment={true}
                    small={true}
                    calculateThreadHeight={this.calculateThreadHeight}
                    hideReply={true}
                  />
                </div>
              </Fragment>
            )}
          </span>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
  },
  left: {
    alignItems: "center",
    width: 40,
  },
  replyCard: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 5,
    overflow: "visible",
    cursor: "pointer",
  },
  topbar: {
    width: "100%",
    margin: "15px 0px 5px 0",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    overflowWrap: "break-word",
    lineHeight: 1.6,
  },
  metaData: {
    width: "calc(100% - 45px)",
    marginLeft: 5,
  },
  highlight: {
    width: "100%",
    cursor: "pointer",
    boxSizing: "border-box",
    borderRadius: 5,
    padding: "0px 10px 10px 8px",
    ":hover": {
      backgroundColor: "#f3f3f8",
    },
  },
  active: {
    backgroundColor: colors.LIGHT_YELLOW(),
    ":hover": {
      backgroundColor: colors.LIGHT_YELLOW(),
    },
  },
  bottom: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    margin: 0,
    padding: 0,
    fontSize: 20,
  },
  body: {
    margin: 0,
  },
  voteWidget: {
    margin: 0,
    backgroundColor: "#FFF",
  },
});

const mapStateToProps = (state) => ({
  vote: state.vote,
});

const mapDispatchToProps = {
  postReply: DiscussionActions.postReply,
  postReplyPending: DiscussionActions.postReplyPending,
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReplyEntry);
