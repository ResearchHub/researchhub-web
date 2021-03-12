import { Fragment, useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";

import Loader from "~/components/Loader/Loader";
import Sparkle from "react-sparkle";

import { ModalActions } from "~/redux/modals";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { formatScore } from "~/config/utils";

const DEFAULT_SHIMMER_TIME = 1150;

const ContentSupport = (props) => {
  const {
    data,
    metadata,
    fetching,
    auth,
    openLoginModal,
    openContentSupportModal,
  } = props;
  const [count, setCount] = useState((data && data.promoted) || 0);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (data && data.promoted) {
      if (data.promoted >= count) {
        setCount(data.promoted);
      }
    }
  }, [data]);

  const handleClick = () => {
    if (auth.isLoggedIn) {
      if (!isUserContent()) {
        return openSupportModal();
      }
    } else {
      openLoginModal(true, "Please sign in Google to continue.");
    }
  };

  const isUserContent = () => {
    if (auth.isLoggedIn && metadata && data) {
      const contentAuthor =
        metadata.contentType === "summary" ? data.proposed_by : data.created_by;
      if (auth.user.id === contentAuthor.id) {
        return true;
      }
    }
    return false;
  };

  const openSupportModal = () => {
    const params = { metadata, data, count, setCount: updateCountUI };
    openContentSupportModal(true, params);
  };

  const updateCountUI = (newCount) => {
    setCount(newCount);
    setUpdate(true);
    setTimeout(() => setUpdate(false), DEFAULT_SHIMMER_TIME);
  };

  const renderAnimation = () => {
    if (update) {
      return (
        <Sparkle
          color={colors.YELLOW()}
          flicker={false}
          maxSize={5}
          newSparkleOnFadeOut={true}
        />
      );
    }
  };

  const renderCount = () => {
    if (fetching) {
      return (
        <span className={css(styles.count)}>
          <Loader loading={true} size={5} />
        </span>
      );
    }

    if (count > 0) {
      return <span className={css(styles.count)}>{formatScore(count)}</span>;
    }

    if (!isUserContent()) {
      return (
        <span className={css(styles.plusButton)} id={"plusIcon"}>
          {icons.plusCircleSolid}
        </span>
      );
    }
  };

  const dataTip = () => {
    if (isUserContent()) {
      return "ResearchCoin awarded to your post";
    }
    return "Award ResearchCoin";
  };

  return (
    <div
      className={css(styles.container)}
      data-tip={dataTip()}
      onClick={handleClick}
    >
      {renderAnimation()}
      <img
        className={css(styles.icon)}
        src={"/static/icons/coin-filled.png"}
        alt="RSC Coin"
      />
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  openContentSupportModal: ModalActions.openContentSupportModal,
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentSupport);
