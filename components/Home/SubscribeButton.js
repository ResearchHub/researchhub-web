import { useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";

import Loader from "~/components/Loader/Loader";

import { ModalActions } from "~/redux/modals";

import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { subscribeToHub, unsubscribeFromHub } from "~/config/fetch";

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

  const _onClick = () => {
    onClick && onClick();
    const SUBSCRIBE_API = subscribe ? unsubscribeFromHub : subscribeToHub;

    SUBSCRIBE_API({ hubId: hub.id })
      .then((_) => (subscribe ? onUnsubscribe() : onSubscribe()))
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
      return hover ? "Unsubscribe" : <span>Subscribed {icons.starFilled}</span>;
    }

    return "Subscribe";
  };

  const formatButtonProps = () => {
    const buttonProps = {
      className: css(styles.subscribe),
    };

    if (subscribe) {
      buttonProps.className = css(
        styles.subscribe,
        hover && styles.subscribeHover
      );
      buttonProps.onMouseEnter = onMouseEnterSubscribe;
      buttonProps.onMouseLeave = onMouseExitSubscribe;
    }

    return buttonProps;
  };

  return (
    <Ripples onClick={_onClick} className={css(styles.subscribe)}>
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
    </Ripples>
  );
};

const styles = StyleSheet.create({
  subscribe: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.7,
    width: 120,
    height: 37,
    boxSizing: "border-box",
    // padding: "5px 15px",
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
