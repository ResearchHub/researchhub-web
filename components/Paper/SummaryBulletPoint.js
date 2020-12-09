import { StyleSheet, css } from "aphrodite";
import { useState, Fragment, useEffect } from "react";
import { useStore, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import * as Sentry from "@sentry/browser";
import moment from "moment";

import FormTextArea from "../Form/FormTextArea";
import Ripples from "react-ripples";
import Button from "../Form/Button";
import Loader from "~/components/Loader/Loader";
import BulletPointVote from "./Vote/BulletPointVote";

import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import AuthorAvatar from "../AuthorAvatar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";

const SummaryBulletPoint = (props) => {
  const {
    data,
    manage,
    type,
    index,
    onEditCallback,
    onRemoveCallback,
    editable,
    authorProfile,
  } = props;
  const store = useStore();
  const dispatch = useDispatch();
  const alert = useAlert();

  let { plain_text, created_by, is_removed } = data;
  let userId = store.getState().auth.user.id;
  const [text, setText] = useState(plain_text || "");
  const [hovered, toggleHover] = useState(false);
  const [editView, setEditView] = useState(false);
  const [editText, setEditText] = useState(plain_text || "");
  const [pending, togglePending] = useState(false);
  const [isModerator, setIsModerator] = useState(
    store.getState().auth.user.moderator || false
  );

  useEffect(() => {
    setIsModerator(store.getState().auth.user.moderator);
  }, [store.getState().auth.user.moderator]);

  const setHover = (state) => {
    if (hovered !== state) {
      toggleHover(state);
    }
  };

  const toggleEditView = () => {
    setEditView(!editView);
  };

  const handleText = (id, value) => {
    setEditText(value);
  };

  const submitEdit = () => {
    togglePending(true);
    let bulletId = data.id;
    let paperId = data.paper;
    let params = {
      plain_text: editText,
      ordinal: data.ordinal ? data.ordinal : null,
      bullet_type: type,
    };
    return fetch(
      API.EDIT_BULLET_POINT({ bulletId, paperId }),
      API.POST_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        onEditCallback && onEditCallback(res, props.index);
        setText(editText);
        togglePending(false);
        setEditView(false);
        dispatch(MessageActions.setMessage("Edit Successful"));
        dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        if (err.response.status === 429) {
          togglePending(false);
          return dispatch(ModalActions.openRecaptchaPrompt(true));
        }
        Sentry.captureException(err);
        togglePending(false);
        dispatch(MessageActions.setMessage("Something went wrong"));
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      });
  };

  const removalConfirmation = (e) => {
    e && e.stopPropagation();

    alert.show({
      text: "Remove this key takeaway?",
      buttonText: "Yes",
      onClick: () => {
        onRemove();
      },
    });
  };

  const onRemove = () => {
    dispatch(MessageActions.showMessage({ show: true, load: true }));
    let bulletId = data.id;
    fetch(API.KEY_TAKEAWAY({ bulletId, route: "censor" }), API.DELETE_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        onRemoveCallback && onRemoveCallback(index);
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage("Key takeaway removed"));
        dispatch(MessageActions.showMessage({ show: true }));
      })
      .catch((err) => {
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage("Something went wrong"));
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      });
  };

  /**
   * Needed by DiscussionPostMetadata component to allow users to support/award content
   */
  const formatMetadata = () => ({
    contentType: "bulletpoint",
    objectId: data.id,
  });

  const renderBody = () => {
    if (editView) {
      return (
        <div className={css(styles.editContainer)}>
          <FormTextArea
            value={editText}
            onChange={handleText}
            containerStyle={inputStyles.formContainer}
            labelStyle={inputStyles.formLabel}
            inputStyle={inputStyles.formInput}
          />
          <div className={css(styles.buttonRow)}>
            <Ripples
              className={css(styles.cancelButton, pending && styles.disabled)}
              onClick={pending ? null : toggleEditView}
            >
              Cancel
            </Ripples>
            <Button
              label={
                pending ? (
                  <Loader loading={true} size={20} color={"#fff"} />
                ) : (
                  "Submit"
                )
              }
              size={"small"}
              onClick={submitEdit}
              disabled={pending}
            />
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          {editable && hovered && (
            <div className={css(styles.editButton)} onClick={toggleEditView}>
              {icons.pencil}
            </div>
          )}
          <div className={css(styles.topRow)}>
            <div className={css(styles.row)}>
              <BulletPointVote bulletPoint={data} />
              <div className={css(styles.bulletpointText)}>
                {plain_text && text}
              </div>
            </div>
            <div className={css(styles.row, styles.bottomRow)}>
              <DiscussionPostMetadata
                username={
                  authorProfile.first_name + " " + authorProfile.last_name
                }
                authorProfile={authorProfile}
                date={data.created_date}
                fullDate={true}
                hideHeadline={true}
                containerStyle={styles.metadata}
                smaller={true}
                metaData={formatMetadata()}
                data={data}
              />
            </div>
          </div>
        </Fragment>
      );
    }
  };

  const renderDeleteButton = () => {
    if (hovered && isModerator) {
      let classNames = [styles.deleteButton];

      if (editable) {
        classNames.push(styles.position);
      }

      return (
        <div className={css(classNames)} onClick={removalConfirmation}>
          {icons.trash}
        </div>
      );
    }
  };

  return (
    <div
      className={css(
        styles.bulletpoint,
        manage && styles.cursorMove,
        is_removed && styles.hidden
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {renderDeleteButton()}
      {renderBody()}
    </div>
  );
};

const inputStyles = StyleSheet.create({
  formContainer: {
    margin: 0,
    padding: 0,
    width: "100%",
  },
  formLabel: {
    margin: 0,
    padding: 0,
    display: "none",
  },
  formInput: {
    margin: 0,
    minHeight: 50,
    fontSize: 15,
  },
});

const styles = StyleSheet.create({
  bulletpoint: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FBFBFD",
    alignItems: "flex-start",
    boxSizing: "border-box",
    borderRadius: 3,
    padding: "25px 20px",
    paddingBottom: 10,
    marginBottom: 10,
    border: "1px solid #F0F0F0",
    position: "relative",
    "@media only screen and (max-width: 415px)": {
      padding: 8,
    },
  },
  authorAvatar: {
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  topRow: {
    width: "100%",
    // display: "flex",
    // alignItems: "flex-start",
  },
  voteWidget: {
    marginLeft: 0,
    marginRight: 16,
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  bulletpointText: {
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 15,
    width: "100%",
    paddingTop: 4,
    lineHeight: 1.6,
    boxSizing: "border-box",
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  bottomRow: {
    width: "100%",
    marginTop: 10,
  },
  metadata: {
    justifyContent: "flex-end",
  },
  contributorText: {
    color: "rgba(36, 31, 58, 0.4)",
    fontStyle: "italic",
    fontSize: 14,
    marginRight: 8,
  },
  cursorMove: {
    cursor: "move",
  },
  editButton: {
    position: "absolute",
    cursor: "pointer",
    fontSize: 12,
    top: 6,
    right: 8,
    color: "#241F3A",
    opacity: 0.6,
  },
  editContainer: {
    // height: 60
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  buttonRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  cancelButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      color: "#3971FF",
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  disabled: {
    opacity: "0.4",
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 12,
    cursor: "pointer",
    color: "#241F3A",
    color: colors.RED(),
    opacity: 0.6,
    ":hover": {
      opacity: 1,
    },
  },
  position: {
    right: 28,
  },
  hidden: {
    display: "none",
  },
});

export default SummaryBulletPoint;
