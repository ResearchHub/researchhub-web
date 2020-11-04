import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import Router from "next/router";

// Component
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const ActionButton = (props) => {
  let {
    icon,
    iconNode,
    action,
    addRipples,
    active,
    isModerator,
    paperId,
  } = props;

  function renderIcon() {
    if (icon) {
      return (
        <span className={css(styles.icon)} id={"#icon"}>
          <i className={icon} />
        </span>
      );
    } else if (iconNode) {
      return iconNode;
    }
  }

  const paperPageDeleteCallback = () => {
    Router.back();
  };

  if (isModerator) {
    return (
      <ModeratorDeleteButton
        icon={icons.ban}
        iconStyle={styles.deleteIcon}
        actionType={"page"}
        metaData={{ paperId }}
        onRemove={paperPageDeleteCallback}
      />
    );
  }
  if (addRipples) {
    return (
      <Ripples
        className={css(styles.actionButton, active && styles.active)}
        onClick={action}
      >
        <div className={css(styles.actionButton, active && styles.active)}>
          {renderIcon()}
        </div>
      </Ripples>
    );
  } else {
    return (
      <div
        className={css(styles.actionButton, active && styles.active)}
        onClick={action}
      >
        {renderIcon()}
      </div>
    );
  }
};

const styles = StyleSheet.create({
  actionButton: {
    width: 35,
    height: 35,
    borderRadius: "100%",
    background: colors.LIGHT_GREY(1),
    color: colors.GREY(1),
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    marginLeft: 5,
    marginRight: 5,
    display: "flex",
    flexShrink: 0,
    overflow: "hidden",
    transition: "all ease-in-out 0.1s",
    ":hover": {
      background: colors.GREY(1),
      color: colors.BLACK(),
    },
    "@media only screen and (max-width: 760px)": {
      width: 35,
      height: 35,
    },
    "@media only screen and (max-width: 415px)": {
      height: 33,
      width: 33,
    },
    "@media only screen and (max-width: 321px)": {
      height: 31,
      width: 31,
    },
  },
  deleteButton: {
    transition: "all ease-in-out 0.1s",
    color: colors.GREY(1),
    ":hover": {
      background: colors.RED(0.3),
      color: colors.RED(1),
    },
  },
  icon: {
    color: "unset",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  deleteIcon: {
    color: "rgba(36, 31, 58, 0.35)",
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: colors.RED(1),
    },
  },
  active: {
    color: "#FFF",
    background: colors.GREY(1),
  },
});

export default ActionButton;
