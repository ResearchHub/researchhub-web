import React, { ReactChildren, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import LargeListItem from "~/components/Form/LargeListItem";

type LargeListProps = {
  selectMany: boolean;
  customListStyle: StyleSheet;
  onChange?: Function;
  children: ReactChildren;
};

export default function LargeList({
  selectMany,
  customListStyle,
  onChange,
  children,
}: LargeListProps) {
  let [isActives, setIsActives] = useState(children.map(() => false));

  const renderListItem = (item, index) => {
    return (
      <LargeListItem
        checkboxSquare={selectMany}
        active={isActives[index]}
        id={`largeListItem-${index}`}
        onChange={(id, value) => {
          // id of LargeListItem/Checkbox, new value
          let changed;
          if (selectMany) {
            changed = [...isActives]; // Do not modify other boxes
          } else {
            changed = isActives.map(() => false); // Set all other boxes to false
          }
          changed[index] = value;
          setIsActives(changed);
          onChange && onChange(isActives, index, value, id); // Send information about the state change
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
