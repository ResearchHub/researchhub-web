import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const HubCardAsRow = ({ hub, styleVariation, children }) => {
  const router = useRouter();

  const goToHub = (hub) => {
    router.push("/hubs/[slug]", `/hubs/${encodeURIComponent(hub.slug)}`);
  };

  return (
    <Ripples
      className={css(styles.card, styleVariation && styles[styleVariation])}
      key={`hub-${hub.id}`}
      onClick={() => goToHub(hub)}
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
    boxSizing: "border-box",
    borderRadius: 2,
    ":hover": {
      backgroundColor: genericCardColors.BACKGROUND,
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
    marginLeft: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  name: {
    marginBottom: 8,
    fontSize: 20,
    color: colors.BLACK(),
    fontWeight: 500,
    textTransform: "capitalize",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
    },
  },
  description: {
    marginBottom: 8,
    color: colors.BLACK(0.6),
    fontSize: 16,
    lineHeight: "22px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
    },
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: 40,
      width: 40,
    },
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
