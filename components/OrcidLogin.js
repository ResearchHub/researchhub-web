import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const LOGIN_ATTEMPT_TIMEOUT = 300000; // 5 minutes
const WATCH_WINDOW_INTERVAL =    500; // 5 ms

const OrcidLogin = (props) => {
  const { clientId, onFailure, onSuccess, redirectUri, render } = props;

  const [loginWindow, setLoginWindow] = useState(null);

  const [timedOut, setTimedOut] = useState(false);

  const [closed, setClosed] = useState(false);

  const [windowTimeout, setWindowTimeout] = useState(null);

  const [windowClosedInterval, setWindowClosedInterval] = useState(null);

  useEffect(timedOutEffect, [timedOut]);
  function timedOutEffect() {
    if (timedOut && loginWindow) {
      // console.log('timedOut');
      loginWindow.close();
    }
  }

  useEffect(closedEffect, [closed]);
  function closedEffect() {
    if (closed) {
      // console.log('closed');
      setLoginWindow(null);
      clearHandlers();
      checkLogin();
    }
  }

  useEffect(watchWindowClose, [loginWindow]);
  function watchWindowClose() {
    if (loginWindow) {
      setWindowClosedInterval(
        setInterval(() => {
          // console.log('watchWindowClosedInterval');
          setClosed(loginWindow.closed);
        }, WATCH_WINDOW_INTERVAL)
      );
    }
  }

  function clearHandlers() {
    clearTimeout(windowTimeout);
    clearInterval(windowClosedInterval);
  }

  function checkLogin() {
    console.log("checkLogin");
    // if (true) {
    //   onSuccess();
    // } else {
    //   onFailure();
    // }
  }

  const renderProps = {
    onClick: onClick,
    disbled: false,
  };

  function onClick() {
    openWindow();
    closeWindowOnTimeout();
  }

  function openWindow() {
    const url = buildOrcidUrl();
    const windowStyle =
      "toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500";
    setLoginWindow(window.open(url, "_blank", windowStyle));
  }

  function closeWindowOnTimeout() {
    setWindowTimeout(
      setTimeout(() => {
        setTimedOut(true);
      }, LOGIN_ATTEMPT_TIMEOUT)
    );
  }

  function buildOrcidUrl() {
    return (
      "https://orcid.org/oauth/authorize?client_id=" +
      clientId +
      "&response_type=code" +
      "&scope=/authenticate" +
      "&redirect_uri=" +
      redirectUri
    );
  }

  return render(renderProps);
};

OrcidLogin.propTypes = {
  clientId: PropTypes.string.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  redirectUri: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default OrcidLogin;
