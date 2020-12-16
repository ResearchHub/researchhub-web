import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const ModeratorQA = ({
  auth,
  label,
  type,
  paper,
  updatePaperState,
  containerStyles,
  openSectionBountyModal,
}) => {
  const [moderator, setIsModerator] = useState(false);
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (auth.isLoggedIn) {
      if (auth.user.moderator) {
        return setIsModerator(true);
      }
    }
    moderator && setIsModerator(false);
  }, [auth.isLoggedIn]);

  useEffect(() => {
    if (type === "takeaways") {
      setActive(paper.bullet_low_quality);
    } else if (type === "summary") {
      setActive(paper.summary_low_quality);
    }
  }, [paper]);

  const handleClick = (e) => {
    e && e.stopPropagation();
    const modalProps = {
      type,
      paper,
      updatePaperState,
    };

    return openSectionBountyModal(true, modalProps);
  };

  const renderIcon = () => {
    const isActive = hover;
    return icons.coinStack({ styles: styles.coinStackIcon, grey: !isActive });
  };

  const renderLabel = () => {
    return "Add Bounty";
  };

  return (
    <div
      className={css(
        styles.container,
        containerStyles && containerStyles,
        !moderator && styles.hide,
        active && styles.hide
      )}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className={css(styles.icon, active && styles.iconActive)}>
        {renderIcon()}
      </span>
      {renderLabel()}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "20px 20px 0px 0px",
    fontSize: 16,
    cursor: "pointer",
  },

  hide: {
    display: "none",
  },
  icon: {
    fontSize: 13,
    marginRight: 6,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  iconActive: {
    color: colors.BLUE(),
    opacity: 1,
  },
  coinStackIcon: {
    height: 13,
    width: 13,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  openSectionBountyModal: ModalActions.openSectionBountyModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeratorQA);
