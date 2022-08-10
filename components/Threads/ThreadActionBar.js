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
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { captureException } from "@sentry/browser";

class ThreadActionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyBox: false,
      bountyAwarded: this.props.bountyAwarded,
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

  handleAwardBounty = ({
    objectId,
    recipientUserName,
    recipientUserId,
    contentType,
  }) => {
    const { bounty } = this.props;
    return Bounty.awardAPI({
      bountyId: bounty.id,
      recipientUserId,
      objectId,
      contentType,
    })
      .then((bounty) => {
        var event = new CustomEvent("bounty-awarded", {
          detail: { objectId, contentType, amount: bounty.amount },
        });
        document.dispatchEvent(event);
      })
      .catch((error) => {
        this.props.setMessage("Failed to award bounty");
        this.props.showMessage({
          show: true,
          error: true,
        });

        captureException(error);
        throw new Error(error);
      });
  };

  render() {
    const { showBountyAward } = this.props;
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

          {/* TODO: This will be turned on with the onset of bounty feature */}
          {showBountyAward && !this.state.bountyAwarded && (
            <div
              className={css(styles.text, styles.action)}
              onClick={() => {
                const formattedBountyAmount = formatBountyAmount({
                  amount: this.props.bounty.amount,
                });

                const recipientUserName = `${this.props.createdBy.author_profile.first_name} ${this.props.createdBy.author_profile.last_name}`;

                if (
                  confirm(
                    `Award ${formattedBountyAmount} to ${recipientUserName}?`
                  )
                ) {
                  acceptAnswerAPI({
                    documentType: this.props.documentType,
                    threadId: this.props.threadID,
                    documentId: this.props.documentID,
                    commentId: this.props.commentID,
                    onSuccess: (response) => {
                      const bountyRes = this.handleAwardBounty({
                        bountyId: this.props.bounty.id,
                        recipientUserId: this.props.createdBy.id,
                        recipientUserName,
                        objectId:
                          this.props.contentType === "thread"
                            ? this.props.threadID
                            : this.props.commentID,
                        contentType: this.props.contentType,
                      });
                      if (bountyRes) {
                        bountyRes.then((_) => {
                          if (this.props.contentType === "thread") {
                            const event = new CustomEvent("answer-accepted", {
                              detail: {
                                threadId: this.props.threadID,
                              },
                            });
                            document.dispatchEvent(event);
                          }
                          this.setState({
                            bountyAwarded: true,
                          });
                          this.props.setMessage(
                            `Your ${formattedBountyAmount} RSC Bounty was awarded to ${recipientUserName}`
                          );
                          this.props.showMessage({
                            show: true,
                          });

                          const { onBountyAward } = this.props;
                          onBountyAward && onBountyAward();
                        });
                      }
                    },
                    onError: (error) => {
                      console.log(error);
                      this.props.setMessage("Failed to set accepted answer");
                      this.props.showMessage({
                        show: true,
                        error: true,
                      });
                    },
                  });
                }
              }}
            >
              <span
                className={css(styles.icon, styles.awardBountyIcon)}
                id={"awardBountyIcon"}
              >
                {icons.medal}
              </span>
              Accept Answer & Award Bounty
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
    ":hover #awardBountyIcon": {
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
