import React from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import colors from "~/config/themes/colors";

const PaperBanner = ({ icon, message }) => {
  return (
    <div className={css(styles.banner)}>
      <div className={css(styles.icon)}>
        {icon ? icon : <i className="fas fa-exclamation-circle"></i>}
      </div>
      <div className={css(styles.message)}>{message}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  banner: {
    borderRadius: 8,
    padding: 16,
    display: "flex",
    alignItems: "center",
    background: "#F2F2F6",
  },
  message: {
    marginLeft: 16,
    width: "100%",
    lineHeight: 1.8,
    fontSize: 18,
  },
  icon: {
    color: colors.RED(),
    fontSize: "2em",
  },
});

export default PaperBanner;
