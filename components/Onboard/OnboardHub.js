import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

const OnboardHub = (props) => {
  const { userHubIds, hub } = props;
  const { id, name, hub_image } = hub;
  const [subscribed, setSubscribed] = useState(userHubIds[id] && true);

  const handleClick = (e) => {
    let state = !subscribed;
    setSubscribed(state);
    props.onClick && props.onClick(props.hub, state);
  };

  const renderButton = () => {
    return (
      <div className={css(styles.button, subscribed && styles.active)}>
        {subscribed ? (
          <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        )}
      </div>
    );
  };

  return (
    <div
      className={css(styles.root, subscribed && styles.subscribed)}
      onClick={handleClick}
    >
      <div className={css(styles.header)}>
        <div className={css(styles.title) + " clamp1"}>{name}</div>
        {renderButton()}
      </div>
      <img
        loading={"lazy"}
        draggable={"false"}
        className={css(styles.image)}
        src={hub_image ? hub_image : "/static/background/twitter-banner.jpg"}
        alt="Hub Background Image"
      />
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: 220,
    height: 187,
    border: `1px solid ${colors.LIGHT_GREY_BACKGROUND}`,
    borderRadius: 3,
    background: colors.WHITE(),
    boxSizing: "border-box",
    cursor: "pointer",
    ":hover": {
      border: `1px solid ${colors.LIGHT_GRAY196()}`,
      filter: `drop-shadow(0px 4px 4px ${colors.PURE_BLACK(0.25)}))`,
    },
  },
  subscribed: {
    border: `1px solid ${colors.LIGHT_GRAY196()}`,
    filter: `drop-shadow(0px 4px 4px ${colors.PURE_BLACK(0.25)}))`,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 15,
    boxSizing: "border-box",
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    color: colors.TEXT_DARKER_GREY,
    textTransform: "capitalize",
    paddingRight: 10,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    width: 25,
    minWidth: 25,
    borderRadius: "50%",
    background: colors.BLACK(0.03),
    color: colors.BLACK(0.5),
    border: `1px solid ${colors.BLACK(0.1)}`,
    boxSizing: "border-box",
  },
  active: {
    background: colors.WHITE(),
    color: colors.BLUE(),
    // borderColor: colors.BLUE()
  },
  image: {
    minHeight: 130,
    height: 130,
    maxHeight: 130,
    width: "100%",
    objectFit: "cover",
    userSelect: "none",
    background: colors.INPUT_BACKGROUND_GREY,
  },
});

export default OnboardHub;
