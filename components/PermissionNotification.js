import PropTypes from "prop-types";
import { useStore } from "react-redux";

import Modal from "./Modal";
import ReputationCard from "./ReputationCard";

const PermissionNotification = (props) => {
  const { close, userReputation } = props;

  const store = useStore();

  const { permissionNotificationAction } = store.getState().modals;
  const action = props.action || permissionNotificationAction;
  const title = `Not enough reputation points to ${action}`;

  const isOpen = store.getState().modals.openPermissionNotificationModal;

  return (
    <NotificationModal close={close} isOpen={isOpen} title={title}>
      <ReputationCard reputation={userReputation} />
    </NotificationModal>
  );
};

PermissionNotification.propTypes = {
  action: PropTypes.string,
  close: PropTypes.func,
  isOpen: PropTypes.bool,
  userReputation: PropTypes.number,
};

const NotificationModal = (props) => {
  const { isOpen, close, title } = props;
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      close={close}
      shouldCloseOnOverlayClick={true}
    >
      {props.children}
    </Modal>
  );
};

export default PermissionNotification;
