import { StyleSheet, css } from "aphrodite";
import { useStore, useDispatch } from "react-redux";
import { useAlert } from "react-alert";

// Components
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

// Redux
import { MessageActions } from "~/redux/message";
import { FlagActions } from "~/redux/flags";

// Utility
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const FlagButton = ({ paperId, reason, flagged, setFlag, style }) => {
  const alert = useAlert();
  const store = useStore();
  const dispatch = useDispatch();

  async function flagPaper(paperId, reason) {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    const prevState = store.getState().flags;
    await dispatch(FlagActions.postPaperFlag(prevState, paperId, reason));
    const flags = store.getState().flags;
    if (flags.doneFetching && flags.success) {
      setFlag(true);
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
    await dispatch(FlagActions.removePaperFlag(prevState, paperId));
    const flags = store.getState().flags;
    if (flags.doneFetching && flags.success) {
      setFlag(false);
      dispatch(MessageActions.showMessage({ show: false }));
      dispatch(MessageActions.setMessage("Flag Removed"));
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
          text: flagged
            ? "Remove flag for this paper?"
            : "Flag this paper for copyright?",
          buttonText: "Yes",
          onClick: () => {
            flagged ? removeFlag(paperId) : flagPaper(paperId, reason);
          },
        })
      }
      permissionKey="UpdatePaper"
      loginRequired={true}
      styling={[styles.borderRadius, flagged && styles.flagged]}
      hideRipples={true}
    >
      <div className={css(style && style)}>
        {flagged ? icons.flag : icons.flagOutline}
      </div>
    </PermissionNotificationWrapper>
  );
};

const styles = StyleSheet.create({
  borderRadius: {
    borderRadius: "50%",
  },
  flagged: {
    color: "#000",
  },
});

export default FlagButton;
