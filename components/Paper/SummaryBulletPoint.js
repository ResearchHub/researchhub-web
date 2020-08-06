import { StyleSheet, css } from "aphrodite";
import { useState, Fragment, useEffect } from "react";
import { useStore, useDispatch } from "react-redux";

import FormTextArea from "../Form/FormTextArea";
import AuthorAvatar from "../AuthorAvatar";
import Ripples from "react-ripples";
import Button from "../Form/Button";
import Loader from "~/components/Loader/Loader";

import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";

const SummaryBulletPoint = (props) => {
  const { data, manage, type, onEditCallback } = props;
  const store = useStore();
  const dispatch = useDispatch();
  let { plain_text, created_by } = data;
  let userId = store.getState().auth.user.id;
  const [text, setText] = useState(plain_text ? plain_text : "");
  const [hovered, toggleHover] = useState(false);
  const [editable, setEditable] = useState(userId === created_by.id);
  const [editView, setEditView] = useState(false);
  const [editText, setEditText] = useState(plain_text ? plain_text : "");
  const [pending, togglePending] = useState(false);

  let authorProfile = created_by && created_by.author_profile;

  useEffect(() => {
    let userId = store.getState().auth.user.id;
    setEditable(userId === created_by.id);
  }, [store.getState().auth.user]);

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
        togglePending(false);
        dispatch(MessageActions.setMessage("Something went wrong"));
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      });
  };

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
            <div className={css(styles.bulletpointIcon)}>
              <i className="fas fa-dot-circle" />
            </div>
            <div className={css(styles.bulletpointText)}>
              {plain_text && text}
            </div>
          </div>
        </Fragment>
      );
    }
  };

  return (
    <div
      className={css(styles.bulletpoint, manage && styles.cursorMove)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
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
    padding: 16,
    marginBottom: 10,
    border: "1px solid #F0F0F0",
    position: "relative",
    "@media only screen and (max-width: 415px)": {
      padding: 8,
    },
  },
  topRow: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
  },
  bulletpointIcon: {
    color: "#3971FF",
    height: 30,
    minHeight: 30,
    maxHeight: 30,
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    borderRadius: "50%",
    boxSizing: "border-box",
    paddingTop: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    "@media only screen and (max-width: 415px)": {
      marginRight: 5,
    },
  },
  bulletpointText: {
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 15,
    width: "100%",
    paddingTop: 4,
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
    display: "flex",
    alignItems: "center",
    paddingLeft: 50,
    marginTop: 5,
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
});

export default SummaryBulletPoint;
