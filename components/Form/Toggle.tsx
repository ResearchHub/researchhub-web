import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";
import colors from "~/config/themes/colors";

type ToggleOption = {
  label: string;
  value: any;
}

type Props = {
  options: Array<ToggleOption>;
  onSelect: Function;
  selected: any;
};

export default function Toggle({
  options,
  onSelect,
  selected,
}: Props): ReactElement {

  const optionElems = options.map((opt, index) => (
    <div
      key={`toggle-opt-${index}`}
      className={css(styles.option, selected === opt.value && styles.optionSelected)}
      onClick={() => onSelect(opt)}
    >
      {opt.label}
    </div>
  ));

  return (
    <div className={css(styles.toggle)}>
      {optionElems}
    </div>
  )
}

const styles = StyleSheet.create({
  "toggle": {
    display: "flex",
    background: "#3971FF1A",
    borderRadius: 50,
    padding: 5,
  },
  "option": {
    color: colors.NEW_BLUE(),
    fontWeight: 500,
    borderRadius: 50,
    fontSize: 14,
    padding: "6px 12px",
    cursor: "pointer",
    ":hover": {
      opacity: 0.9
    }
  },
  "optionSelected": {
    background: colors.NEW_BLUE(),
    color: "white",
    transition: "0.1s",
  }
});
