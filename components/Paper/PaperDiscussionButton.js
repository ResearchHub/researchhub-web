import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

import numeral from "numeral";
import colors from "~/config/themes/colors";
import { PaperDiscussionIcon } from "~/config/themes/icons";

const PaperDiscussionButton = ({ discussionCount, paper }) => {
  const [hover, setHover] = useState(false);

  const getCount = () => {
    return numeral(discussionCount).format("0a");
  };

  return (
    <a
      href={"#discussion"}
      className={css(styles.root)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-tip={"View Discussion"}
    >
      <span className={css(styles.icon)}>
        <PaperDiscussionIcon color={hover && colors.NEW_BLUE()} />
      </span>
      <span
        className={
          css(styles.count, !discussionCount && styles.hide) + " count"
        }
      >
        {getCount()}
      </span>
    </a>
  );
};

const styles = StyleSheet.create({
  root: {
    color: "#AFADB7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    paddingRight: 17,
    paddingTop: 15,
    textDecoration: "unset",
    ":hover .count": {
      color: colors.BLACK(),
    },
    "@media only screen and (min-width: 0px) and (max-width: 767px)": {
      paddingTop: 0,
      paddingRight: 20,
    },
  },
  icon: {
    width: 25,
    height: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  count: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 5,
  },
  hide: {
    display: "none",
  },
});

export default PaperDiscussionButton;
