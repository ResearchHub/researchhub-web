import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useMemo, useState } from "react";
import colors from "~/config/themes/colors";

type Props = {
  value?: number;
  onSelect?: Function;
  readOnly?: Boolean;
  overrideBarStyle?: any;
  scoreInputStyleOverride?: any;
  withText?: Boolean;
};

const MAX_SCORE = 10;
const MIN_SCORE = 1;

export default function ScoreInput({
  value = MIN_SCORE,
  onSelect,
  readOnly,
  overrideBarStyle = null,
  scoreInputStyleOverride = null,
  withText = true,
}: Props): ReactElement {

  const [selectedValue, setSelectedValue] = useState<number>(value);
  const [hoveredValue, setHoveredValue] = useState<number>(0);

  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value])

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSelect && onSelect(value);
  }

  const barInput = useMemo(() => {
    let remainderWasCalculated = false;
    const bars = Array(MAX_SCORE).fill(null).map((v, index) => {
      const barNumber = index + 1;

      if (readOnly) {
        const quotient = Math.floor(selectedValue / barNumber);
        let coverPercentage = 0;

        if (quotient > 0) {
          coverPercentage = 100;
        }
        else if (quotient === 0 && !remainderWasCalculated) {
          coverPercentage = (selectedValue % 1) * 100;
          remainderWasCalculated = true;
        }
        return (
          <div className={css(styles.bar, styles.readOnly, overrideBarStyle)} key={`star-${index}`}>
            <div className={css(styles.cover)} style={{ "width": `${coverPercentage}%` }}></div>
            <div className={css(styles.barFill)}></div>
          </div>
        )
      }
      else {
        const isBarSelected = barNumber <= selectedValue || barNumber <= hoveredValue;

        return (
          <div
            className={css(styles.bar, overrideBarStyle)}
            onClick={() => handleSelect(barNumber)}
            onMouseEnter={() => setHoveredValue(barNumber)}
            onMouseLeave={() => setHoveredValue(0)}
            key={`star-${index}`}
          >
            <div className={css(styles.cover)} style={{ "width": `${isBarSelected ? 100 : 0}%` }}></div>
            <div className={css(styles.barFill, isBarSelected && styles.selectedBar)}></div>
          </div>
        )
      }
    });

    return (
      <div className={css(styles.barInput)}>{bars}</div>
    )    
  }, [selectedValue, hoveredValue, readOnly, withText]);

  return (
    <div className={css(styles.scoreInput, scoreInputStyleOverride)}>
      {barInput}
      {Boolean(selectedValue) && withText &&
        <div className={css(styles.scoreText)}>
          <span className={css(styles.selectedScoreText)}>{selectedValue}</span>/{MAX_SCORE}
        </div>
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
    marginRight: 2,
    borderRadius: "1px",
    cursor: "pointer",
    position: "relative",
  },
  "barFill": {
    background: "#3971FF1A",
    height: "100%",
  },
  "cover": {
    background: colors.NEW_BLUE(),
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
  "selectedBar": {
    background: colors.NEW_BLUE(),
    transition: "0.2s",
  },
  "scoreText": {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 400,
  },
  "selectedScoreText": {
    color: colors.NEW_BLUE(),
    fontSize: 18,
    fontWeight: 500,
    lineHeight: "14px",
    marginRight: 3,
  },
  "readOnly": {
    cursor: "initial",
  }
})
