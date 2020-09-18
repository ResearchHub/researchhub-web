import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";

import ThreadTextEditor from "./ThreadTextEditor";

import colors from "~/config/themes/colors";
import { doesNotExist } from "~/config/utils";

const DYNAMIC_HREF = "/paper/[paperId]/[paperName]/[discussionThreadId]";

class ThreadActionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyBox: false,
      prevParentHeight: 0,
    };
  }

  componentDidMount() {
    this.setState({ prevParentHeight: this.props.threadHeight });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.threadHeight !== this.props.threadHeight) {
      if (this.props.threadHeight !== 0 && !this.state.showReplyBox) {
        this.setState({ prevParentHeight: this.props.threadHeight });
      }
    }
  }

  renderReplyBox = () => {
    /**
     * TODO: create a button that when toggled, reveals a editor box
     * Allow the user to be able to upload comment or a reply
     * Will need to look at the IDs of paper, thread, comments (universal comment reply)
     * */
    return (
      <div
        className={css(
          styles.textEditorContainer,
          this.state.showReplyBox && styles.revealTextEditor
        )}
      >
        <ThreadTextEditor
          onCancel={this.toggleReplyBox}
          onSubmit={this.props.onSubmit && this.props.onSubmit}
          onChange={() =>
            this.props.calculateThreadHeight &&
            this.props.calculateThreadHeight()
          }
          editing={this.state.showReplyBox}
          initialValue={this.props.initialValue}
          hasHeader={this.props.hasHeader}
        />
      </div>
    );
  };

  renderCommentCount = () => {
    const {
      count,
      comment,
      onClick,
      small,
      showChildrenState,
      onCountHover,
    } = this.props;

    let classNames = [styles.commentCountContainer];

    if (small) {
      classNames.push(styles.smallReply);
    }

    if (showChildrenState) {
      classNames.push(styles.active);
    }

    if (count === 0) {
      classNames.push(styles.inactive);
    }

    return (
      <div
        className={css(classNames)}
        onClick={onClick && onClick}
        onMouseEnter={onCountHover}
        onMouseLeave={onCountHover}
      >
        <span
          className={css(styles.iconChat, showChildrenState && styles.active)}
          id={"chatIcon"}
        >
          <i className="fad fa-comments" />
        </span>
        <span
          className={css(
            styles.text,
            small && styles.smallReply,
            showChildrenState && styles.active
          )}
          id={"text"}
        >
          {this.formatCommentCount(count, comment)}
        </span>
      </div>
    );
  };

  renderEditButton = () => {
    const { toggleEdit, editing, small } = this.props;

    let classNames = [styles.commentCountContainer];

    if (small) {
      classNames.push(styles.smallReply);
    }

    if (editing) {
      classNames.push(styles.active);
    }

    return (
      <div className={css(classNames)} onClick={toggleEdit}>
        <span
          className={css(
            styles.iconChat,
            styles.iconEdit,
            editing && styles.active
          )}
          id={"chatIcon"}
        >
          <i className="fad fa-pencil"></i>
        </span>
        <span
          className={css(
            styles.text,
            small && styles.smallReply,
            editing && styles.active
          )}
          id={"text"}
        >
          Edit
        </span>
      </div>
    );
  };

  formatCommentCount = (count, isComment) => {
    const suffix = isComment
      ? count === 0 || count > 1
        ? "Replie"
        : "Reply"
      : "Comment";
    const s = "s";

    if (count < 1 || doesNotExist(count)) {
      return `${suffix}${s} (${count})`;
    } else if (count < 2) {
      return `${suffix} (${count})`;
    }
    return `${suffix}${s} (${count})`;
  };

  toggleReplyBox = () => {
    this.setState(
      {
        showReplyBox: !this.state.showReplyBox,
      },
      () => {
        if (this.state.showReplyBox) {
          this.props.calculateThreadHeight &&
            this.props.calculateThreadHeight();
        } else {
          this.props.calculateThreadHeight &&
            this.props.calculateThreadHeight();
        }
      }
    );
  };

  render() {
    const { hostname, threadPath, title, small, isRemoved } = this.props;
    const shareUrl = hostname + threadPath;

    if (isRemoved) {
      return (
        <Fragment>
          <div className={css(styles.column)}>
            <div className={css(styles.row)}>{this.renderCommentCount()}</div>
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <div className={css(styles.column)}>
          <div className={css(styles.row)}>
            {!this.props.hideReply && (
              <div
                className={css(
                  styles.text,
                  styles.replyContainer,
                  small && styles.smallReply,
                  this.state.showReplyBox && styles.active
                )}
                onClick={this.toggleReplyBox}
              >
                <span
                  className={css(
                    styles.replyIcon,
                    this.state.showReplyBox && styles.active
                  )}
                  id={"replyIcon"}
                >
                  <i className="fad fa-comment-alt-edit" />
                </span>
                Respond
              </div>
            )}
            {this.renderCommentCount()}
            {this.props.toggleEdit && this.renderEditButton()}
          </div>
          {!this.props.hideReply && (
            <div className={css(styles.container)}>{this.renderReplyBox()}</div>
          )}
        </div>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  replyContainer: {
    marginRight: 20,
    marginLeft: 0,
    padding: 4,
    borderRadius: 3,
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
    ":hover #replyIcon": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 415px)": {
      marginRight: 10,
    },
  },
  commentCountContainer: {
    marginRight: 20,
    padding: 4,
    borderRadius: 3,
    cursor: "pointer",
    ":hover #text": {
      color: colors.BLUE(1),
    },
    ":hover #chatIcon": {
      color: colors.BLUE(1),
    },
    "@media only screen and (max-width: 415px)": {
      marginRight: 10,
    },
  },
  link: {
    color: colors.GREY(),
  },
  shareContainer: {
    cursor: "pointer",
    padding: 4,
    borderRadius: 3,
    ":hover #text": {
      color: colors.BLUE(1),
    },
    ":hover #shareIcon": {
      color: colors.BLUE(1),
    },
  },
  smallReply: {
    fontSize: 12,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 14,
    marginLeft: 8,
    color: "#AAAAAA",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  iconChat: {
    color: "#918f9b",
  },
  iconEdit: {
    fontSize: 13,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  shareIcon: {
    fontSize: 13,
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  active: {
    color: colors.BLUE(0.8),
  },
  inactive: {
    pointerEvents: "none",
  },
  textEditorContainer: {
    marginTop: 5,
    width: "100%",
    height: 0,
    opacity: 0,
    transition: "all ease-in-out 0.2s",
    boxSizing: "border-box",
    overflow: "auto",
  },
  revealTextEditor: {
    height: "unset",
    opacity: 1,
    border: "solid 1px #AAAAAA",
    borderRadius: 3,
    backgroundColor: "#FAFAFA",
    cursor: "default",
  },
  container: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  replyIcon: {
    color: "#918f9b",
    marginRight: 8,
  },
});

export default ThreadActionBar;
