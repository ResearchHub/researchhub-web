import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

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
        {subscribed ? icons.check : icons.plus}
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
    border: "1px solid #EDEDED",
    borderRadius: 3,
    background: "#FFFFFF",
    boxSizing: "border-box",
    cursor: "pointer",
    ":hover": {
      border: "1px solid #C4C4C4",
      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    },
  },
  subscribed: {
    border: "1px solid #C4C4C4",
    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
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
    color: "#241F3A",
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
    background: "rgba(36, 31, 58, 0.03)",
    color: "rgba(36, 31, 58, 0.5)",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    boxSizing: "border-box",
  },
  active: {
    background: "#FFFFFF",
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
    background: "#FAFAFA",
  },
});

export default OnboardHub;
