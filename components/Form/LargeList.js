import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";

import CheckBox from "~/components/Form/CheckBox";

const LargeList = ({ selectMany, items = [], onChange }) => {
  let [actives, setActives] = useState(items.map(() => false));

  const renderListItem = (item, index) => {
    return (
      <LargeListItem
        checkboxSquare={selectMany}
        active={actives[index]}
        id={`item-${index}`}
        onChange={(id, value) => {
          // id of LargeListItem/Checkbox, new value
          let changed;
          if (selectMany) {
            changed = [...actives]; // Do not modify other boxes
          } else {
            changed = actives.map(() => false); // Set all other boxes to false
          }
          changed[index] = value;
          setActives(changed);
          onChange && onChange(actives, index, value); // Send information about the state change
        }}
      >
        {item}
      </LargeListItem>
    );
  };

  return (
    <div className={css(styles.largeList)}>{items.map(renderListItem)}</div>
  );
};

const LargeListItem = ({ checkboxSquare, active, id, onChange, children }) => {
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
};

const styles = StyleSheet.create({
  largeList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: "31px",
  },
  largeListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "480px", // TODO: let programmer set height, width
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

export default LargeList;
export { LargeListItem };
