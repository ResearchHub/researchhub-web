import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const ColumnAuthor = (props) => {
  const { name } = props;

  return (
    <div className={css(styles.container)}>
      <span
        className={css(styles.userIcon)}
        style={{
          width: 35,
          height: 35,
          fontSize: 35 + 1,
          border: "3px solid transparent",
        }}
      >
        {icons.user}
      </span>
      <div className={css(styles.name) + " clamp1"}>{name}</div>
    </div>
  );
};

ColumnAuthor.propTypes = {
  name: PropTypes.string,
  // authorProfile: PropTypes.object,
  // reputation: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 15px",
    borderLeft: `3px solid #FFF`,
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  name: {
    color: colors.BLACK(1),
    fontWeight: 500,
    marginLeft: 10,
  },
  userIcon: {
    color: "#aaa",
  },
});

export default ColumnAuthor;
