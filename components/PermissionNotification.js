import Modal from "./Modal";

const PermissionNotification = (props) => {
  const { action } = props;
  const title = `Not enough reputation points to ${action}`;
  return <NotificationModal {...props} title={title}></NotificationModal>;
};

const NotificationModal = (props) => {
  const { isOpen, close, title } = props;
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      closeModal={close}
      shouldCloseOnOverlayClick={true}
      onRequestClose={close}
    >
      {props.children}
    </Modal>
  );
};

export default PermissionNotification;
