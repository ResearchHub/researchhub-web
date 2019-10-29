import { css } from "aphrodite";
import PropTypes from "prop-types";
import { useDispatch, useStore } from "react-redux";

import { ModalActions } from "~/redux/modals";

import {
  currentUserHasMinimumReputation,
  getMinimumReputation,
} from "~/config/utils";

const PropsWarning = `Must supply at least one of the following props to
PermissionNotificationWrapper: loginRequired, onClick, permissionKey.
Functionality may break without it.`;

const PermissionNotificationWrapper = (props) => {
  const {
    loginRequired,
    modalMessage,
    onClick,
    permissionKey,
    styling,
  } = props;

  const store = useStore();
  const dispatch = useDispatch();

  function executeIfUserMeetsRequirement(e) {
    if (loginRequired) {
      executeIfLoggedIn(e);
    } else if (permissionKey) {
      executeIfUserHasMinimumReputation(e);
    } else if (onClick) {
      onClick(e);
    } else {
      console.warn(PropsWarning);
    }
  }

  function executeIfLoggedIn(e) {
    const userIsLoggedIn = store.getState().auth.isLoggedIn;

    if (userIsLoggedIn) {
      if (permissionKey) {
        executeIfUserHasMinimumReputation(e);
      } else {
        onClick && onClick(e);
      }
    } else {
      dispatch(
        ModalActions.openLoginModal(true, `Please login to ${modalMessage}`)
      );
    }
  }

  function executeIfUserHasMinimumReputation(e) {
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
        onClick && onClick(e);
      } else {
        dispatch(
          ModalActions.openPermissionNotificationModal(true, modalMessage)
        );
      }
    }
  }

  return (
    <span className={css(styling)} onClick={executeIfUserMeetsRequirement}>
      {props.children}
    </span>
  );
};

PermissionNotificationWrapper.propTypes = {
  loginRequired: PropTypes.bool,
  modalMessage: PropTypes.string,
  onClick: PropTypes.func,
  permissionKey: PropTypes.string,
  styling: PropTypes.object,
};

export default PermissionNotificationWrapper;
