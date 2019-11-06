import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import colors from "~/config/themes/colors";
import Ripples from "react-ripples";

const HubTag = ({ tag, overrideStyle, hubName }) => {
  let { id, name, link, last } = tag;
  const nameArr = name.split(" ");

  function nameToUrl(name) {
    return nameArr.length > 1
      ? nameArr.join("-").toLowerCase()
      : name.toLowerCase();
  }

  if (name === hubName) {
    return (
      <div className={css(styles.tag, overrideStyle && overrideStyle)}>
        <span className={css(styles.label)}>{name && name}</span>
      </div>
    );
  } else {
    return (
      <Fragment>
        <Ripples>
          <Link href={"/hubs/[hubname]"} as={`/hubs/${nameToUrl(name)}`}>
            <div className={css(styles.tag, overrideStyle && overrideStyle)}>
              <span className={css(styles.label)}>{name && name}</span>
            </div>
          </Link>
        </Ripples>
        {!last && <div className={css(styles.space)} />}
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  tag: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edeefe",
    height: 21,
    borderRadius: 3,
    cursor: "pointer",
    border: "1px solid #FFF",
    ":hover": {
      color: "#FFF",
      borderColor: colors.BLUE(1),
    },
  },
  space: {
    width: 10,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: colors.BLUE(1),
    height: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    padding: "3px 10px 3px 10px",
  },
});

export default HubTag;
