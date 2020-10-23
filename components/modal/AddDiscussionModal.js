// NPM Modules
import React, { useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { Value } from "slate";

// Component
import TextEditor from "~/components/TextEditor";
import BaseModal from "./BaseModal";
import Message from "../Loader/Message";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";

// Redux
import { ModalActions } from "../../redux/modals";

// Config
import colors from "~/config/themes/colors";

const AddDiscussionModal = (props) => {
  let {
    modals,
    openAddDiscussionModal,
    handleDiscussionTextEditor,
    discussion,
    handleInput,
    save,
    mobileView,
  } = props;

  function closeModal() {
    openAddDiscussionModal(false);
  }

  function cancel() {
    props.cancel && props.cancel();
    document.body.style.overflow = "scroll";
    props.openAddDiscussionModal(false);
  }

  return (
    <BaseModal
      isOpen={modals.openAddDiscussionModal}
      closeModal={closeModal}
      title={"Add a Discussion"}
      subtitle={"Post a question or topic to get started"}
    >
      <div className={css(styles.box)}>
        <Message />
        <FormInput
          label={"Title"}
          placeholder="Title of discussion"
          containerStyle={styles.container}
          value={discussion.title}
          id={"title"}
          onChange={handleInput}
          required={true}
        />
        <div className={css(styles.discussionInputWrapper)}>
          <div className={css(styles.label)}>
            Question
            <span className={css(styles.asterick)}>*</span>
          </div>
          <div className={css(styles.discussionTextEditor)}>
            <TextEditor
              canEdit={true}
              readOnly={false}
              onChange={handleDiscussionTextEditor}
              hideButton={true}
              placeholder={"Leave a question or a comment"}
              initialValue={discussion.question}
            />
          </div>
        </div>
        <div className={css(styles.buttonRow, styles.buttons)}>
          <div
            className={css(styles.button, styles.buttonLeft)}
            onClick={cancel}
          >
            <span className={css(styles.buttonLabel, styles.text)}>Cancel</span>
          </div>
          <Button
            label={"Save"}
            customButtonStyle={styles.button}
            onClick={save}
          />
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    scrollBehavior: "smooth",
  },
  container: {
    width: 600,
    marginBottom: 20,
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 410px)": {
      width: 300,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  discussionInputWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
  },
  discussionTextEditor: {
    width: 600,
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    minHeight: 300,
    height: 300,
    overflow: "auto",
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 410px)": {
      width: 300,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    width: "70%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 40,
    "@media only screen and (max-width: 725px)": {
      minWidth: "unset",
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 410px)": {
      width: 300,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  buttons: {
    justifyContent: "center",
  },
  button: {
    width: 180,
    height: 55,
    cursor: "pointer",
    "@media only screen and (max-width: 557px)": {
      width: 170,
      height: 45,
    },
    "@media only screen and (max-width: 410px)": {
      width: 160,
    },
  },
  buttonLeft: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  buttonLabel: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  asterick: {
    color: colors.BLUE(1),
  },
  text: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: colors.BLACK(0.8),
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openAddDiscussionModal: ModalActions.openAddDiscussionModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDiscussionModal);
