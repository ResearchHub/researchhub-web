import { Component } from "react";
import { css, StyleSheet } from "aphrodite";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import { nullthrows } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import icons, {
  flagOutline,
  medal,
  MedalIcon,
  pen,
  reply,
  trash,
} from "~/config/themes/icons";
import ThreadTextEditor from "./ThreadTextEditor";
import acceptAnswerAPI from "../Document/api/acceptAnswerAPI";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { captureException } from "@sentry/browser";
import { timeToRoundUp } from "~/config/utils/dates";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { breakpoints } from "~/config/themes/screen";

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
          editing={false}
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
          {pen}
        </span>
        <span className={css(editing && styles.active)} id={"text"}>
          Edit
        </span>
      </div>
    );
  };

  renderDeleteButton = () => {
    let classNames = [styles.action, styles.text];

    const _handleDelete = () => {
      if (!confirm("Delete comment?")) {
        return;
      }

      const url =
        API.buildPaperChainUrl(
          this.props.documentType,
          null,
          this.props.documentID,
          this.props.threadID,
          this.props.commentID,
          this.props.replyID
        ) + "delete/";

      fetch(url, API.PATCH_CONFIG())
        .then(Helpers.checkStatus)
        .then((_res) => {
          let deletedId;
          let deletedContentType;
          if (this.props.replyID) {
            deletedId = this.props.replyID;
            deletedContentType = "reply";
          } else if (this.props.commentID) {
            deletedId = this.props.commentID;
            deletedContentType = "comment";
          } else if (this.props.threadID) {
            deletedId = this.props.threadID;
            deletedContentType = "thread";
          } else {
            return false;
          }

          const event = new CustomEvent("discussion-deleted", {
            detail: {
              deletedId,
              deletedContentType,
            },
          });
          document.dispatchEvent(event);
        })
        .catch((error) => {
          captureEvent({
            error,
            msg: "Failed to remove user comment",
            data: { url },
          });
        });
    };

    return (
      <div className={css(classNames)} onClick={_handleDelete}>
        <span className={css(styles.icon)} id={"deleteIcon"}>
          {trash}
        </span>
        <span id={"delete"}>Delete</span>
      </div>
    );
  };

  toggleReplyBox = () => {
    this.setState({
      showReplyBox: !this.state.showReplyBox,
    });
  };

  handleAwardBounty = ({
    bountyId,
    objectId,
    recipientUserName,
    recipientUserId,
    contentType,
  }) => {
    const { bounty } = this.props;
    return Bounty.awardAPI({
      bountyId: bountyId ? bountyId : bounty.id,
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
    const deleteButton = this.renderDeleteButton();
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
                {reply}
              </span>
              Reply
            </div>
          )}

          {showBountyAward && !this.state.bountyAwarded && (
            <div
              className={css(styles.text, styles.action)}
              onClick={() => {
                let amount = 0;
                this.props.bounties.forEach(
                  (bounty) => (amount += bounty.amount)
                );
                const formattedBountyAmount = formatBountyAmount({
                  amount,
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
                      const promises = [];
                      this.props.bounties.forEach((bounty) => {
                        const bountyRes = this.handleAwardBounty({
                          bountyId: bounty.id,
                          recipientUserId: this.props.createdBy.id,
                          recipientUserName,
                          objectId:
                            this.props.contentType === "thread"
                              ? this.props.threadID
                              : this.props.commentID,
                          contentType: this.props.contentType,
                        });
                        promises.push(bountyRes);
                      });

                      if (promises.length) {
                        Promise.all(promises).then((_) => {
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
                          onBountyAward &&
                            onBountyAward({
                              bountyAmount: formattedBountyAmount,
                            });
                        });
                      }
                    },
                    onError: (error) => {
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
                {medal}
              </span>
              <span className={css(styles.smallAwardText)}>Award Bounty</span>
              <span className={css(styles.awardText)}>
                Accept Answer & Award Bounty
              </span>
            </div>
          )}

          {this.props.toggleEdit && editButton}
          {this.props.toggleEdit && deleteButton}
          <FlagButtonV2
            buttonText=""
            iconOverride={flagOutline}
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
    flex: 1,
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    fontWeight: 500,
  },
  smallAwardText: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "inline",
    },
  },
  awardText: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
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
    ":hover #deleteIcon": {
      color: colors.RED(),
    },
    ":hover #delete": {
      color: colors.RED(),
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
