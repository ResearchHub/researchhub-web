import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";

type ToggleOption = {
  label: string;
  value: any;
  selected: any;
}

type Props = {
  options: Array<ToggleOption>;
  onSelect: Function;
  selected: any;
};

function Toggle({
  options,
  onSelect,
  selected,
}: Props): ReactElement {

  const handleSelect = (opt:ToggleOption) => {
    onSelect(opt);
  }

  const optionElems = options.map((opt) => (
    <div
      className={css(styles.option, selected === opt.value && styles.optionSelected)}
      onClick={() => handleSelect(opt)}
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
    color: "#3971FF",
    fontWeight: 500,
    borderRadius: 50,
    fontSize: 14,
    padding: "6px 12px",
    cursor: "pointer",
    transition: "0.2s",
  },
  "optionSelected": {
    background: "#3971FF",
    color: "white",
    transition: "0.2s",
  }
});

export default Toggle;