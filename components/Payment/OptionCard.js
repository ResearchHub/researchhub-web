import React, { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Ripples from "react-ripples";

// Component

// Config
import colors, { formColors } from "~/config/themes/colors";
import { column, row } from "~/config/themes/styles";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const OptionCard = (props) => {
  const { active, onClick, label, payment, sublabel, index } = props;
  const [selected, setSelected] = useState(active);

  useEffect(() => {
    setSelected(active);
  }, [props.active]);

  function handleClick(e) {
    onClick && onClick(index);
  }

  return (
    <Ripples
      className={css(styles.root, selected && styles.activeRoot)}
      onClick={handleClick}
    >
      <div
        className={css(
          styles.selectInput,
          selected && styles.activeSelectInput
        )}
      ></div>
      <div className={css(styles.container)}>
        <div className={css(styles.label)}>{label && label}</div>
        <div className={css(styles.sublabel)}>{sublabel && sublabel}</div>
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  root: {
    ...row({ justifyContent: "flex-start" }),
    width: "100%",
    backgroundColor: formColors.BACKGROUND,
    border: "2px solid",
    borderColor: formColors.BORDER,
    cursor: "pointer",
    height: 78,
    borderRadius: 4,
    userSelect: "none",
    ":hover": {
      borderColor: "#3971FF",
    },
  },
  container: {
    width: "100%",
  },
  selectInput: {
    minHeight: 26,
    height: 26,
    width: 26,
    borderRadius: "50%",
    border: "1px solid",
    borderColor: formColors.BORDER,
    background: "#FFF",
    margin: "0px 15px",
    flexShrink: 0,
  },
  activeRoot: {
    borderColor: "#3971FF",
  },
  activeSelectInput: {
    marginRight: 17,
    boxSizing: "border-box",
    border: `6px solid #3971FF`,
  },
});

export default OptionCard;
