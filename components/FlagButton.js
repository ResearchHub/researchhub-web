import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { useStore, useDispatch } from "react-redux";
import { useAlert } from "react-alert";

// Components
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import ActionButton from "~/components/ActionButton";

// Redux
import { MessageActions } from "~/redux/message";
import { FlagActions } from "~/redux/flags";

// Utility
import colors from "~/config/themes/colors";

const FlagButton = ({ paperId, reason }) => {
  const alert = useAlert();
  const store = useStore();
  const dispatch = useDispatch();

  async function flagPaper(paperId, reason) {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    const prevState = store.getState().flags;
    await dispatch(FlagActions.postPaperFlag(prevState, paperId, reason));
    const flags = store.getState().flags;
    if (flags.doneFetching && flags.success) {
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("Paper Flagged"));
      dispatch(MessageActions.showMessage({ show: true }));
    } else {
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("Please try again"));
      dispatch(MessageActions.showMessage({ show: true, error: true }));
    }
  }

  async function removeFlag(paperId) {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    const prevState = store.getState().flags;
    await dispatch(FlagActions.postPaperFlag(prevState, paperId, reason));
    const flags = store.getState().flags;
    if (flags.doneFetching && flags.success) {
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("Paper Flagged"));
      dispatch(MessageActions.showMessage({ show: true }));
    } else {
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("Please try again"));
      dispatch(MessageActions.showMessage({ show: true, error: true }));
    }
  }

  return (
    <PermissionNotificationWrapper
      modalMessage="flag papers"
      onClick={() =>
        alert.show({
          text: "Flag this paper for copyright?",
          buttonText: "Yes",
          onClick: () => flagPaper(paperId, reason),
        })
      }
      permissionKey="UpdatePaper"
      loginRequired={true}
      styling={styles.actionButton}
    >
      <ActionButton icon={"fas fa-flag"} />
    </PermissionNotificationWrapper>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: 46,
    height: 46,
    borderRadius: "100%",
    background: colors.LIGHT_GREY(1),
    color: colors.GREY(1),
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    flexShrink: 0,
    "@media only screen and (max-width: 760px)": {
      width: 35,
      height: 35,
    },
    "@media only screen and (max-width: 415px)": {
      height: 33,
      width: 33,
    },
    "@media only screen and (max-width: 321px)": {
      height: 31,
      width: 31,
    },
  },
});

export default FlagButton;
