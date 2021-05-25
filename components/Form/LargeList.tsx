import React, { ReactChildren, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import LargeListItem from "~/components/Form/LargeListItem";

type LargeListProps = {
  selectMany: boolean;
  useLargeHitbox: boolean;
  customListStyle: StyleSheet;
  defaults?: number[];
  onChange?: Function;
  children: ReactChildren;
};

export default function LargeList({
  selectMany, // Allow selection of many items
  useLargeHitbox,
  customListStyle,
  defaults,
  onChange,
  children,
}: LargeListProps) {
  let defaultState = children.map(() => false);
  defaults &&
    defaults.forEach &&
    defaults.forEach((index) => {
      defaultState[index] = true;
    });
  let [isActives, setIsActives] = useState(defaultState);

  const renderListItem = (item, index) => {
    return (
      <LargeListItem
        checkboxSquare={selectMany}
        useLargeHitbox={useLargeHitbox}
        isActive={isActives[index]}
        id={`largeListItem-${index}`}
        onChange={(id, value) => {
          // id of LargeListItem/Checkbox, new value
          let changed;
          if (selectMany) {
            changed = [...isActives]; // Do not modify other boxes
          } else {
            changed = isActives.map(() => false); // Set all other boxes to false
          }
          if (!selectMany && !value) {
            // If only 1 selected item allowed, don't allow direct deselection.
            // User must deselect by selecting a different item.
            changed[index] = true;
          } else {
            changed[index] = value;
          }

          setIsActives(changed);
          onChange && onChange({ isActives, index, value, id }); // Send information about the state change
        }}
      >
        {item}
      </LargeListItem>
    );
  };

  const wrappedChildren = children.map(renderListItem);
  return (
    <div className={css(styles.largeList, customListStyle)}>
      {wrappedChildren}
    </div>
  );
}

const styles = StyleSheet.create({
  largeList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
