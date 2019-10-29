import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import colors from "~/config/themes/colors";

const HubTag = ({ tag, overrideStyle, hubName }) => {
  let { id, name, link } = tag;
  const nameArr = name.split(" ");

  function nameToUrl(name) {
    return nameArr.length > 1
      ? nameArr.join("-").toLowerCase()
      : name.toLowerCase();
  }

  function abbreviateName(name) {
    if (nameArr.length > 1) {
      return `${nameArr[0][0]}.${nameArr[1][0]}`;
    }
    if (nameArr[0].length > 10) {
      return `${nameArr[0].slice(0, 7)}...`;
    }
    return name;
  }

  function formatName(name) {
    return nameArr
      .map((el) => {
        return el[0].toUpperCase() + el.slice(1);
      })
      .join(" ");
  }

  if (name === hubName) {
    return (
      <div
        className={css(styles.tag, overrideStyle && overrideStyle)}
        data-tip={formatName(name)}
      >
        <ReactTooltip
          effect={"float"}
          type={"info"}
          place={"bottom"}
          className={css(styles.reactTooltip)}
        />
        <span className={css(styles.label)}>
          {name && abbreviateName(name)}
        </span>
      </div>
    );
  } else {
    return (
      <Link href={"/hub/[hubname]"} as={`/hub/${nameToUrl(name)}`}>
        <div
          className={css(styles.tag, overrideStyle && overrideStyle)}
          data-tip={formatName(name)}
        >
          <ReactTooltip
            effect={"float"}
            type={"info"}
            place={"bottom"}
            className={css(styles.reactTooltip)}
          />
          <span className={css(styles.label)}>
            {name && abbreviateName(name)}
          </span>
        </div>
      </Link>
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
    marginRight: 10,
    border: "1px solid #FFF",
    textOverflow: "ellipsis",
    overflow: "hidden",
    ":hover": {
      color: "#FFF",
      borderColor: colors.BLUE(1),
    },
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
    textOverflow: "ellipsis",
  },
  reactTooltip: {
    // padding: 0
  },
});

export default HubTag;
