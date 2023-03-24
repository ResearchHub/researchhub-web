import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import { ValidCitationType } from "../Hypothesis/Citation/modal/AddNewSourceBodySearch";
import colors from "~/config/themes/colors";

export type TextDropdownOption = {
  label: string;
  optionLabel?: string;
  value: ValidCitationType;
};
export type TextDropdownOptions = TextDropdownOption[];

type Props = {
  level: string;
};

export default function EffortLevel({ level }: Props): ReactElement {
  const effortLevel = {
    casual: 0,
    light: 1,
    medium: 2,
    comprehensive: 3,
  };
  const renderEffortBar = (level) => {
    return [1, 2, 3, 4].map((_, index) => {
      return (
        <div
          style={{
            height: 14 + index * 4,
            background:
              effortLevel[level] >= index
                ? colors.NEW_BLUE(1)
                : colors.NEW_BLUE(0.2),
          }}
          className={css(styles.effortBar)}
        ></div>
      );
    });
  };
  return <div className={css(styles.container)}>{renderEffortBar(level)}</div>;
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-end",
  },
  effortBar: {
    width: 8,
    marginRight: 2,
    borderRadius: 1,
  },
});
