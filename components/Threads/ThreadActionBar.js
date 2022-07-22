import { Component } from "react";
import { css, StyleSheet } from "aphrodite";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import { nullthrows } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import icons, { MedalIcon } from "~/config/themes/icons";
import ThreadTextEditor from "./ThreadTextEditor";
import acceptAnswerAPI from "../Document/api/acceptAnswerAPI";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";

class ThreadActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyBox: false,
    };
  }

  renderReplyBox = () => {
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

  renderEditButton = () => {
    const { toggleEdit, editing } = this.props;

    let classNames = [styles.editContainer, styles.action, styles.text];

    if (editing) {
      classNames.push(styles.active);
    }

    return (
      <div className={css(classNames)} onClick={toggleEdit}>
        <span
          className={css(
            styles.icon,
            styles.iconEdit,
            editing && styles.active
          )}
          id={"editIcon"}
        >
          {icons.pen}
        </span>
        <span className={css(editing && styles.active)} id={"text"}>
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
    if (this.props.isRemoved) {
      return null;
    }

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
                styles.action,
                styles.replyContainer,
                this.state.showReplyBox && styles.active
              )}
              onClick={this.toggleReplyBox}
            >
              <span
                className={css(
                  styles.icon,
                  styles.replyIcon,
                  this.state.showReplyBox && styles.active
                )}
                id={"replyIcon"}
              >
                {icons.reply}
              </span>
              Reply
            </div>
          )}

          {this.props.showAcceptedAnswerBtn && (
            <div
              className={css(styles.text, styles.action)}
              onClick={() =>
                acceptAnswerAPI({
                  documentType: this.props.documentType,
                  threadId: this.props.threadID,
                  documentId: this.props.documentID,
                  onSuccess: (response) => {
                    var event = new CustomEvent("answer-accepted", {
                      detail: { threadId: this.props.threadID },
                    });
                    document.dispatchEvent(event);
                  },
                  onError: (error) => {
                    this.props.setMessage("Failed to set accepted answer");
                    this.props.showMessage({ show: true, error: true });
                  },
                })
              }
            >
              <span
                className={css(styles.icon, styles.acceptAnswerIcon)}
                id={"acceptAnswerIcon"}
              >
                {icons.commentLightAltCheck}
              </span>
              Accept Answer
            </div>
          )}

          {/* TODO: This will be turned on with the onset of bounty feature */}
          {false && (
            <div
              className={css(styles.text, styles.action)}
              onClick={() => null}
            >
              <span
                className={css(styles.icon, styles.acceptAnswerIcon)}
                id={"acceptAnswerIcon"}
              >
                <MedalIcon
                  color={colors.MEDIUM_GREY2()}
                  width={18}
                  height={18}
                />
              </span>
              Award Bounty
            </div>
          )}

          {this.props.toggleEdit && editButton}
          <FlagButtonV2
            buttonText=""
            iconOverride={icons.flagOutline}
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
    fontWeight: 500,
  },
  action: {
    marginRight: 15,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    ":hover #replyIcon": {
      color: colors.NEW_BLUE(),
    },
    ":hover #text": {
      color: colors.NEW_BLUE(),
    },
    ":hover #editIcon": {
      color: colors.NEW_BLUE(),
    },
    ":hover #acceptAnswerIcon": {
      color: colors.NEW_BLUE(),
    },
  },
  replyContainer: {
    marginLeft: 0,
  },
  editContainer: {},
  flagIconOverride: {
    background: "none",
    border: "none",
    marginLeft: "auto",
    color: colors.MEDIUM_GREY2(),
    ":hover": {
      background: "none",
      color: colors.NEW_BLUE(1),
    },
  },
  flagButtonTextStyle: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 14,
    marginLeft: 8,
  },
  link: {
    color: colors.GREY(),
  },
  text: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.MEDIUM_GREY2(),
  },
  icon: {
    color: colors.MEDIUM_GREY2(),
    marginRight: 8,
    fontSize: 16,
  },
  iconEdit: {},
  active: {
    color: colors.NEW_BLUE(0.8),
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
    cursor: "default",
  },
  container: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  replyIcon: {},
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(ThreadActionBar);
