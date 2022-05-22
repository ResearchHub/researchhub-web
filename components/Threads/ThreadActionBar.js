import { breakpoints } from "~/config/themes/screen";
import { captureEvent } from "~/config/utils/events";
import { Component, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import { nullthrows, silentEmptyFnc } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import icons from "~/config/themes/icons";
import ThreadTextEditor from "./ThreadTextEditor";

const DYNAMIC_HREF = "/paper/[paperId]/[paperName]/[discussionThreadId]";

class ThreadActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyBox: false,
      prevParentHeight: 0,
    };
  }

  renderReplyBox = () => {
    /**
     * TODO: create a button that when toggled, reveals a editor box
     * Allow the user to be able to upload comment or a reply
     * Will need to look at the IDs of paper, thread, comments (universal comment reply)
     * */

    if (!this.state.showReplyBox) {
      return null;
    }
    return (
      <div className={css(styles.textEditorContainer, styles.revealTextEditor)}>
        <ThreadTextEditor
          onCancel={this.toggleReplyBox}
          onSubmit={this.props.onSubmit && this.props.onSubmit}
          editing={this.state.showReplyBox}
          initialValue={this.props.initialValue}
          hasHeader={this.props.hasHeader}
          mediaOnly={this.props.mediaOnly}
        />
      </div>
    );
  };

  renderCommentCount = () => {
    const { count, comment, onClick, small, showChildrenState, onCountHover } =
      this.props;

    if (count === 0) {
      return null;
    }

    let classNames = [styles.commentCountContainer];

    if (small) {
      classNames.push(styles.smallReply);
    }

    if (showChildrenState) {
      classNames.push(styles.active);
    }

    return (
      <div
        className={css(classNames)}
        onClick={onClick && onClick}
        onMouseEnter={onCountHover}
        onMouseLeave={onCountHover}
      >
        <span className={css(styles.iconChat)} id={"chatIcon"}>
          {icons.comments}
        </span>
        <span
          className={css(styles.text, small && styles.smallReply)}
          id={"text"}
        >
          {`Replies (${count}${showChildrenState ? "" : " hidden"})`}
        </span>
      </div>
    );
  };

  renderEditButton = () => {
    const { toggleEdit, editing, small } = this.props;

    let classNames = [styles.editContainer];

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
          id={"editIcon"}
        >
          {icons.pencil}
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

  toggleReplyBox = () => {
    this.setState({
      showReplyBox: !this.state.showReplyBox,
    });
  };

  render() {
    const { small, isRemoved } = this.props;

    if (isRemoved) {
      return (
        <Fragment>
          <div className={css(styles.column)}>
            <div className={css(styles.row)}>{this.renderCommentCount()}</div>
          </div>
        </Fragment>
      );
    }
    const commentCount = this.renderCommentCount();
    const editButton = this.renderEditButton();
    return (
      <div
        className={css(styles.column)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
                {icons.commentAltEdit}
              </span>
              Respond
            </div>
          )}
          {this.props.toggleEdit && editButton}
          {!this.props.hideCount && commentCount}
          <FlagButtonV2
            buttonText="Flag"
            buttonTextStyle={styles.flagButtonTextStyle}
            flagIconOverride={styles.flagIconOverride}
            modalHeaderText="Flagging"
            onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
              flagGrmContent({
                commentPayload: {
                  commentID: this.props.commentID,
                  commentType: this.props.contentType, // in ThreadActionBar, contentType is the commentType
                  replyID: this.props.replyID,
                  threadID: this.props.threadID,
                },
                contentID: nullthrows(
                  this.props.documentID,
                  "documentID must be present to flag "
                ),
                contentType: nullthrows(
                  this.props.documentType,
                  "DocumentType must be present to flag "
                ),
                flagReason,
                onError: renderErrorMsg,
                onSuccess: renderSuccessMsg,
              });
            }}
          />
        </div>
        {!this.props.hideReply && (
          <div className={css(styles.container)}>{this.renderReplyBox()}</div>
        )}
      </div>
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
      color: colors.BLUE(),
    },
    ":hover #chatIcon": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 415px)": {
      marginRight: 10,
    },
  },
  editContainer: {
    cursor: "pointer",
    padding: 4,
    marginRight: 20,
    borderRadius: 3,
    ":hover #text": {
      color: colors.BLUE(),
    },
    ":hover #editIcon": {
      color: colors.BLUE(),
    },
  },
  flagIconOverride: {
    background: "none",
    border: "none",
    marginLeft: 16,
    ":hover": {
      background: "none",
      color: colors.BLUE(1),
    },
  },
  flagButtonTextStyle: {
    fontSize: 14,
    marginLeft: 8,
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      fontSize: 12,
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
      color: colors.BLUE(),
    },
    ":hover #shareIcon": {
      color: colors.BLUE(),
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
