import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { faStar as faStarEmpty } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useMemo, useState } from "react";
import colors from "~/config/themes/colors";

type Props = {
  value?: number;
  onSelect?: Function;
  readOnly?: boolean;
  overrideStarStyle?: any;
  scoreInputStyleOverride?: any;
  size?: string;
  withLabel?: boolean;
};

const MAX_SCORE = 5;
const MIN_SCORE = 1;

export default function StarInput({
  value = MIN_SCORE,
  onSelect,
  readOnly,
  overrideStarStyle = null,
  scoreInputStyleOverride = null,
  size = "med",
  withLabel = false,
}: Props): ReactElement {
  const [selectedValue, setSelectedValue] = useState<number>(value);
  const [hoveredValue, setHoveredValue] = useState<number>(0);

  useEffect(() => {
    if (value !== selectedValue) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSelect && onSelect(value);
  };

  const starInput = useMemo(() => {
    const remainderWasCalculated = false;
    const bars = Array(MAX_SCORE)
      .fill(null)
      .map((v, index) => {
        const starNumber = index + 1;

        if (readOnly) {
          const isStarSelected = starNumber <= selectedValue;

          return (
            (<div
              key={`star-${index}`}
              className={css(
                styles.star,
                styles.readOnly,
                overrideStarStyle,
                styles[`${size}SizeOfStar`]
              )}
            >
              {isStarSelected ? (
                <span className={css(styles.starIconFilled)}>
                  {<FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}
                </span>
              ) : (
                <span className={css(styles.starIconDisabled)}>
                  {<FontAwesomeIcon icon={faStarEmpty}></FontAwesomeIcon>}
                </span>
              )}
            </div>)
          );
        } else {
          const isStarSelected =
            starNumber <= selectedValue || starNumber <= hoveredValue;
          return (
            (<div
              key={`star-${index}`}
              className={`starRating ${css(
                styles.star,
                styles[`${size}SizeOfStar`],
                overrideStarStyle
              )}`}
              data-rating={index + 1}
              onClick={() => handleSelect(starNumber)}
              onMouseEnter={() => setHoveredValue(starNumber)}
              onMouseLeave={() => setHoveredValue(0)}
            >
              {isStarSelected ? (
                <span className={css(styles.starIconFilled)}>
                  {<FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}
                </span>
              ) : (
                <span className={css(styles.starIconUnfilled)}>
                  {<FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}
                </span>
              )}
            </div>)
          );
        }
      });

    return (
      <div className={css(styles.starInput)}>
        {withLabel && (
          <span className={css(styles.starLabel)}>
            {parseFloat(value + "").toFixed(1)}
          </span>
        )}
        {bars}
      </div>
    );
  }, [selectedValue, hoveredValue, readOnly]);

  return (
    <div className={css(styles.scoreInput, scoreInputStyleOverride)}>
      {starInput}
    </div>
  );
}

const styles = StyleSheet.create({
  scoreInput: {
    display: "flex",
    alignItems: "flex-start",
  },
  starInput: {
    display: "flex",
  },
  readOnly: {
    cursor: "initial",
  },
  star: {
    width: 24,
    height: 16,
    marginRight: 0,
    borderRadius: "1px",
    cursor: "pointer",
    position: "relative",
    color: "#e77600", //colors.DARKER_GREY(),
  },
  starLabel: {
    fontWeight: 500,
    fontSize: 16,
    color: colors.MEDIUM_GREY2(),
    marginRight: 10,
  },
  medSizeOfStar: {
    // width: 30,
    // height: 30,
  },
  smallSizeOfStar: {
    fontSize: 12,
    width: 18,
    height: 18,
  },
  starIconFilled: {
    color: colors.YELLOW(),
  },
  starIconUnfilled: {
    color: colors.LIGHT_GREY(),
    ":hover": {
      color: colors.YELLOW(),
    }
  },
  starIconDisabled: {
    color: colors.LIGHT_GREY(),
  },
  cover: {
    background: colors.NEW_BLUE(),
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
});
