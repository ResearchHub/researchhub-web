import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useMemo, useState } from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

type Props = {
  value?: number;
  onSelect?: Function;
  readOnly?: Boolean;
  overrideStarStyle?: any;
  scoreInputStyleOverride?: any;
};

const MAX_SCORE = 5;
const MIN_SCORE = 1;

export default function StarInput({
  value = MIN_SCORE,
  onSelect,
  readOnly,
  overrideStarStyle = null,
  scoreInputStyleOverride = null,
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

  const starInput = useMemo(() => {
    let remainderWasCalculated = false;
    const bars = Array(MAX_SCORE).fill(null).map((v, index) => {
      const starNumber = index + 1;

      if (readOnly) {
        const isStarSelected = starNumber <= selectedValue;

        return (
          <div className={css(styles.star, styles.readOnly, overrideStarStyle)}>
            {isStarSelected 
              ? <span className={css(styles.starIconFilled)}>{icons.starFilled}</span>
              : <span className={css(styles.starIconUnfilled)}>{icons.starAlt}</span>
            }
          </div>
        )
      }
      else {
        const isStarSelected = starNumber <= selectedValue || starNumber <= hoveredValue;

        return (
          <div
            className={`starRating ${css(styles.star, overrideStarStyle)}`}
            data-rating={index+1}
            onClick={() => handleSelect(starNumber)}
            onMouseEnter={() => setHoveredValue(starNumber)}
            onMouseLeave={() => setHoveredValue(0)}
          >
            {isStarSelected 
              ? <span className={css(styles.starIconFilled)}>{icons.starFilled}</span>
              : <span className={css(styles.starIconUnfilled)}>{icons.starAlt}</span>
            }
          </div>
        )
      }
    });

    return (
      <div className={css(styles.starInput)}>{bars}</div>
    )    
  }, [selectedValue, hoveredValue, readOnly]);

  return (
    <div className={css(styles.scoreInput, scoreInputStyleOverride)}>
      {starInput}
    </div>
  )
}

const styles = StyleSheet.create({
  "scoreInput": {
    display: "flex",
    alignItems: "flex-start",
  },
  "starInput": {
    display: "flex",
  },
  "readOnly": {
    cursor: "initial",
  },
  "star": {
    width: 24,
    height: 16,
    marginRight: 0,
    borderRadius: "1px",
    cursor: "pointer",
    position: "relative",
    color: "#e77600" //colors.DARKER_GREY(),
  },
  "starIconFilled": {
    color: colors.YELLOW(),
  },
  "starIconUnfilled": {
  },  
  "cover": {
    background: colors.NEW_BLUE(),
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
})
