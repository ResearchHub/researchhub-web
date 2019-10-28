import { useDispatch, useStore } from "react-redux";

import { ModalActions } from "~/redux/modals";

import {
  currentUserHasMinimumReputation,
  getMinimumReputation,
} from "~/config/utils";

const PermissionNotificationWrapper = (props) => {
  const { modalMessage, onClick, permissionKey } = props;

  const store = useStore();
  const dispatch = useDispatch();

  function executeIfUserMeetsReputationMinimum(e) {
    const minimumReputation = getMinimumReputation(
      store.getState(),
      permissionKey
    );

    if (!minimumReputation) {
      console.log(`Can not get minimum reputation for ${permissionKey}.`);
    } else {
      if (
        currentUserHasMinimumReputation(store.getState(), minimumReputation)
      ) {
        onClick(e);
      } else {
        dispatch(
          ModalActions.openPermissionNotificationModal(true, modalMessage)
        );
      }
    }
  }

  return (
    <div onClick={executeIfUserMeetsReputationMinimum}>{props.children}</div>
  );
};

export default PermissionNotificationWrapper;
