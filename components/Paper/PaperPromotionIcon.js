import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { Fragment, useState } from "react";
import { ModalActions } from "~/redux/modals";
import { PaperPromotionIcon as Icon } from "~/config/themes/icons";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { isNullOrUndefined } from "~/config/utils/nullchecks.ts";

function PaperPromotionIcon({
  customStyle,
  openPaperTransactionModal,
  paper,
  post,
}) {
  const [hover, setHover] = useState(false);

  const isPaper = !isNullOrUndefined(paper);
  const boostAmount = isPaper ? paper.boost_amount : post.boost_amount;

  return boostAmount ? (
    <Fragment>
      <div className={css(styles.divider)}></div>
      <PermissionNotificationWrapper
        modalMessage={`support ${isPaper ? "paper" : "post"}`}
        onClick={() => openPaperTransactionModal(true)}
        loginRequired={true}
        hideRipples={true}
      >
        <div
          data-tip={`Support ${isPaper ? "Paper" : "Post"}`}
          className={css(styles.root)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <span className={css(styles.icon, customStyle)}>
            <Icon color={hover && "rgb(36, 31, 58)"} emptyState={false} />
          </span>
          <span className={css(styles.count) + " count"}>{boostAmount}</span>
        </div>
      </PermissionNotificationWrapper>
    </Fragment>
  ) : null;
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
};

export default connect(null, mapDispatchToProps)(PaperPromotionIcon);
