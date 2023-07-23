import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";

import Sparkle from "react-sparkle";

import { ModalActions } from "~/redux/modals";

import colors from "~/config/themes/colors";
import { formatScore } from "~/config/utils/form";
import ReactTooltip from "react-tooltip";
import IconButton from "../Icons/IconButton";

const DEFAULT_SHIMMER_TIME = 1150;

const ContentSupport = (props) => {
  const {
    data,
    metaData,
    fetching,
    auth,
    openLoginModal,
    openContentSupportModal,
    awardedBountyAmount,
    showAmount = true,
    children,
  } = props;

  const tooltipRef = useRef(null);
  const [count, setCount] = useState(
    parseFloat(data?.promoted + data?.awarded_bounty_amount) || 0
  );
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setCount(
      parseFloat((data?.promoted || 0) + data?.awarded_bounty_amount) || 0
    );
  }, [data.awarded_bounty_amount]);

  useEffect(() => {
    if (awardedBountyAmount) {
      setCount(parseFloat((data?.promoted || 0) + awardedBountyAmount) || 0);
    }
  }, [awardedBountyAmount]);

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
    if (auth.isLoggedIn && metaData && data) {
      const contentAuthor =
        metaData.contentType === "summary" ? data.proposed_by : data.created_by;
      if (auth.user.id === contentAuthor.id) {
        return true;
      }
    }
    return false;
  };

  const openSupportModal = () => {
    const params = { metaData, data, count, setCount: updateCountUI };
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
          <ClipLoader
            sizeUnit={"px"}
            size={5}
            color={colors.BLUE(1)}
            loading={true}
          />
        </span>
      );
    }

    if (count > 0) {
      return <span className={css(styles.count)}>+{formatScore(count)}</span>;
    }
  };

  return (
    <div
      className={css(styles.container)}
      ref={tooltipRef}
      data-effect="solid"
      data-delay-show={500}
    >
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          handleClick(event);
          ReactTooltip.hide();
        }}
      >
        {showAmount && renderCount()}
        {children}
      </IconButton>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    zIndex: 1,
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
    height: 20,
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
  },
  count: {
    fontSize: 15,
    marginRight: 5,
    color: colors.NEW_GREEN(),
  },
  plusButton: {
    position: "absolute",
    top: -4,
    right: -7,
    fontSize: 12,
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

export default connect(mapStateToProps, mapDispatchToProps)(ContentSupport);
