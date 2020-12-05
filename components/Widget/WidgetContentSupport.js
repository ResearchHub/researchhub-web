import { Fragment, useState, useEffect, useRef } from "react";
import { useStore, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import Ripples from "react-ripples";
import { useAlert } from "react-alert";
import Link from "next/link";
import moment from "moment";

import { ModalActions } from "~/redux/modals";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const ContentSupport = (props) => {
  const dispatch = useDispatch();
  const { data, metaData } = props;
  const [count, setCount] = useState(data.promotion || 0);

  const openContentSupportModal = () => {
    const params = { metaData, data, setCount };

    dispatch(ModalActions.openContentSupportModal(true, params));
  };

  const renderCount = () => {
    return count > 0 ? (
      <span className={css(styles.count)}>{count}</span>
    ) : (
      <span className={css(styles.plusButton)} id={"plusIcon"}>
        {icons.plusCircleSolid}
      </span>
    );
  };

  return (
    <div
      className={css(styles.container)}
      data-tip={`Award ResearchCoin`}
      onClick={openContentSupportModal}
    >
      <img className={css(styles.icon)} src={"/static/icons/coin-filled.png"} />
      {renderCount()}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    marginLeft: 10,
    cursor: "pointer",
    position: "relative",
    ":hover #plusIcon": {
      color: colors.BLUE(),
      transform: "scale(1.05)",
    },
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    height: 15,
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
  },
  count: {
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 5,
  },
  plusButton: {
    position: "absolute",
    top: -3,
    right: -5,
    fontSize: 10,
    marginLeft: 3,
    color: colors.BLUE(),
    background: "#FFF",
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
});

export default ContentSupport;
