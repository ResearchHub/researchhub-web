import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import colors from "~/config/themes/colors";
import Ripples from "react-ripples";
import { nameToUrl } from "~/config/constants";
import "~/components/Paper/CitationCard.css";

const HubTag = ({
  tag,
  overrideStyle,
  hubName,
  gray,
  labelStyle,
  last,
  removeLink,
}) => {
  let { id, name, link, slug } = tag;
  const nameArr = (name && name.split(" ")) || [];

  if (name === hubName || removeLink) {
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
          <Link href={"/hubs/[slug]"} as={`/hubs/${nameToUrl(slug)}`}>
            <a className={css(styles.atag)}>
              <div
                className={css(
                  styles.tag,
                  gray && styles.grayTag,
                  overrideStyle && overrideStyle
                )}
              >
                <span
                  className={
                    css(
                      styles.label,
                      gray && styles.grayLabel,
                      labelStyle && labelStyle
                    ) + " clamp1"
                  }
                >
                  {name && name}
                </span>
              </div>
            </a>
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

    "@media only screen and (max-width: 767px)": {
      height: 15,
    },
  },
  space: {
    width: 10,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: colors.BLUE(1),
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    padding: "3px 10px 3px 10px",
    "@media only screen and (max-width: 767px)": {
      fontSize: 8,
      padding: "1px 5px",
    },
  },
  grayTag: {
    backgroundColor: "rgba(36, 31, 58, 0.03)",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    boxSizing: "border-box",
    ":hover": {
      backgroundColor: "#EDEDF0",
      borderColor: "#d8d8de",
    },
  },
  grayLabel: {
    color: "#241F3A",
    opacity: 0.8,
  },
  atag: {
    color: "unset",
    textDecoration: "unset",
  },
});

export default HubTag;
