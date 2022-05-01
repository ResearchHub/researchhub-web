import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

// Utility
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

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
    alignItems: "center",
    marginBottom: "8px",
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
    minWidth: 75,
    "@media only screen and (max-width: 1023px)": {
      minWidth: 80, // Align items when the screen is small and each PaperMetadata is on a new line
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minWidth: "auto",
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: "nowrap",
    color: colors.BLACK(0.6),
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
    lineHeight: 1.0,
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
};

export default PaperMetadata;
