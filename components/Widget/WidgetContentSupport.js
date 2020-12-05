import { Fragment, useState, useEffect, useRef } from "react";
import { useStore, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";

import Loader from "~/components/Loader/Loader";
import Sparkle from "react-sparkle";
import Confetti from "react-confetti";

import { ModalActions } from "~/redux/modals";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const ContentSupport = (props) => {
  const dispatch = useDispatch();
  const { data, metaData, fetching } = props;
  const [count, setCount] = useState((data && data.promoted) || 0);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (data && data.promoted) {
      if (data.promoted >= count) {
        setCount(data.promoted);
      }
    }
  }, [data]);

  const openContentSupportModal = () => {
    const params = { metaData, data, count, setCount: updateCountUI };

    dispatch(ModalActions.openContentSupportModal(true, params));
  };

  const updateCountUI = (newCount) => {
    setCount(newCount);
    setUpdate(true);
    setTimeout(() => setUpdate(false), 1150);
  };

  const renderAnimation = () => {
    return <Sparkle color={colors.YELLOW()} flicker={false} maxSize={5} />;
  };

  const renderCount = () => {
    if (fetching) {
      return (
        <span className={css(styles.count)}>
          <Loader loading={true} size={5} />
        </span>
      );
    }

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
      {update && renderAnimation()}
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
    fontWeight: 500,
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
