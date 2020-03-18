import React, { useState, useEffect } from "react";

// TODO: Add reconnect interval

const GOING_AWAY = 1001;

export default function withWebSocket(Component, url, autoReconnect = true) {
  return (props) => {
    const [ws, setWs] = useState(null);
    const [connected, setConnected] = useState(false);
    const [response, setResponse] = useState(null);

    useEffect(configureWebSocket, []);
    function configureWebSocket() {
      const webSocket = new WebSocket(url);
      setWs(webSocket);
    }

    useEffect(startingListening, [ws]);
    function startingListening() {
      if (ws) {
        ws.readyState !== WebSocket.CLOSED && listen();
      }
    }

    useEffect(unmount, [ws]);
    function unmount() {
      return () => {
        autoReconnect = false;
        if (ws) {
          try {
            ws.close(GOING_AWAY, "Unmounting");
          } catch (error) {
            ws.close();
          }
        }
      };
    }

    function listen() {
      ws.onopen = () => {
        console.info(`Connected to websocket at ${url}`);
        setConnected(true);
      };

      ws.onmessage = (e) => {
        setResponse(e.data);
      };

      ws.onclose = () => {
        setConnected(false);
        console.warn(`Disconnected from websocket at ${url}`);
        autoReconnect && reconnect();
      };
    }

    function reconnect() {
      if (!ws || ws.readyState === WebSocket.CLOSED) {
        console.warn(`Attempting to reconnect to websocket at ${url}`);
        configureWebSocket();
      }
    }

    function send(message) {
      const data = {
        message,
      };

      try {
        return ws.send(JSON.stringify(data));
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
