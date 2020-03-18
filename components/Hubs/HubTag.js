import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import colors from "~/config/themes/colors";
import Ripples from "react-ripples";
import { nameToUrl } from "~/config/constants";

const HubTag = ({ tag, overrideStyle, hubName }) => {
  let { id, name, link, last, slug } = tag;
  const nameArr = (name && name.split(" ")) || [];

  if (name === hubName) {
    return (
      <div
        className={css(styles.tag, overrideStyle && overrideStyle)}
        key={`tag-${name}-${Math.random()}`}
      >
        <span className={css(styles.label)}>{name && name}</span>
      </div>
    );
  } else {
    return (
      <Fragment>
        <Ripples>
          <Link href={"/hubs/[hubSlug]"} as={`/hubs/${nameToUrl(slug)}`}>
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
