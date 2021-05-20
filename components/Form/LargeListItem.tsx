import React, { ReactChildren, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import CheckBox from "~/components/Form/CheckBox";

type LargeListItemProps = {
  checkboxSquare: boolean;
  isActive: boolean;
  useLargeHitbox?: boolean;
  id?: string;
  onChange?: Function;
  children: ReactChildren;
};

export default function LargeListItem({
  checkboxSquare,
  isActive,
  useLargeHitbox,
  id,
  onChange,
  children,
}: LargeListItemProps) {
  let handleClick;
  if (useLargeHitbox) {
    handleClick = (e) => {
      let state = !isActive;
      onChange && onChange(id, state);
    };
  } else {
    /** LargeListItem doesn't handle the click, but rather CheckBox */

    handleClick = (e) => {};
  }

  return (
    <div
      className={css(styles.largeListItem, useLargeHitbox && styles.clickable)}
      onClick={handleClick}
    >
      <div className={css(styles.checkboxAligner)}>
        <CheckBox
          isSquare={checkboxSquare}
          active={isActive}
          id={id}
          onChange={!useLargeHitbox && onChange} // If not using large hitbox, checkbox handles click
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
  clickable: {
    cursor: "pointer",
    userSelect: "none",
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
