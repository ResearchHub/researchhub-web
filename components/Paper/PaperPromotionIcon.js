/**
 * NOTE: code is originally from PaperPromotionButton. Logic is copied from there
 * and is likely to be buggy (see: getCount, promoted is both boolean & number?).
 * The feature (showing # supports on left column) is likely temporary, so remove
 * or revise if needed @briansantoso
 */

import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import colors from "~/config/themes/colors";
import numeral from "numeral";
import { Fragment, useState } from "react";
import { ModalActions } from "~/redux/modals";
import { PaperPromotionIcon as Icon } from "~/config/themes/icons";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

function PaperPromotionIcon({ customStyle, openPaperTransactionModal, paper }) {
  const [hover, setHover] = useState(false);

  const { promoted, score } = paper;

  const getCount = () => {
    if (typeof promoted === "boolean") return 0;

    return numeral(promoted - score).format("0a");
  };

  const numPromotions = getCount();
  if (!numPromotions) {
    return null;
  }
  return (
    <Fragment>
      <div className={css(styles.divider)}></div>
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
            <Icon color={hover && colors.ORANGE()} emptyState={false} />
          </span>
          <span className={css(styles.count) + " count"}>{numPromotions}</span>
        </div>
      </PermissionNotificationWrapper>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  root: {
    color: "#AFADB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    cursor: "pointer",
    ":hover .count": {
      color: colors.BLACK(),
    },
    "@media only screen and (min-width: 0px) and (max-width: 767px)": {
      paddingRight: 0,
    },
  },
  icon: {
    width: 25,
    height: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 4,
  },
  hide: {
    display: "none",
  },
  divider: {
    width: 44,
    border: "1px solid #E8E8F2",
    margin: "15px 0",
  },
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
};

export default connect(
  null,
  mapDispatchToProps
)(PaperPromotionIcon);
