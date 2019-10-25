import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useStore } from "react-redux";

import Modal from "./Modal";
import ReputationCard from "./ReputationCard";

import { ModalActions } from "../redux/modals";

const PermissionNotification = (props) => {
  const { userReputation } = props;

  const dispatch = useDispatch();
  const store = useStore();

  const [isOpen, setIsOpen] = useState(false);

  const baseTitle = "Not enough reputation points";
  const [title, setTitle] = useState(baseTitle);

  useEffect(() => {
    const modalState = store.getState().modals;

    setIsOpen(modalState.openPermissionNotificationModal);
    setTitle(baseTitle + " to " + modalState.permissionNotificationAction);
  }, [store.getState().modals.openPermissionNotificationModal]);

  function close() {
    dispatch(ModalActions.openPermissionNotificationModal(false));
  }

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
