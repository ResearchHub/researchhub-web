import Modal from "./Modal";
import ReputationCard from "./ReputationCard";

const PermissionNotification = (props) => {
  const { action, userReputation } = props;
  const title = `Not enough reputation points to ${action}`;
  return (
    <NotificationModal {...props} title={title}>
      <ReputationCard reputation={userReputation} />
    </NotificationModal>
  );
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
