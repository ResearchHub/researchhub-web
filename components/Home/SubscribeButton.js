import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";

import Loader from "~/components/Loader/Loader";

import { ModalActions } from "~/redux/modals";

import colors from "~/config/themes/colors";
import { subscribeToHub, unsubscribeFromHub } from "~/config/fetch";
import { capitalize } from "~/config/utils";

const SubscribeButton = (props) => {
  const {
    transition,
    subscribe,
    onSubscribe,
    onUnsubscribe,
    hub,
    onClick,
  } = props;
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setHover(false);
  }, [hub]);

  const _onClick = () => {
    onClick && onClick();
    const SUBSCRIBE_API = subscribe ? unsubscribeFromHub : subscribeToHub;
    const hubName = hub.name && capitalize(hub.name);
    SUBSCRIBE_API({ hubId: hub.id })
      .then((_) => (subscribe ? onUnsubscribe(hubName) : onSubscribe(hubName)))
      .catch((err) => {
        if (err.response.status === 429) {
          props.openRecaptchaPrompt(true);
        }
      });
  };

  const onMouseEnterSubscribe = () => {
    !hover && setHover(true);
  };

  const onMouseExitSubscribe = () => {
    hover && setHover(false);
  };

  const formatText = () => {
    if (subscribe) {
      return hover ? "Leave" : <span>Joined</span>;
    }

    return "Join";
  };

  const formatButtonProps = () => {
    const buttonProps = {
      className: css(styles.subscribe),
    };

    if (subscribe) {
      buttonProps.className = css(
        styles.subscribe,
        styles.subscribed,
        hover && styles.subscribeHover
      );
      buttonProps.onMouseEnter = onMouseEnterSubscribe;
      buttonProps.onMouseLeave = onMouseExitSubscribe;
    }

    return buttonProps;
  };

  return (
    <PermissionNotificationWrapper
      modalMessage="join hubs"
      loginRequired={true}
      styling={styles.subscribe}
      onClick={_onClick}
    >
      <div className={css(styles.subscribe)}>
        <button {...formatButtonProps()}>
          <span>
            {!transition ? (
              formatText()
            ) : (
              <Loader
                key={"subscribeLoader"}
                loading={true}
                containerStyle={styles.loader}
                size={10}
                color={"#FFF"}
              />
            )}
          </span>
        </button>
      </div>
    </PermissionNotificationWrapper>
  );
};

const styles = StyleSheet.create({
  subscribe: {
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: 0.7,
    width: 100,
    height: 37,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#FFF",
    backgroundColor: colors.BLUE(),
    borderRadius: 3,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    ":hover": {
      background: "#3E43E8",
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 801px)": {
      width: "100%",
    },
  },
  subscribed: {
    backgroundColor: "#fff",
    color: colors.BLUE(),
    border: `1.5px solid ${colors.BLUE()}`,
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
  subscribeHover: {
    ":hover": {
      color: "#fff",
      backgroundColor: colors.RED(1),
      border: `1px solid ${colors.RED(1)}`,
    },
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeButton);
