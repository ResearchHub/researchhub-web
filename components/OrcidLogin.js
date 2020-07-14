import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useStore, useDispatch } from "react-redux";

import { AuthActions } from "../redux/auth";
import API from "~/config/api";
import { orcidMethods } from "~/config/constants";

const LOGIN_ATTEMPT_TIMEOUT = 300000; // 5 minutes
const WATCH_WINDOW_INTERVAL = 500; // 5 ms

const OrcidLogin = (props) => {
  const { clientId, method, onFailure, onSuccess, redirectUri, render } = props;

  const dispatch = useDispatch();

  const store = useStore();

  const [loginWindow, setLoginWindow] = useState(null);

  const [timedOut, setTimedOut] = useState(false);

  const [closed, setClosed] = useState(false);

  const [windowTimeout, setWindowTimeout] = useState(null);

  const [windowClosedInterval, setWindowClosedInterval] = useState(null);

  const [windowDomainInterval, setWindowDomainInterval] = useState(null);

  useEffect(timedOutEffect, [timedOut]);
  function timedOutEffect() {
    if (timedOut && loginWindow) {
      loginWindow.close();
    }
  }

  useEffect(closedEffect, [closed]);
  function closedEffect() {
    if (closed) {
      setLoginWindow(null);
      clearHandlers();
      checkHasEmail();
    }
  }

  useEffect(watchWindowClose, [loginWindow, windowClosedInterval]);
  function watchWindowClose() {
    if (loginWindow && !windowClosedInterval) {
      setWindowClosedInterval(
        setInterval(() => {
          setClosed(loginWindow.closed);
        }, WATCH_WINDOW_INTERVAL)
      );
    }
  }

  useEffect(watchWindowDomain, [loginWindow, windowDomainInterval]);
  function watchWindowDomain() {
    if (loginWindow && !windowDomainInterval) {
      setWindowDomainInterval(
        setInterval(() => {
          try {
            checkLoginComplete(loginWindow.document.body);
            clearTimeout(windowTimeout);
          } catch (e) {}
        }, WATCH_WINDOW_INTERVAL)
      );
    }
  }

  function clearHandlers() {
    clearTimeout(windowTimeout);
    setWindowTimeout(null);
    clearInterval(windowClosedInterval);
    setWindowClosedInterval(null);
    clearInterval(windowDomainInterval);
    setWindowDomainInterval(null);
  }

  function checkLoginComplete(loginWindowBody) {
    const loginComplete = checkBaseUriSuccessParam(loginWindowBody);
    if (loginComplete) {
      loginWindow.close();
    }
  }

  function checkBaseUriSuccessParam(body) {
    const uri = body["baseURI"];
    const regex = RegExp("success");
    return regex.test(uri);
  }

  async function checkHasEmail() {
    await dispatch(AuthActions.getUser());
    const state = store.getState();
    if (state.auth.user.email && state.auth.user.email != "") {
      // TODO: Refactor this and handle all success and failure here too
      if (method === orcidMethods.CONNECT) {
        onSuccess();
      }
    } else {
      dispatch(AuthActions.signout({ walletLink: state.auth.walletLink }));
    }
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
      "toolbar=no, scrollbars=yes, width=650, height=600, top=500, left=500";
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
    if (method === orcidMethods.CONNECT) {
      return (
        "https://orcid.org/oauth/authorize?" +
        "response_type=token" +
        "&redirect_uri=" +
        redirectUri +
        "&client_id=" +
        clientId +
        "&scope=openid" +
        "&nonce=11235"
      );
    }

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
  method: PropTypes.string.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  redirectUri: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
};

export default OrcidLogin;
