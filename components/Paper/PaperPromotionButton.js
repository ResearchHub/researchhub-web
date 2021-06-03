import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import colors from "~/config/themes/colors";
import numeral from "numeral";
import { Fragment, useState } from "react";
import { ModalActions } from "~/redux/modals";
import {
  PaperPromotionIcon,
  PaperPromotionIconLarge,
} from "~/config/themes/icons";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

const PaperPromotionButton = ({
  customStyle,
  openPaperTransactionModal,
  paper,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <PermissionNotificationWrapper
      modalMessage="support paper"
      onClick={() => openPaperTransactionModal(true)}
      loginRequired={true}
      hideRipples={true}
    >
      <div
        data-tip="Support Paper"
        className={css(styles.root)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className={css(styles.icon, customStyle)}>
          <div className={css(styles.offset)}>
            <PaperPromotionIconLarge color={hover && colors.ORANGE()} />
          </div>
        </span>
      </div>
    </PermissionNotificationWrapper>
  );
};

const styles = StyleSheet.create({
  root: {
    color: "#AFADB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "@media only screen and (min-width: 0px) and (max-width: 767px)": {
      paddingRight: 0,
    },
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  offset: {
    transform: "translate(8.5px, -3px)",
  },
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
};

export default connect(
  null,
  mapDispatchToProps
)(PaperPromotionButton);
