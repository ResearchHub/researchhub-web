import { nameToUrl } from "~/config/constants";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import LazyLoad from "react-lazyload";
import Link from "next/link";
import { Fragment, useState } from "react";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";
import { breakpoints } from "~/config/themes/screen";

const HubTag = (props) => {
  const { tag, overrideStyle, hubName, gray, labelStyle, last, noHubName } =
    props;
  const { id, name, hub_image, link, slug } = tag;
  const nameArr = (name && name.split(" ")) || [];
  const [hubImage, setHubImage] = useState(
    hub_image ? hub_image : "/static/background/hub-placeholder.svg"
  );

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
          <Link href={"/hubs/[slug]"} as={`/hubs/${nameToUrl(slug)}`}>
            <a className={css(styles.atag)}>
              <div
                className={css(
                  styles.tag,
                  gray && styles.grayTag,
                  overrideStyle && overrideStyle
                )}
              >
                {noHubName ? <ReactTooltip /> : null}
                <LazyLoad offset={100} once>
                  <img
                    className={css(styles.hubImage) + " hubImage"}
                    src={hubImage}
                    onError={() => {
                      setHubImage("/static/background/hub-placeholder.svg");
                    }}
                    alt={name}
                    data-tip={noHubName ? name : null}
                  />
                </LazyLoad>
                {noHubName ? null : (
                  <span
                    className={
                      css(
                        styles.label,
                        gray && styles.grayLabel,
                        labelStyle && labelStyle
                      ) + " hubLabel"
                    }
                  >
                    {name && name}
                  </span>
                )}
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
    borderRadius: 3,
    padding: "5px 8px",
    cursor: "pointer",
    textTransform: "capitalize",
    fontSize: 14,
    color: colors.BLACK(0.8),
    fontWeight: 500,
    ":hover": {
      color: colors.BLUE(1),
      backgroundColor: colors.LIGHTER_BLUE(),
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
      padding: "3px 6px",
      height: "unset",
    },
  },
  label: {
    cursor: "pointer",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginLeft: 6,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      maxWidth: 125,
    },
  },
  hubImage: {
    height: 22,
    width: 22,
    objectFit: "cover",
    borderRadius: 3,
    dropShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
    opacity: 1,
    bordder: "1px solid #EDEDED",
    "@media only screen and (max-width: 767px)": {
      height: 18,
      width: 18,
      minWidth: 18,
      minHeight: 18,
      marginRight: 5,
    },
    "@media only screen and (max-width: 415px)": {
      height: 15,
      width: 15,
      minWidth: 15,
      minHeight: 15,
      marginRight: 4,
    },
  },
  grayTag: {
    backgroundColor: "rgba(36, 31, 58, 0.03)",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    boxSizing: "border-box",
    ":hover": {
      backgroundColor: colors.LIGHTER_BLUE(),
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
