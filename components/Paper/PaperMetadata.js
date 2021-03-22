import React from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

// Utility
import colors from "~/config/themes/colors";

const PaperMetadata = (props) => {
  const { active, centered, label, value, containerStyles } = props;
  return (
    <div
      className={
        css(
          styles.container,
          centered && styles.centered,
          containerStyles && containerStyles,
          (!active || !value) && styles.hidden
        ) + " clamp1"
      }
    >
      <div className={css(styles.labelContainer)}>
        <p className={css(styles.label)}>{`${label && label}:`}</p>
      </div>
      <span className={css(styles.metadata)}>{value && value}</span>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
    margin: "5px 0",
    "@media only screen and (max-width: 768px)": {
      width: "100%",
      boxSizing: "border-box",
    },
  },
  centered: {
    alignItems: "center",
  },
  labelContainer: {
    display: "flex",
    justifyContent: "flex-start",
    marginRight: 15,
    "@media only screen and (max-width: 768px)": {
      width: 90,
      minWidth: 90,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.BLACK(),
    margin: 0,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  metadata: {
    fontSize: 16,
    color: colors.BLACK(0.7),
    display: "flex",
    alignItems: "center",
    lineHeight: 1.3,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  hidden: {
    display: "none",
  },
});

PaperMetadata.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node || PropTypes.string,
  attribute: PropTypes.bool.isRequired,
};

export default PaperMetadata;
