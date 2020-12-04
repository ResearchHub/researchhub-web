import { Fragment, useState, useEffect, useRef } from "react";
import { useStore, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import Ripples from "react-ripples";
import { useAlert } from "react-alert";
import Link from "next/link";
import moment from "moment";

const ContentSupport = (props) => {
  const [count, setCount] = useState(5);

  const renderIcon = () => {
    return count < 2 ? (
      <img className={css(styles.icon)} src={"/static/icons/coin-filled.png"} />
    ) : (
      <img className={css(styles.icon)} src={"/static/icons/coin-stack.png"} />
    );
  };

  return (
    <div className={css(styles.container)}>
      {renderIcon()}
      <span className={css(styles.count)}>{count}</span>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    height: 15,
  },
  count: {
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 5,
  },
});

export default ContentSupport;
