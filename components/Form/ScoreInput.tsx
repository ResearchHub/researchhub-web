import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";

type Props = {
    value?: number;
    onSelect?: Function;  
    readOnly?: Boolean;
};

const MAX_SCORE = 10;
const MIN_SCORE = 1;

function ScoreInput({
  value = MIN_SCORE,
  onSelect,
  readOnly,
}: Props): ReactElement {

  const [selectedValue, setSelectedValue] = useState<number>(value);
  const [hoveredValue, setHoveredValue] = useState<number>(0);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSelect && onSelect(value);
  }

  const buildBarInput = () => {
    const bars = Array(MAX_SCORE).fill(null).map((v, index) => {
      const barNumber = index+1;
      const isBarSelected =  barNumber <= selectedValue || barNumber <= hoveredValue;

      if (readOnly) {
        return (
          <div className={css(styles.bar, styles.readOnly)}>
            <div className={css(styles.barFill, isBarSelected && styles.selectedBar)}></div>
          </div>
        )
      }
      else {
        return (
          <div
            className={css(styles.bar)}
            onClick={() => handleSelect(barNumber)}
            onMouseEnter={() => setHoveredValue(barNumber)}
            onMouseLeave={() => setHoveredValue(0)}
          >
            <div className={css(styles.barFill, isBarSelected && styles.selectedBar)}></div>
          </div>
        )
      }

    });

    return (
      <div className={css(styles.barInput)}>{bars}</div>
    )
  }

  const barInput = buildBarInput();
  return (
    <div className={css(styles.scoreInput)}>
        {barInput}
        {Boolean(selectedValue) && 
          <div className={css(styles.scoreText)}>{selectedValue}/{MAX_SCORE}</div>
        }
    </div>
  )
}

const styles = StyleSheet.create({
  "scoreInput": {
    display: "flex",
    alignItems: "flex-end",
  },
  "barInput": {
    display: "flex",
  },
  "bar": {
    width: 24,
    height: 16,
    paddingRight: 2,
    borderRadius: "1px",
    cursor: "pointer",
  },
  "barFill": {
    background: "#3971FF1A",
    height: "100%",
  },
  "selectedBar": {
    background: "#3971FF",
    transition: "0.2s",
  },
  "scoreText": {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 400,
  },
  "readOnly": {
    cursor: "initial",
  }
})

export default ScoreInput;