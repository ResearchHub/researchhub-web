import { css } from "aphrodite";
import Modal from "react-modal";

import { RHLogo } from "~/config/themes/icons";
import { modalStyles as styles } from "~/config/themes/styles";

const ModalComponent = (props) => {
  const { isOpen, close, shouldCloseOnOverlayClick, title } = props;

  return (
    <Modal
      className={css(styles.modal)}
      isOpen={isOpen}
      closeModal={close}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      onRequestClose={close}
      style={styles.overlay}
      ariaHideApp={false} // TODO: Set as true and add appElement
    >
      <div className={css(styles.modalContent)}>
        <img
          src={"/static/icons/close.png"}
          className={css(styles.closeButton)}
          onClick={close}
        />
        <div className={css(styles.titleContainer)}>
          <div className={css(styles.title, styles.text)}>{title}</div>
        </div>
        <div className={css(styles.centerContent)}>{props.children}</div>
        <div className={css(styles.logoContainer)}>
          <RHLogo iconStyle={styles.logo} />
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
