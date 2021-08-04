import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Ripples from "react-ripples";
import PropTypes from "prop-types";

import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const HubCardAsRow = ({ hub, styleVariation, children }) => {
  hub.description = "The science of biology and biotechnology.";

  return (
    <Ripples
      className={css(styles.card, styleVariation && styles[styleVariation])}
      key={`hub-${hub.id}`}
    >
      <div className={css(styles.imgWrapper)}>
        <img
          className={css(styles.img)}
          src={
            hub.hub_image
              ? hub.hub_image
              : "/static/background/twitter-banner.jpg"
          }
          alt={`${hub.name} Hub`}
        ></img>
      </div>
      <div className={css(styles.detailsWrapper)}>
        <div className={css(styles.name)}>{hub.name}</div>
        <div className={css(styles.description)}>{hub.description}</div>
        {children}
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  card: {
    border: `1px solid ${genericCardColors.BORDER}`,
    width: "100%",
    display: "flex",
    padding: 15,
    marginBottom: 10,
    cursor: "pointer",
    background: "white",
    borderRadius: 2,
    ":hover": {
      backgroundColor: genericCardColors.BACKGROUND,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  noBorderVariation: {
    border: 0,
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 0,
    marginTop: 0,
    ":last-child": {
      borderBottom: 0,
    },
  },
  detailsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  name: {
    fontSize: 20,
    color: colors.BLACK(),
    fontWeight: 500,
    marginLeft: 10,
    textTransform: "capitalize",
  },
  description: {
    color: colors.BLACK(0.6),
    fontSize: 16,
    marginLeft: 10,
    lineHeight: "22px",
  },
  link: {
    textDecoration: "none",
    color: colors.BLACK(),
    display: "flex",
    flexDirection: "row",
  },
  imgWrapper: {
    height: 80,
    width: 80,
    marginRight: 5,
  },
  img: {
    borderRadius: "4px",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

HubCardAsRow.propTypes = {
  hub: PropTypes.object.isRequired,
  styleVariation: PropTypes.string,
};

export default HubCardAsRow;
