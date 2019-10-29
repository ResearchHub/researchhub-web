import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import Modal from "./Modal";
import ReputationCard from "./ReputationCard";

import { ModalActions } from "../redux/modals";

const PermissionNotification = (props) => {
  const { userReputation } = props;

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const baseTitle = "Not enough reputation points";
  const [title, setTitle] = useState(baseTitle);

  const modalState = useSelector((state) => state.modals);

  useEffect(() => {
    setIsOpen(modalState.openPermissionNotificationModal);
    setTitle(baseTitle + " to " + modalState.permissionNotificationAction);
  }, [modalState]);

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
