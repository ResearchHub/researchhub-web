import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

// Component
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";

// Config
import colors from "~/config/themes/colors";

const ActionButton = (props) => {
  let {
    icon,
    iconNode,
    action,
    actionType,
    addRipples,
    active,
    isModerator,
    paperId,
    onAction,
    containerStyle,
    iconStyle,
    restore,
    uploadedById,
    isUploaderSuspended,
    onAfterAction,
  } = props;

  function renderIcon() {
    if (icon) {
      return <span className={css(styles.icon)}>{icons[icon]}</span>;
    } else if (iconNode) {
      return iconNode;
    }
  }

  if (isModerator) {
    return (
      <ModeratorDeleteButton
        icon={icon ? icon : <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>}
        containerStyle={containerStyle && containerStyle}
        iconStyle={iconStyle ? iconStyle : styles.deleteIcon}
        actionType={actionType ? actionType : restore ? "restore" : "page"}
        metaData={{
          paperId,
          authorId: uploadedById,
          isSuspended: isUploaderSuspended,
        }}
        forceRender={true}
        onAction={onAction}
        onAfterAction={onAfterAction}
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
    color: colors.BLACK(0.35),
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: colors.RED(1),
    },
  },
  activeIcon: {
    color: colors.RED(1),
  },
  active: {
    color: colors.WHITE(),
    background: colors.GREY(1),
  },
});

export default ActionButton;
