import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const SectionBounty = (props) => {
  const { section, paper } = props;
  const amount =
    section === "summary"
      ? paper.summary_low_quality || 0
      : paper.bullet_low_quality || 0;

  const renderLabel = () => {
    return (
      <Fragment>
        Earn{" " + amount + " "}
        {icons.coinStack({ styles: styles.coinStackIcon })}
      </Fragment>
    );
  };

  return (
    <div className={css(styles.container, !amount && styles.hidden)}>
      {renderLabel()}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "4px 12px",
    fontSize: 14,
    fontWeight: 500,
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: colors.ORANGE(0.1),
    color: colors.ORANGE(),
    marginLeft: 10,
    cursor: "default",
  },
  hidden: {
    display: "none",
  },
  coinStackIcon: {
    marginLeft: 4,
    height: 12,
    width: 12,
  },
});

export default SectionBounty;
