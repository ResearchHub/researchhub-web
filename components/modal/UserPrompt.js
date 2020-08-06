import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { useSpring, animated as a } from "react-spring";
import colors from "~/config/themes/colors";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const TIMEOUT = 60000; // 1 minute in ms

const UserPrompt = (props) => {
  let { paper } = props;
  const [showPrompt, displayShowPrompt] = useState(false);
  const [hoverUp, setHoverUp] = useState(false);
  const [hoverDown, setHoverDown] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const animationProps = useSpring({
    bottom: showPrompt ? 20 : -300,
  });

  useEffect(() => {
    setTimeout(() => {
      displayShowPrompt(true);
      setStartTime(performance.now());
    }, TIMEOUT);
  }, [paper]);

  const sendEvent = (value) => {
    let delay = performance.now() - startTime;
    delay = Math.ceil(delay * 100) / 100;

    let payload = {
      category: "Paper",
      action: "Rate",
      label: `Thumbs ${value}`,
      value: Number(delay),
      utc: new Date(),
    };

    // send first event
    fetch(API.GOOGLE_ANALYTICS({ manual: true }), API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        displayShowPrompt(false);
      })
      .catch((err) => {
        displayShowPrompt(false);
      });
  };

  const renderContent = () => {
    return (
      <Fragment>
        <div className={css(styles.header)}>
          Did you find this paper helpful?
        </div>
        <div className={css(styles.buttonRow)}>
          <div
            className={css(styles.thumbsUp)}
            onClick={() => sendEvent("up")}
            onMouseEnter={() => setHoverUp(true)}
            onMouseLeave={() => setHoverUp(false)}
          >
            {hoverUp ? (
              <i className="fas fa-thumbs-up" />
            ) : (
              <i className="fad fa-thumbs-up" />
            )}
          </div>
          <div
            className={css(styles.thumbsDown)}
            onClick={() => sendEvent("down")}
            onMouseEnter={() => setHoverDown(true)}
            onMouseLeave={() => setHoverDown(false)}
          >
            {hoverDown ? (
              <i className="fas fa-thumbs-down" />
            ) : (
              <i className="fad fa-thumbs-down" />
            )}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <a.div className={css(styles.promptContainer)} style={animationProps}>
      <div
        className={css(styles.closeButton)}
        onClick={() => displayShowPrompt(false)}
      >
        <i className="fal fa-times" />
      </div>
      {renderContent()}
    </a.div>
  );
};

const styles = StyleSheet.create({
  promptContainer: {
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    borderRadius: 8,
    position: "fixed",
    right: 20,
    padding: 20,
    background: "#FFF",
    zIndex: 5,
  },
  header: {
    marginBottom: 15,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbsUp: {
    color: colors.GREEN(),
    marginRight: 15,
    fontSize: 20,
    cursor: "pointer",
    padding: 5,
    ":hover": {
      opacity: 0.7,
    },
  },
  thumbsDown: {
    color: colors.RED(),
    transform: "scaleX(-1)",
    marginLeft: 15,
    fontSize: 20,
    cursor: "pointer",
    padding: 5,
    ":hover": {
      opacity: 0.7,
    },
  },
  closeButton: {
    position: "absolute",
    top: -35,
    right: -2,
    borderRadius: "50%",
    height: 25,
    width: 25,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFF",
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
    ":hover": {
      boxShadow: "0 0 24px rgba(0, 0, 0, 0.34)",
    },
  },
});

export default UserPrompt;
