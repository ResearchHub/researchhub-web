import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/pro-duotone-svg-icons";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import { useAlert } from "react-alert";

// Redux
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";

// Config
import colors from "~/config/themes/colors";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { doesNotExist } from "~/config/utils/nullchecks";
import useCacheControl from "~/config/hooks/useCacheControl";

const ModeratorDeleteButton = (props) => {
  const { revalidateAuthorProfile } = useCacheControl();
  const alert = useAlert();
  const {
    containerStyle,
    documentType,
    forceRender,
    icon,
    iconStyle,
    isEditorOfHubs,
    isModerator,
    label,
    labelStyle,
    metaData,
    onAction,
    onAfterAction,
  } = props;

  const containerClass = [
    styles.buttonContainer,
    containerStyle && containerStyle,
  ];
  const iconClass = [styles.icon, iconStyle && iconStyle];
  const labelClass = [styles.label, labelStyle && labelStyle];

  const performAction = (event) => {
    event.preventDefault();
    let type = props.actionType;
    let text;

    switch (type) {
      case "restore":
        text = "Are you sure you want to restore this page?";
        return alert.show({
          text,
          buttonText: "Restore",
          onClick: () => {
            if (onAction) {
              return onAction();
            }
          },
        });
      case "page":
        text = "Are you sure you want to remove this page?";
        return alert.show({
          text,
          buttonText: "Remove",
          onClick: () => {
            if (onAction) {
              return onAction();
            } else {
              return deletePaperPage();
            }
          },
        });
      case "pdf":
        text = "Are you sure you want to remove this PDF?";
        return alert.show({
          text,
          buttonText: "Remove",
          onClick: () => {
            return deletePaperPDF();
          },
        });
      case "post":
        text = "Are you sure you want to remove this post?";
        return alert.show({
          text,
          buttonText: "Remove",
          onClick: () => {
            return deletePost();
          },
          containerStyle: {
            zIndex: 11 /* 10 is InlineCommentThreadDisplayBar */,
          },
        });
      case "user":
        return handleUserDelete();

      default:
        return null;
    }
  };

  /**s
   * Used to delete a paper page
   */
  const deletePaperPage = () => {
    showLoader();
    const { paperId, threadId, commentId, replyId, postId } = props.metaData;
    return fetch(API.CENSOR_PAPER({ paperId }), API.DELETE_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showSucessMessage("Paper Successfully Removed.");
        props.onRemove &&
          props.onRemove({
            commentID: commentId,
            paperID: paperId,
            postID: postId,
            replyID: replyId,
            threadID: threadId,
          });
      })
      .catch((err) => {
        let message = "Something went wrong";
        if (err.message.detail) {
          message = err.message.detail;
        }
        showErrorMessage(message);
      });
  };

  /**
   * Used to delete a paper's pdf
   */
  const deletePaperPDF = () => {
    showLoader();
    const { paperId, threadId, commentId, replyId } = props.metaData;
    return fetch(API.CENSOR_PAPER_PDF({ paperId }), API.DELETE_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showSucessMessage("Paper PDF Successfully Removed.");
        props.onRemove &&
          props.onRemove({
            commentID: commentId,
            paperID: paperId,
            replyID: replyId,
            threadID: threadId,
          });
      })
      .catch((err) => {
        let message = "Something went wrong";
        if (err.message.detail) {
          message = err.message.detail;
        }
        showErrorMessage(message);
      });
  };

  /**
   * Used to delete a user's post, comment, reply, thread, etc.
   */
  const deletePost = () => {
    showLoader();
    let query = buildQuery();
    const { paperId, threadId, commentId, replyId, documentId } =
      props.metaData;
    return fetch(API.CENSOR_POST(query), API.DELETE_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        showSucessMessage("Post Successfully Removed.");
        props.onRemove &&
          props.onRemove({
            commentID: commentId,
            paperID: paperId,
            documentID: documentId,
            replyID: replyId,
            threadID: threadId,
          });
      })
      .catch((err) => {
        let message = "Something went wrong";
        if (err.message.detail) {
          message = err.message.detail;
        }
        showErrorMessage(message);
      });
  };

  /**
   * Used to delete users
   */
  const handleUserDelete = () => {
    const { isSuspended } = metaData;
    const text = `Are you sure you want to ${
      isSuspended ? "reinstate" : "remove"
    } this user?`;
    return alert.show({
      text,
      buttonText: isSuspended ? "Reinstate" : "Remove",
      onClick: () => {
        showLoader();
        if (onAction) {
          return onAction();
        } else {
          isSuspended ? reinstateUser() : removeUser();
          onAfterAction && onAfterAction();
        }
      },
    });
  };

  const removeUser = () => {
    const { auth, updateUser, metaData } = props;
    const {
      authorId,
      paperId,
      postId,
      threadId,
      commentId,
      replyId,
      setIsSuspended,
    } = metaData;

    return fetch(
      API.USER({ route: "censor" }),
      API.POST_CONFIG({ authorId: authorId })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setIsSuspended && setIsSuspended(true);
        if (auth.user.author_profile.id === authorId) {
          updateUser &&
            updateUser({
              ...auth.user,
              is_suspended: true,
              probable_spammer: true,
            });
        }
        showSucessMessage("User Successfully Removed.");
        props.onRemove &&
          props.onRemove({
            commentID: commentId,
            paperID: paperId,
            postID: postId,
            replyID: replyId,
            threadID: threadId,
          });

        revalidateAuthorProfile(authorId);
      })
      .catch((err) => {
        let message = "Something went wrong";
        if (err.message.detail) {
          message = err.message.detail;
        }
        showErrorMessage(message);
      });
  };

  const reinstateUser = () => {
    const { authorId, setIsSuspended } = metaData;
    const { auth, updateUser } = props;
    return fetch(
      API.USER({ route: "reinstate" }),
      API.POST_CONFIG({ author_id: authorId })
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setIsSuspended && setIsSuspended(false);
        if (auth.user.author_profile.id === authorId) {
          updateUser({ ...res });
        }
        showSucessMessage("User Successfully Reinstated.");
        revalidateAuthorProfile(authorId);
      })
      .catch((err) => {
        let message = "Something went wrong";
        if (err.message.detail) {
          message = err.message.detail;
        }
        showErrorMessage(message);
      });
  };

  const buildQuery = () => {
    let { paperId, threadId, commentId, replyId, documentId } = props.metaData;
    let query = {};
    query.documentType = documentType;

    if (!doesNotExist(documentId)) {
      query.documentId = documentId;
    }
    if (!doesNotExist(paperId)) {
      query.paperId = paperId;
    }
    if (!doesNotExist(threadId)) {
      query.threadId = threadId;
    }
    if (!doesNotExist(commentId)) {
      query.commentId = commentId;
    }
    if (!doesNotExist(replyId)) {
      query.replyId = replyId;
    }

    return query;
  };

  const showLoader = () => {
    props.showMessage({ load: true, show: true });
  };

  const showSucessMessage = (msg) => {
    props.showMessage({ show: false }); // component requires to be toggled off first
    props.setMessage(msg);
    props.showMessage({ show: true, clickOff: true });
  };

  const showErrorMessage = (message) => {
    props.showMessage({ show: false });
    props.setMessage(message || "Something went wrong");
    props.showMessage({ show: true, error: true, clickOff: true });
  };

  if (isModerator || isEditorOfHubs || forceRender) {
    return (
      <Ripples className={css(containerClass)} onClick={performAction}>
        <span className={css(iconClass) + " modIcon"}>
          {icon ? (
            icon
          ) : (
            <FontAwesomeIcon icon={faMinusCircle}></FontAwesomeIcon>
          )}
        </span>
        {label && <span className={css(labelClass)}>{label}</span>}
      </Ripples>
    );
  } else {
    // don't render button
    return null;
  }
};

const styles = StyleSheet.create({
  buttonContainer: {
    cursor: "pointer",
  },
  icon: {
    color: colors.RED(),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  isModerator: state.auth.user.moderator,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  updateUser: AuthActions.updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeratorDeleteButton);
