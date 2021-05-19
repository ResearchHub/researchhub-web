import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import CheckBox from "~/components/Form/CheckBox";

export default function LargeListItem({
  checkboxSquare,
  active,
  id,
  onChange,
  children,
}) {
  return (
    <div className={css(styles.largeListItem)}>
      <div className={css(styles.checkboxAligner)}>
        <CheckBox
          isSquare={checkboxSquare}
          active={active}
          id={id}
          onChange={onChange}
        />
      </div>
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  largeListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "stretch",
    borderRadius: "4px",
    backgroundColor: "#FAFAFA",
    border: "1.5px solid #F0F0F0",
    margin: "5px 0px",
    padding: "20px",
  },
  checkboxAligner: {
    display: "flex",
    alignSelf: "stretch",
    paddingRight: "20px",
  },
  contentAligner: {
    display: "flex",
    alignSelf: "flex-grow",
  },
});
