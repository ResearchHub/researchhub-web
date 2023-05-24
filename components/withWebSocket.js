import { useState, useEffect, useRef } from "react";
import { AUTH_TOKEN } from "~/config/constants";
import { localWarn } from "~/config/utils/nullchecks";
import Cookies from "js-cookie";

const ALLOWED_ORIGINS = [
  "localhost",
  "localhost:8000",
  "ws://localhost:8000",
  "ws://localhost:8000/",
  "staging-ws.researchhub.com",
  "wss://staging-ws.researchhub.com",
  "researchhub.com",
  "ws.researchhub.com",
  "wss://ws.researchhub.com",
];

const CLOSE_CODES = {
  GOING_AWAY: 1001,
  POLICY_VIOLATION: 1008,
};

/**
 * Returns a wrapped `Component` injected with websocket props.
 *
 * The browser can only connect to a given `url` once at a time. If it is
 * already connected, subsequent connection attempts will fail.
 *
 * @param {React.Component} Component
 * @param {string} _url
 * @param {boolean} autoReconnect
 * @returns {React.Component}
 *
 */
export default function withWebSocket(
  Component,
  _url = "",
  autoReconnect = true
) {
  return (props) => {
    const url = props.wsUrl || _url;
    const urlRef = useRef(null);
    const connectAttemptLimit = props.wsConnectAttemptLimit || 5;

    const [ws, setWs] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connectAttempts, setConnectAttempts] = useState(0);
    const [response, setResponse] = useState(null);
    const [stopped, setStopped] = useState(false);

    useEffect(() => {
      if (url) configureWebSocket();
    }, [url, connected]);
    useEffect(startingListening, [ws]);
    useEffect(stopConnectAttempts, [connectAttempts]);

    function configureWebSocket() {
      let token = null;
      if (props.wsAuth) {
        try {
          token = Cookies.get(AUTH_TOKEN);
        } catch (err) {
          console.error("Did not find auth token");
          return err;
        }
        const webSocket = new WebSocket(url, ["Token", token]);
        setWs(webSocket);
      } else {
        const webSocket = new WebSocket(url);
        setWs(webSocket);
      }
      urlRef.current = url;
      setConnectAttempts(connectAttempts + 1);
    }

    function stopConnectAttempts() {
      if (connectAttempts >= connectAttemptLimit) {
        setStopped(true);
        stopListening(
          CLOSE_CODES.GOING_AWAY,
          "Exceeded connection attempt limit"
        );
      }
    }

    function startingListening() {
      if (ws && !stopped && ws.readyState !== WebSocket.CLOSED) {
        listen();
      }
      if (ws?.readyState === WebSocket.CLOSED) {
        return stopListening(CLOSE_CODES.GOING_AWAY, "WS is closed");
      }
    }

    function listen() {
      ws.onopen = () => {
        console.info(`Connected to websocket at ${url}`);
        setConnected(true);
      };

      ws.onmessage = (e) => {
        const origin = new URL(e.origin);
        const isAllowed = ALLOWED_ORIGINS.some((value, i) => {
          return value === origin.hostname;
        });

        if (isAllowed) {
          setResponse(e.data);
        } else {
          stopListening(CLOSE_CODES.POLICY_VIOLATION, "Host not allowed");
        }
      };

      ws.onclose = () => {
        setConnected(false);
        localWarn(`Disconnected from websocket at ${url}`);
        autoReconnect && reconnect();
      };
    }

    function reconnect() {
      if (!ws || ws.readyState === WebSocket.CLOSED) {
        localWarn(`Attempting to reconnect to websocket at ${url}`);
        configureWebSocket();
      }
    }

    function stopListening(code = null, reason = null) {
      if (ws) {
        code = code || CLOSE_CODES.GOING_AWAY;
        reason = reason || "Unmounting";
        ws.onclose = () => {
          localWarn(`Closing websocket connection at ${url}: ${reason}`);
        };
        try {
          // Params are not supported by some verisons of Firefox
          // See https://bugzilla.mozilla.org/show_bug.cgi?id=674716
          ws.close(code, reason);
        } catch (error) {
          ws.close();
        }
      }
    }

    function send(data) {
      try {
        return ws.send(JSON.stringify({ ...data }));
      } catch (err) {
        return err;
      }
    }

    return (
      <Component
        {...props}
        wsConnected={connected}
        wsResponse={response}
        wsSend={send}
      />
    );
  };
}
