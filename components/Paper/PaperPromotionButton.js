import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

// redux
import { ModalActions } from "~/redux/modals";

import numeral from "numeral";
import colors from "~/config/themes/colors";
import {
  PaperPromotionIcon,
  PaperPromotionIconLarge,
} from "~/config/themes/icons";

const PaperPromotionButton = ({
  customStyle,
  paper,
  openPaperTransactionModal,
}) => {
  const [hover, setHover] = useState(false);

  const { promoted, score } = paper;

  const getCount = () => {
    if (typeof promoted === "boolean") return 0;

    return numeral(promoted - score).format("0a");
  };

  return (
    <PermissionNotificationWrapper
      modalMessage="support paper"
      onClick={() => openPaperTransactionModal(true)}
      loginRequired={true}
      hideRipples={true}
    >
      <div
        data-tip={"Support Paper"}
        className={css(styles.root)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className={css(styles.icon, customStyle)}>
          <div className={css(styles.offset)}>
            <PaperPromotionIconLarge color={hover && colors.ORANGE()} />
          </div>
        </span>
        <span
          className={css(styles.count, !promoted && styles.hide) + " count"}
        >
          {getCount()}
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
    ":hover .count": {
      color: colors.BLACK(),
    },
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
  count: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 4,
  },
  hide: {
    display: "none",
  },
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
};

export default connect(
  null,
  mapDispatchToProps
)(PaperPromotionButton);
